package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"accustandard-backend/internal/db"
	"accustandard-backend/internal/models"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

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
	sqlDB, err := db.DB.DB()
	if err != nil || sqlDB.Ping() != nil {
		respondJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "unready", "db": "disconnected"})
		return
	}
	respondJSON(w, http.StatusOK, map[string]string{"status": "ready", "db": "connected"})
}

func GetInventory(w http.ResponseWriter, r *http.Request) {
	var stocks []models.InventoryStock
	db.DB.Find(&stocks)

	var result []map[string]interface{}
	for _, s := range stocks {
		var item models.Item
		var loc models.Location
		db.DB.First(&item, "id = ?", s.ItemID)
		db.DB.First(&loc, "id = ?", s.LocationID)

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
		PONumber    string `json:"poNumber"`
		QtyReceived int    `json:"qtyReceived"`
		BatchNumber string `json:"batchNumber"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
		return
	}

	var po models.PurchaseOrder
	if err := db.DB.Where("po_number = ?", req.PONumber).First(&po).Error; err != nil {
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "PO not found"})
		return
	}

	// COSO Fraud Control: Hard Block over-receiving beyond approved PO quantity
	if po.RRQtyReceived+req.QtyReceived > po.POQty {
		respondJSON(w, http.StatusForbidden, map[string]string{
			"error": "HARD_BLOCK: Received quantity exceeds approved PO quantity limit. PO revision required.",
		})
		return
	}

	po.RRQtyReceived += req.QtyReceived
	if po.RRQtyReceived >= po.POQty {
		po.Status = "VERIFIED_3WAY"
	} else {
		po.Status = "PARTIALLY_RECEIVED"
	}
	db.DB.Save(&po)

	respondJSON(w, http.StatusOK, po)
}

func GetReplenishment(w http.ResponseWriter, r *http.Request) {
	var items []models.ReplenishmentItem
	db.DB.Find(&items)
	respondJSON(w, http.StatusOK, items)
}

func GetRFQs(w http.ResponseWriter, r *http.Request) {
	var items []models.RFQItem
	db.DB.Find(&items)
	respondJSON(w, http.StatusOK, items)
}

func CreateRFQ(w http.ResponseWriter, r *http.Request) {
	var item models.RFQItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}
	item.ID = uuid.New()
	if item.RFQNo == "" {
		item.RFQNo = "RFQ-2026-" + time.Now().Format("0504")
	}
	db.DB.Create(&item)
	respondJSON(w, http.StatusCreated, item)
}

func GetApprovals(w http.ResponseWriter, r *http.Request) {
	var logs []models.ApprovalLog
	db.DB.Find(&logs)
	respondJSON(w, http.StatusOK, logs)
}

func ApproveDocument(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	var req struct {
		Role string `json:"role"`
	}
	_ = json.NewDecoder(r.Body).Decode(&req)

	var log models.ApprovalLog
	if err := db.DB.Where("id = ? OR qrn = ?", idStr, idStr).First(&log).Error; err != nil {
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "Approval record not found"})
		return
	}

	// Advance approval pipeline according to role
	if req.Role == "Marketing" || req.Role == "Reviewer" {
		log.ReviewerStatus = "APPROVED"
	} else if req.Role == "General Manager" || req.Role == "GM" {
		log.GMStatus = "APPROVED"
	} else if req.Role == "Chairman" || req.Role == "DCS" {
		log.DCSStatus = "APPROVED"
	}
	db.DB.Save(&log)

	respondJSON(w, http.StatusOK, log)
}

func RejectDocument(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	var req struct {
		Role    string `json:"role"`
		Remarks string `json:"remarks"`
	}
	_ = json.NewDecoder(r.Body).Decode(&req)

	var log models.ApprovalLog
	if err := db.DB.Where("id = ? OR qrn = ?", idStr, idStr).First(&log).Error; err != nil {
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "Approval record not found"})
		return
	}

	if req.Role == "Marketing" || req.Role == "Reviewer" {
		log.ReviewerStatus = "REJECTED"
	} else if req.Role == "General Manager" || req.Role == "GM" {
		log.GMStatus = "REJECTED"
	} else if req.Role == "Chairman" || req.Role == "DCS" {
		log.DCSStatus = "REJECTED"
	}
	db.DB.Save(&log)

	respondJSON(w, http.StatusOK, log)
}

func GetSOA(w http.ResponseWriter, r *http.Request) {
	var items []models.SOAItem
	db.DB.Find(&items)
	respondJSON(w, http.StatusOK, items)
}

func AllocateCollection(w http.ResponseWriter, r *http.Request) {
	var req struct {
		CheckNo    string `json:"checkNo"`
		Bank       string `json:"bank"`
		Amount     float64 `json:"amount"`
		Allocations []struct {
			InvoiceNo string  `json:"invoiceNo"`
			Amount    float64 `json:"amount"`
		} `json:"allocations"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
		return
	}

	var totalAllocated float64
	for _, a := range req.Allocations {
		totalAllocated += a.Amount
		var soaItem models.SOAItem
		if err := db.DB.Where("sales_invoice_no = ?", a.InvoiceNo).First(&soaItem).Error; err == nil {
			soaItem.AmountPaid += a.Amount
			if soaItem.InvoiceBalance >= a.Amount {
				soaItem.InvoiceBalance -= a.Amount
			} else {
				soaItem.InvoiceBalance = 0
			}
			db.DB.Save(&soaItem)
		}
	}

	unapplied := req.Amount - totalAllocated
	if unapplied < 0 {
		unapplied = 0
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"status":           "SUCCESS",
		"allocatedTotal":   totalAllocated,
		"unappliedCredit": unapplied,
	})
}

func GetPurchaseOrders(w http.ResponseWriter, r *http.Request) {
	var pos []models.PurchaseOrder
	db.DB.Find(&pos)
	respondJSON(w, http.StatusOK, pos)
}

func CreatePurchaseOrder(w http.ResponseWriter, r *http.Request) {
	var po models.PurchaseOrder
	if err := json.NewDecoder(r.Body).Decode(&po); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}

	// Class 3 validation check
	var req struct {
		ItemClass        string `json:"itemClass"`
		LinkedCustomerPO string `json:"linkedCustomerPO"`
	}
	_ = json.NewDecoder(r.Body).Decode(&req)
	if req.ItemClass == "Class 3 (Short-Expiry / Special)" && (req.LinkedCustomerPO == "" || req.LinkedCustomerPO == "N/A") {
		respondJSON(w, http.StatusForbidden, map[string]string{
			"error": "Class 3 items require a valid linked Customer PO before creating a supplier PO.",
		})
		return
	}

	po.ID = uuid.New()
	if po.PONumber == "" {
		po.PONumber = "PO-2026-" + time.Now().Format("0504")
	}
	po.CreatedAt = time.Now()
	db.DB.Create(&po)
	respondJSON(w, http.StatusCreated, po)
}

func GetRFPs(w http.ResponseWriter, r *http.Request) {
	var rfps []models.PaymentRequest
	db.DB.Find(&rfps)
	respondJSON(w, http.StatusOK, rfps)
}

func CreateRFP(w http.ResponseWriter, r *http.Request) {
	var rfp models.PaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&rfp); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}
	rfp.ID = uuid.New()
	if rfp.RFPNumber == "" {
		rfp.RFPNumber = "RFP-2026-" + time.Now().Format("0504")
	}
	rfp.CreatedAt = time.Now()
	db.DB.Create(&rfp)
	respondJSON(w, http.StatusCreated, rfp)
}

func ReleaseRFP(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	var req struct {
		Bank  string `json:"bank"`
		RefNo string `json:"refNo"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
		return
	}

	var rfp models.PaymentRequest
	if err := db.DB.Where("id = ? OR rfp_number = ?", idStr, idStr).First(&rfp).Error; err != nil {
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "RFP not found"})
		return
	}

	now := time.Now()
	rfp.Status = "DISBURSED_PAID"
	rfp.ReleasedBank = &req.Bank
	rfp.ReleasedRefNo = &req.RefNo
	rfp.ReleasedAt = &now
	db.DB.Save(&rfp)

	respondJSON(w, http.StatusOK, rfp)
}

func GetQBOQueue(w http.ResponseWriter, r *http.Request) {
	var qbo []models.QBOQueueItem
	db.DB.Find(&qbo)
	respondJSON(w, http.StatusOK, qbo)
}

func SyncQBOItem(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	var item models.QBOQueueItem
	if err := db.DB.Where("id = ? OR doc_number = ?", idStr, idStr).First(&item).Error; err != nil {
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "QBO item not found"})
		return
	}

	item.SyncStatus = "SYNCED"
	item.QBORefID = "QBO-SYNC-" + time.Now().Format("150405")
	item.LastAttempt = time.Now()
	db.DB.Save(&item)

	respondJSON(w, http.StatusOK, item)
}

func GetAuditLogs(w http.ResponseWriter, r *http.Request) {
	var logs []models.AuditLog
	db.DB.Find(&logs)
	respondJSON(w, http.StatusOK, logs)
}

func respondJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

