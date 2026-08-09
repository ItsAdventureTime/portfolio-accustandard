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
	r.Get("/replenishment", GetReplenishment)
	r.Get("/rfqs", GetRFQs)
	r.Post("/rfqs", CreateRFQ)
	r.Get("/approvals", GetApprovals)
	r.Get("/soa", GetSOA)
	r.Get("/purchase-orders", GetPurchaseOrders)
	r.Get("/rfps", GetRFPs)
	r.Post("/rfps", CreateRFP)
	r.Get("/qbo-queue", GetQBOQueue)
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

	// Enrich response with item descriptions & location names
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

func GetSOA(w http.ResponseWriter, r *http.Request) {
	var items []models.SOAItem
	db.DB.Find(&items)
	respondJSON(w, http.StatusOK, items)
}

func GetPurchaseOrders(w http.ResponseWriter, r *http.Request) {
	var pos []models.PurchaseOrder
	db.DB.Find(&pos)
	respondJSON(w, http.StatusOK, pos)
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

func GetQBOQueue(w http.ResponseWriter, r *http.Request) {
	var qbo []models.QBOQueueItem
	db.DB.Find(&qbo)
	respondJSON(w, http.StatusOK, qbo)
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
