package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"accustandard-backend/internal/db"
	"accustandard-backend/internal/models"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var (
	errInvalidPayload       = errors.New("invalid request payload")
	errUnknownInvoice       = errors.New("invoice not found")
	errAllocationOverrun    = errors.New("allocation exceeds available amount")
	errOverReceipt          = errors.New("received quantity exceeds approved PO quantity limit")
	errInvalidPOState       = errors.New("purchase order is not receivable in its current state")
	errInventoryUnavailable = errors.New("linked inventory stock is unavailable")
)

type workflowError struct {
	status  int
	message string
}

func (e workflowError) Error() string { return e.message }

const moneyTolerance = 0.000001

type allocationInput struct {
	InvoiceNo string  `json:"invoiceNo"`
	Amount    float64 `json:"amount"`
}

type collectionInput struct {
	CheckNo     string            `json:"checkNo"`
	Bank        string            `json:"bank"`
	Amount      float64           `json:"amount"`
	Allocations []allocationInput `json:"allocations"`
}

func decodeJSON(r *http.Request, dst interface{}) error {
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(dst); err != nil {
		return errInvalidPayload
	}
	var extra interface{}
	if err := decoder.Decode(&extra); err != io.EOF {
		return errInvalidPayload
	}
	return nil
}

func required(value string) bool {
	return strings.TrimSpace(value) != ""
}

func parseOptionalDate(value *string) (*time.Time, error) {
	if value == nil || strings.TrimSpace(*value) == "" {
		return nil, nil
	}
	parsed, err := time.Parse("2006-01-02", strings.TrimSpace(*value))
	if err != nil {
		return nil, fmt.Errorf("expiryDate must use YYYY-MM-DD")
	}
	return &parsed, nil
}

func finite(value float64) bool {
	return !math.IsNaN(value) && !math.IsInf(value, 0)
}

func validateAllocationInput(req collectionInput) (float64, error) {
	if !required(req.CheckNo) || !required(req.Bank) || req.Amount <= 0 ||
		!finite(req.Amount) || len(req.Allocations) == 0 {
		return 0, errInvalidPayload
	}

	var total float64
	for _, allocation := range req.Allocations {
		if !required(allocation.InvoiceNo) || allocation.Amount <= 0 ||
			!finite(allocation.Amount) {
			return 0, errInvalidPayload
		}
		total += allocation.Amount
	}
	if total-req.Amount > moneyTolerance {
		return 0, errAllocationOverrun
	}
	return total, nil
}

func validateApproval(role string) error {
	if !required(role) {
		return errInvalidPayload
	}
	return nil
}

func validateRejection(log models.ApprovalLog, role string) error {
	if err := validateApproval(role); err != nil {
		return err
	}
	if role == log.Maker {
		return fmt.Errorf("segregation of duties blocks maker rejection")
	}
	switch role {
	case "Marketing", "Reviewer":
		if log.ReviewerStatus != "PENDING" {
			return fmt.Errorf("reviewer stage is already finalized or invalid")
		}
	case "General Manager", "GM":
		if log.ReviewerStatus != "APPROVED" || log.GMStatus != "PENDING" {
			return fmt.Errorf("GM rejection requires an approved reviewer stage")
		}
	case "Chairman", "DCS", "Chairman (DCS)":
		if log.DocType == "Sales Quotation" {
			return fmt.Errorf("sales quotations do not have a DCS stage")
		}
		if log.GMStatus != "APPROVED" || log.DCSStatus != "PENDING" {
			return fmt.Errorf("DCS rejection requires an approved GM stage")
		}
	default:
		return fmt.Errorf("role is not allowed to reject this document")
	}
	return nil
}

func applyApproval(log *models.ApprovalLog, role string) error {
	if err := validateApproval(role); err != nil {
		return workflowError{status: http.StatusBadRequest, message: "Role is required"}
	}
	if role == "Admin" {
		switch {
		case log.ReviewerStatus == "PENDING":
			role = "Marketing"
		case log.GMStatus == "PENDING":
			role = "General Manager"
		case log.DCSStatus == "PENDING":
			role = "Chairman (DCS)"
		}
	}
	if role == log.Maker || (log.DocType == "Sales Quotation" && (role == "DCS" || role == "Chairman (DCS)")) {
		return workflowError{status: http.StatusForbidden, message: "Segregation of Duties blocked self-approval or invalid Sales Quote DCS approval."}
	}
	switch {
	case role == "Marketing" || role == "Reviewer":
		if log.ReviewerStatus == "APPROVED" || log.ReviewerStatus == "REJECTED" {
			return workflowError{status: http.StatusConflict, message: "Reviewer stage already finalized"}
		}
		log.ReviewerStatus = "APPROVED"
	case role == "General Manager" || role == "GM":
		if log.ReviewerStatus != "APPROVED" || log.GMStatus != "PENDING" {
			return workflowError{status: http.StatusConflict, message: "GM approval requires an approved reviewer stage"}
		}
		log.GMStatus = "APPROVED"
	case role == "Chairman" || role == "DCS" || role == "Chairman (DCS)":
		if log.DocType == "Sales Quotation" {
			return workflowError{status: http.StatusForbidden, message: "Sales Quotes end at GM approval; DCS stage is not required."}
		}
		if log.GMStatus != "APPROVED" || log.DCSStatus != "PENDING" {
			return workflowError{status: http.StatusConflict, message: "DCS approval requires an approved GM stage"}
		}
		log.DCSStatus = "APPROVED"
	default:
		return workflowError{status: http.StatusForbidden, message: "Role is not allowed to approve this document"}
	}
	return nil
}

func applyRejection(log *models.ApprovalLog, role string) error {
	if err := validateRejection(*log, role); err != nil {
		status := http.StatusConflict
		if strings.Contains(err.Error(), "role is not allowed") || strings.Contains(err.Error(), "segregation") {
			status = http.StatusForbidden
		}
		return workflowError{status: status, message: err.Error()}
	}
	switch {
	case role == "Marketing" || role == "Reviewer":
		log.ReviewerStatus = "REJECTED"
	case role == "General Manager" || role == "GM":
		log.GMStatus = "REJECTED"
	case role == "Chairman" || role == "DCS" || role == "Chairman (DCS)":
		log.DCSStatus = "REJECTED"
	}
	return nil
}

func recordApprovalAudit(tx *gorm.DB, role, action string, log models.ApprovalLog) error {
	return tx.Create(&models.AuditLog{
		ID:     uuid.New(),
		Time:   time.Now().UTC().Format(time.RFC3339),
		User:   role,
		Action: fmt.Sprintf("%s %s approval record %s", action, log.DocType, log.QRN),
	}).Error
}

func rfpRequiresDCS(amount float64) bool {
	rawThreshold := strings.TrimSpace(os.Getenv("DCS_RFP_THRESHOLD"))
	if rawThreshold == "" {
		return false
	}
	threshold, err := strconv.ParseFloat(rawThreshold, 64)
	return err == nil && threshold >= 0 && amount >= threshold
}

func enforceOpenPOControl(tx *gorm.DB, po *models.PurchaseOrder) error {
	if po.SKU == "" {
		return nil
	}
	var openPOs []models.PurchaseOrder
	if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("sku = ? AND status NOT IN ?", po.SKU, []string{"CLOSED", "CANCELLED", "VERIFIED_3WAY"}).
		Find(&openPOs).Error; err != nil {
		return err
	}
	var openQty int
	for _, openPO := range openPOs {
		openQty += openPO.POQty - openPO.RRQtyReceived
	}
	if openQty <= 0 {
		return nil
	}
	if po.POQty <= openQty {
		return workflowError{status: http.StatusConflict, message: "OPEN_PO_CONTROL: an open PO already covers this SKU"}
	}
	if !po.IsShortageException || po.ShortageReason == nil || !required(*po.ShortageReason) {
		return workflowError{status: http.StatusConflict, message: "SHORTAGE_EXCEPTION_REQUIRED: explain the uncovered SKU quantity before creating a shortage PO"}
	}
	originalQty := po.POQty
	po.POQty -= openQty
	po.TotalAmount = po.TotalAmount * float64(po.POQty) / float64(originalQty)
	return nil
}

func canReceivePO(status string) bool {
	switch status {
	case "PENDING_RECEIVING", "PARTIALLY_RECEIVED", "APPROVED", "AWAITING_RECEIVING":
		return true
	default:
		return false
	}
}

func respondDBError(w http.ResponseWriter, err error) {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "Record not found"})
		return
	}
	respondJSON(w, http.StatusInternalServerError, map[string]string{"error": "Database operation failed"})
}

func RegisterRoutes(r chi.Router) {
	r.Get("/health", HealthCheck)
	r.Get("/readiness", ReadinessCheck)

	r.Get("/inventory", GetInventory)
	r.Post("/inventory/receive", ReceiveInventory)
	r.Get("/replenishment", GetReplenishment)
	r.Get("/rfqs", GetRFQs)
	r.Post("/rfqs", CreateRFQ)
	r.Get("/approvals", GetApprovals)
	r.Post("/approvals/{id}/approve", ApproveDocument)
	r.Post("/approvals/{id}/reject", RejectDocument)
	r.Get("/soa", GetSOA)
	r.Post("/soa/allocate-collection", AllocateCollection)
	r.Get("/purchase-orders", GetPurchaseOrders)
	r.Post("/purchase-orders", CreatePurchaseOrder)
	r.Get("/rfps", GetRFPs)
	r.Post("/rfps", CreateRFP)
	r.Post("/rfps/{id}/release", ReleaseRFP)
	r.Get("/qbo-queue", GetQBOQueue)
	r.Post("/qbo-queue/{id}/sync", SyncQBOItem)
	r.Get("/audit-logs", GetAuditLogs)
}

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, map[string]string{
		"status":    "healthy",
		"service":   "accustandard-go-backend",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func ReadinessCheck(w http.ResponseWriter, r *http.Request) {
	if db.DB == nil {
		respondJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "unready", "db": "not initialized"})
		return
	}
	sqlDB, err := db.DB.DB()
	if err != nil {
		respondJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "unready", "db": "disconnected"})
		return
	}
	if err := sqlDB.Ping(); err != nil {
		respondJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "unready", "db": "disconnected"})
		return
	}
	respondJSON(w, http.StatusOK, map[string]string{"status": "ready", "db": "connected"})
}

func GetInventory(w http.ResponseWriter, r *http.Request) {
	var stocks []models.InventoryStock
	if err := db.DB.Find(&stocks).Error; err != nil {
		respondDBError(w, err)
		return
	}

	var result []map[string]interface{}
	for _, s := range stocks {
		var item models.Item
		var loc models.Location
		if err := db.DB.First(&item, "id = ?", s.ItemID).Error; err != nil {
			respondDBError(w, err)
			return
		}
		if err := db.DB.First(&loc, "id = ?", s.LocationID).Error; err != nil {
			respondDBError(w, err)
			return
		}

		avail := s.QtyOnHand - s.QtyReserved
		status := "NORMAL"
		if s.ExpiryDate != nil && s.ExpiryDate.Before(time.Now().AddDate(0, 3, 0)) {
			status = "NEAR_EXPIRY"
		}

		lotNo := "N/A"
		if s.BatchNumber != nil {
			lotNo = *s.BatchNumber
		}
		expDate := ""
		if s.ExpiryDate != nil {
			expDate = s.ExpiryDate.Format("2006-01-02")
		}

		locName := loc.Name
		if loc.Code == "PAM" {
			locName = "Pampanga"
		} else if loc.Code == "QC" {
			locName = "Quezon City"
		}

		result = append(result, map[string]interface{}{
			"id":          s.ID.String(),
			"sku":         item.SKU,
			"description": item.Description,
			"location":    locName,
			"lotNumber":   lotNo,
			"expiryDate":  expDate,
			"onHand":      s.QtyOnHand,
			"reserved":    s.QtyReserved,
			"available":   avail,
			"unit":        item.Unit,
			"status":      status,
		})
	}

	respondJSON(w, http.StatusOK, result)
}

func ReceiveInventory(w http.ResponseWriter, r *http.Request) {
	var req struct {
		PONumber     string  `json:"poNumber"`
		QtyReceived  int     `json:"qtyReceived"`
		BatchNumber  string  `json:"batchNumber"`
		LocationCode string  `json:"locationCode"`
		ExpiryDate   *string `json:"expiryDate"`
		SerialNumber string  `json:"serialNumber"`
	}
	if err := decodeJSON(r, &req); err != nil || !required(req.PONumber) || req.QtyReceived <= 0 {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
		return
	}
	expiryDate, err := parseOptionalDate(req.ExpiryDate)
	if err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	var po models.PurchaseOrder
	txErr := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("po_number = ?", req.PONumber).First(&po).Error; err != nil {
			return err
		}
		if !canReceivePO(po.Status) {
			return errInvalidPOState
		}
		if po.POQty <= 0 || po.RRQtyReceived < 0 || po.RRQtyReceived > po.POQty {
			return errInvalidPOState
		}
		if po.RRQtyReceived+req.QtyReceived > po.POQty {
			return fmt.Errorf("HARD_BLOCK: %w", errOverReceipt)
		}

		var item models.Item
		itemQuery := tx
		if required(po.SKU) {
			itemQuery = itemQuery.Where("sku = ?", po.SKU)
		} else {
			itemQuery = itemQuery.Where("description = ?", po.ItemDescription)
		}
		if err := itemQuery.First(&item).Error; err != nil {
			return fmt.Errorf("%w: item for PO is unavailable: %v", errInventoryUnavailable, err)
		}

		var location models.Location
		if required(req.LocationCode) {
			if err := tx.Where("code = ?", req.LocationCode).First(&location).Error; err != nil {
				return fmt.Errorf("%w: location %q", errInventoryUnavailable, req.LocationCode)
			}
			if !location.IsActive {
				return fmt.Errorf("%w: location %q is inactive", errInventoryUnavailable, req.LocationCode)
			}
		}

		var stock models.InventoryStock
		stockQuery := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("item_id = ?", item.ID)
		if location.ID != uuid.Nil {
			stockQuery = stockQuery.Where("location_id = ?", location.ID)
		}
		if required(req.BatchNumber) {
			stockQuery = stockQuery.Where("batch_number = ?", req.BatchNumber)
		}
		if required(req.SerialNumber) {
			stockQuery = stockQuery.Where("serial_number = ?", req.SerialNumber)
		}
		stockErr := stockQuery.Order("id").First(&stock).Error
		if errors.Is(stockErr, gorm.ErrRecordNotFound) && location.ID == uuid.Nil {
			return fmt.Errorf("%w: locationCode is required when no stock exists", errInventoryUnavailable)
		}
		if stockErr != nil && !errors.Is(stockErr, gorm.ErrRecordNotFound) {
			return stockErr
		}
		if errors.Is(stockErr, gorm.ErrRecordNotFound) {
			if location.ID == uuid.Nil {
				return errInventoryUnavailable
			}
			stock = models.InventoryStock{
				ID:         uuid.New(),
				LocationID: location.ID,
				ItemID:     item.ID,
				QtyOnHand:  0,
			}
		}
		if stock.BatchNumber == nil && required(req.BatchNumber) {
			stock.BatchNumber = &req.BatchNumber
		}
		if expiryDate != nil {
			stock.ExpiryDate = expiryDate
		}
		if stock.SerialNumber == nil && required(req.SerialNumber) {
			stock.SerialNumber = &req.SerialNumber
		}
		stock.QtyOnHand += req.QtyReceived
		if stockErr == nil {
			if err := tx.Save(&stock).Error; err != nil {
				return err
			}
		} else if err := tx.Create(&stock).Error; err != nil {
			return err
		}

		po.RRQtyReceived += req.QtyReceived
		if po.RRQtyReceived >= po.POQty {
			po.Status = "AWAITING_VENDOR_INVOICE"
		} else {
			po.Status = "PARTIALLY_RECEIVED"
		}
		return tx.Save(&po).Error
	})
	if txErr != nil {
		if errors.Is(txErr, gorm.ErrRecordNotFound) {
			respondJSON(w, http.StatusNotFound, map[string]string{"error": "PO not found"})
		} else if errors.Is(txErr, errInvalidPOState) {
			respondJSON(w, http.StatusConflict, map[string]string{"error": txErr.Error()})
		} else if errors.Is(txErr, errInventoryUnavailable) {
			respondJSON(w, http.StatusNotFound, map[string]string{"error": txErr.Error()})
		} else if errors.Is(txErr, errOverReceipt) {
			respondJSON(w, http.StatusConflict, map[string]string{"error": txErr.Error()})
		} else {
			respondDBError(w, txErr)
		}
		return
	}

	respondJSON(w, http.StatusOK, po)
}

func GetReplenishment(w http.ResponseWriter, r *http.Request) {
	var items []models.ReplenishmentItem
	if err := db.DB.Find(&items).Error; err != nil {
		respondDBError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, items)
}

func GetRFQs(w http.ResponseWriter, r *http.Request) {
	var items []models.RFQItem
	if err := db.DB.Find(&items).Error; err != nil {
		respondDBError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, items)
}

func CreateRFQ(w http.ResponseWriter, r *http.Request) {
	var item models.RFQItem
	if err := decodeJSON(r, &item); err != nil || !required(item.CustomerName) ||
		!required(item.RequestedBy) || item.CensusPerDay <= 0 ||
		item.ExpectedContractMonths <= 0 || !required(item.MarketingROIStatus) ||
		item.ProposedSellingPrice <= 0 || item.LandedCostPerUnit < 0 ||
		item.ExpectedMarginPct < 0 || item.ExpectedMarginPct > 100 {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}
	item.ID = uuid.New()
	if item.RFQNo == "" {
		item.RFQNo = "RFQ-2026-" + time.Now().Format("0504")
	}
	if err := db.DB.Create(&item).Error; err != nil {
		respondDBError(w, err)
		return
	}
	respondJSON(w, http.StatusCreated, item)
}

func GetApprovals(w http.ResponseWriter, r *http.Request) {
	var logs []models.ApprovalLog
	if err := db.DB.Find(&logs).Error; err != nil {
		respondDBError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, logs)
}

func ApproveDocument(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	var req struct {
		Role string `json:"role"`
	}
	if err := decodeJSON(r, &req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Role is required"})
		return
	}

	var log models.ApprovalLog
	txErr := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("id = ? OR qrn = ?", idStr, idStr).First(&log).Error; err != nil {
			return err
		}
		if err := applyApproval(&log, req.Role); err != nil {
			return err
		}
		if err := tx.Save(&log).Error; err != nil {
			return err
		}
		if log.DocType == "Request for Payment" {
			var rfp models.PaymentRequest
			if err := tx.Where("rfp_number = ?", log.QRN).First(&rfp).Error; err != nil {
				return err
			}
			switch {
			case log.DCSStatus == "APPROVED":
				rfp.Status = "APPROVED_DCS"
			case log.GMStatus == "APPROVED":
				if log.DCSStatus == "PENDING" {
					rfp.Status = "PENDING_DCS"
				} else {
					rfp.Status = "APPROVED"
				}
			}
			if err := tx.Save(&rfp).Error; err != nil {
				return err
			}
		}
		return recordApprovalAudit(tx, req.Role, "Approved", log)
	})
	if txErr != nil {
		var stateErr workflowError
		if errors.As(txErr, &stateErr) {
			respondJSON(w, stateErr.status, map[string]string{"error": stateErr.message})
		} else if errors.Is(txErr, gorm.ErrRecordNotFound) {
			respondJSON(w, http.StatusNotFound, map[string]string{"error": "Approval record not found"})
		} else {
			respondDBError(w, txErr)
		}
		return
	}

	respondJSON(w, http.StatusOK, log)
}

func RejectDocument(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	var req struct {
		Role    string `json:"role"`
		Remarks string `json:"remarks"`
	}
	if err := decodeJSON(r, &req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
		return
	}

	var log models.ApprovalLog
	txErr := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("id = ? OR qrn = ?", idStr, idStr).First(&log).Error; err != nil {
			return err
		}
		if err := applyRejection(&log, req.Role); err != nil {
			return err
		}
		if err := tx.Save(&log).Error; err != nil {
			return err
		}
		if log.DocType == "Request for Payment" {
			if err := tx.Model(&models.PaymentRequest{}).Where("rfp_number = ?", log.QRN).Update("status", "REJECTED").Error; err != nil {
				return err
			}
		}
		return recordApprovalAudit(tx, req.Role, "Rejected", log)
	})
	if txErr != nil {
		var stateErr workflowError
		if errors.As(txErr, &stateErr) {
			respondJSON(w, stateErr.status, map[string]string{"error": stateErr.message})
		} else if errors.Is(txErr, gorm.ErrRecordNotFound) {
			respondJSON(w, http.StatusNotFound, map[string]string{"error": "Approval record not found"})
		} else {
			respondDBError(w, txErr)
		}
		return
	}

	respondJSON(w, http.StatusOK, log)
}

func GetSOA(w http.ResponseWriter, r *http.Request) {
	var items []models.SOAItem
	if err := db.DB.Find(&items).Error; err != nil {
		respondDBError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, items)
}

func AllocateCollection(w http.ResponseWriter, r *http.Request) {
	var req collectionInput
	if err := decodeJSON(r, &req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
		return
	}
	totalAllocated, err := validateAllocationInput(req)
	if err != nil {
		if errors.Is(err, errAllocationOverrun) {
			respondJSON(w, http.StatusConflict, map[string]string{"error": err.Error()})
		} else {
			respondJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		return
	}

	txErr := db.DB.Transaction(func(tx *gorm.DB) error {
		var existingPayment models.CollectionPayment
		paymentErr := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("check_no = ?", req.CheckNo).First(&existingPayment).Error
		if paymentErr == nil {
			return workflowError{status: http.StatusConflict, message: "collection check has already been allocated"}
		}
		if !errors.Is(paymentErr, gorm.ErrRecordNotFound) {
			return paymentErr
		}
		for _, allocation := range req.Allocations {
			var soaItem models.SOAItem
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
				Where("sales_invoice_no = ?", allocation.InvoiceNo).
				First(&soaItem).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return fmt.Errorf("%w: %s", errUnknownInvoice, allocation.InvoiceNo)
				}
				return err
			}
			if allocation.Amount-soaItem.InvoiceBalance > moneyTolerance {
				return fmt.Errorf("%w: %s", errAllocationOverrun, allocation.InvoiceNo)
			}
			soaItem.AmountPaid += allocation.Amount
			soaItem.InvoiceBalance -= allocation.Amount
			if math.Abs(soaItem.InvoiceBalance) <= moneyTolerance {
				soaItem.InvoiceBalance = 0
			}
			if err := tx.Save(&soaItem).Error; err != nil {
				return err
			}
		}
		unappliedCredit := req.Amount - totalAllocated
		if unappliedCredit < 0 {
			unappliedCredit = 0
		}
		var existingQueue models.QBOQueueItem
		queueErr := tx.Where("doc_type = ? AND doc_number = ?", "Customer Payment Collection", req.CheckNo).First(&existingQueue).Error
		if queueErr == nil {
			return workflowError{status: http.StatusConflict, message: "collection check is already queued for export"}
		}
		if !errors.Is(queueErr, gorm.ErrRecordNotFound) {
			return queueErr
		}
		now := time.Now()
		if err := tx.Create(&models.CollectionPayment{
			ID:              uuid.New(),
			CheckNo:         req.CheckNo,
			Bank:            req.Bank,
			Amount:          req.Amount,
			AllocatedTotal:  totalAllocated,
			UnappliedCredit: unappliedCredit,
		}).Error; err != nil {
			return err
		}
		if err := tx.Create(&models.QBOQueueItem{
			ID:           uuid.New(),
			DocType:      "Customer Payment Collection",
			DocNumber:    req.CheckNo,
			EntityName:   "Customer Collection",
			Amount:       req.Amount,
			QBORefID:     "Awaiting Manual Export",
			SyncStatus:   "QUEUED",
			LastAttempt:  now,
			ErrorMessage: "",
		}).Error; err != nil {
			return err
		}
		return tx.Create(&models.AuditLog{
			ID:     uuid.New(),
			Time:   now.UTC().Format(time.RFC3339),
			User:   "Collection Allocation",
			Action: fmt.Sprintf("Allocated collection check %s", req.CheckNo),
		}).Error
	})
	if txErr != nil {
		var stateErr workflowError
		if errors.As(txErr, &stateErr) {
			respondJSON(w, stateErr.status, map[string]string{"error": stateErr.message})
			return
		}
		switch {
		case errors.Is(txErr, errUnknownInvoice):
			respondJSON(w, http.StatusNotFound, map[string]string{"error": txErr.Error()})
		case errors.Is(txErr, errAllocationOverrun):
			respondJSON(w, http.StatusConflict, map[string]string{"error": txErr.Error()})
		default:
			respondDBError(w, txErr)
		}
		return
	}

	unapplied := req.Amount - totalAllocated
	if unapplied < 0 {
		unapplied = 0
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"status":          "SUCCESS",
		"allocatedTotal":  totalAllocated,
		"unappliedCredit": unapplied,
	})
}

func GetPurchaseOrders(w http.ResponseWriter, r *http.Request) {
	var pos []models.PurchaseOrder
	if err := db.DB.Find(&pos).Error; err != nil {
		respondDBError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, pos)
}

func CreatePurchaseOrder(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		models.PurchaseOrder
		ItemClass        string `json:"itemClass"`
		LinkedCustomerPO string `json:"linkedCustomerPO"`
	}
	if err := decodeJSON(r, &payload); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}
	po := payload.PurchaseOrder
	po.ItemClass = payload.ItemClass
	po.LinkedCustomerPO = payload.LinkedCustomerPO
	if !required(po.VendorName) || !required(po.ItemDescription) || po.POQty <= 0 ||
		po.TotalAmount <= 0 || !finite(po.TotalAmount) {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid purchase order payload"})
		return
	}

	// Class 3 validation check
	if payload.ItemClass == "Class 3 (Short-Expiry / Special)" && (payload.LinkedCustomerPO == "" || payload.LinkedCustomerPO == "N/A") {
		respondJSON(w, http.StatusForbidden, map[string]string{
			"error": "Class 3 items require a valid linked Customer PO before creating a supplier PO.",
		})
		return
	}
	po.ID = uuid.New()
	po.Status = "PENDING_ACCOUNTING"
	po.RRQtyReceived = 0
	po.InvoiceRef = "Awaiting Receipt"
	if po.PONumber == "" {
		po.PONumber = "PO-2026-" + time.Now().Format("0504")
	}
	po.CreatedAt = time.Now()
	txErr := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := enforceOpenPOControl(tx, &po); err != nil {
			return err
		}
		return tx.Create(&po).Error
	})
	if txErr != nil {
		var stateErr workflowError
		if errors.As(txErr, &stateErr) {
			respondJSON(w, stateErr.status, map[string]string{"error": stateErr.message})
		} else {
			respondDBError(w, txErr)
		}
		return
	}
	respondJSON(w, http.StatusCreated, po)
}

func GetRFPs(w http.ResponseWriter, r *http.Request) {
	var rfps []models.PaymentRequest
	if err := db.DB.Find(&rfps).Error; err != nil {
		respondDBError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, rfps)
}

func CreateRFP(w http.ResponseWriter, r *http.Request) {
	var rfp models.PaymentRequest
	if err := decodeJSON(r, &rfp); err != nil || !required(rfp.Payee) ||
		!required(rfp.GLAccount) || !required(rfp.Description) || rfp.Amount <= 0 ||
		!finite(rfp.Amount) || !required(rfp.RequestedBy) {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}
	rfp.ID = uuid.New()
	rfp.Status = "PENDING_GM"
	rfp.ReleasedBank = nil
	rfp.ReleasedRefNo = nil
	rfp.ReleasedAt = nil
	if rfp.RFPNumber == "" {
		rfp.RFPNumber = "RFP-2026-" + time.Now().Format("0504")
	}
	rfp.CreatedAt = time.Now()
	txErr := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&rfp).Error; err != nil {
			return err
		}
		dcsStatus := "NOT_REQUIRED"
		if rfpRequiresDCS(rfp.Amount) {
			dcsStatus = "PENDING"
		}
		return tx.Create(&models.ApprovalLog{
			ID:             uuid.New(),
			QRN:            rfp.RFPNumber,
			DocType:        "Request for Payment",
			Maker:          rfp.RequestedBy,
			ReviewerStatus: "APPROVED",
			GMStatus:       "PENDING",
			DCSStatus:      dcsStatus,
			TotalAmount:    rfp.Amount,
		}).Error
	})
	if txErr != nil {
		respondDBError(w, txErr)
		return
	}
	respondJSON(w, http.StatusCreated, rfp)
}

func ReleaseRFP(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	var req struct {
		Bank  string `json:"bank"`
		RefNo string `json:"refNo"`
	}
	if err := decodeJSON(r, &req); err != nil || !required(req.Bank) || !required(req.RefNo) {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
		return
	}

	var rfp models.PaymentRequest
	txErr := db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("id = ? OR rfp_number = ?", idStr, idStr).First(&rfp).Error; err != nil {
			return err
		}
		if rfp.Status == "DISBURSED_PAID" {
			return workflowError{status: http.StatusConflict, message: "RFP has already been released"}
		}
		if rfp.Status != "APPROVED_DCS" && rfp.Status != "APPROVED" && rfp.Status != "PENDING_BANK_RELEASING" {
			return workflowError{status: http.StatusConflict, message: "RFP release requires completed approval"}
		}
		var approval models.ApprovalLog
		if err := tx.Where("qrn = ?", rfp.RFPNumber).First(&approval).Error; err == nil {
			if approval.GMStatus != "APPROVED" || (approval.DCSStatus != "APPROVED" && approval.DCSStatus != "NOT_REQUIRED") {
				return workflowError{status: http.StatusConflict, message: "RFP release requires completed approval stages"}
			}
		} else if errors.Is(err, gorm.ErrRecordNotFound) {
			return workflowError{status: http.StatusConflict, message: "RFP release requires an approval record"}
		} else {
			return err
		}
		now := time.Now()
		rfp.Status = "DISBURSED_PAID"
		rfp.ReleasedBank = &req.Bank
		rfp.ReleasedRefNo = &req.RefNo
		rfp.ReleasedAt = &now
		if err := tx.Save(&rfp).Error; err != nil {
			return err
		}
		return tx.Create(&models.AuditLog{
			ID:     uuid.New(),
			Time:   now.UTC().Format(time.RFC3339),
			User:   "RFP Bank Release",
			Action: fmt.Sprintf("Released RFP %s through bank %s", rfp.RFPNumber, req.Bank),
		}).Error
	})
	if txErr != nil {
		var stateErr workflowError
		if errors.As(txErr, &stateErr) {
			respondJSON(w, stateErr.status, map[string]string{"error": stateErr.message})
		} else if errors.Is(txErr, gorm.ErrRecordNotFound) {
			respondJSON(w, http.StatusNotFound, map[string]string{"error": "RFP not found"})
		} else {
			respondDBError(w, txErr)
		}
		return
	}

	respondJSON(w, http.StatusOK, rfp)
}

func GetQBOQueue(w http.ResponseWriter, r *http.Request) {
	var qbo []models.QBOQueueItem
	if err := db.DB.Find(&qbo).Error; err != nil {
		respondDBError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, qbo)
}

func SyncQBOItem(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	var item models.QBOQueueItem
	if err := db.DB.Where("id = ? OR doc_number = ?", idStr, idStr).First(&item).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			respondJSON(w, http.StatusNotFound, map[string]string{"error": "QBO item not found"})
		} else {
			respondDBError(w, err)
		}
		return
	}

	item.SyncStatus = "SYNCED"
	item.QBORefID = "QBO-SYNC-" + time.Now().Format("150405")
	item.LastAttempt = time.Now()
	if err := db.DB.Save(&item).Error; err != nil {
		respondDBError(w, err)
		return
	}

	respondJSON(w, http.StatusOK, item)
}

func GetAuditLogs(w http.ResponseWriter, r *http.Request) {
	var logs []models.AuditLog
	if err := db.DB.Find(&logs).Error; err != nil {
		respondDBError(w, err)
		return
	}
	respondJSON(w, http.StatusOK, logs)
}

func respondJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}
