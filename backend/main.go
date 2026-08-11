package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)

type APIResponse struct {
	Success   bool        `json:"success"`
	Message   string      `json:"message,omitempty"`
	Data      interface{} `json:"data,omitempty"`
	Timestamp string      `json:"timestamp"`
}

type HealthStatus struct {
	Status    string `json:"status"`
	Version   string `json:"version"`
	Service   string `json:"service"`
	Database  string `json:"database"`
	UptimeSec int64  `json:"uptime_seconds"`
}

var startTime = time.Now()

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("GET /accustandard/demo/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		status := HealthStatus{
			Status:    "OK",
			Version:   "1.0.0",
			Service:   "AccuStandard Go REST Backend",
			Database:  "PostgreSQL 16 (accustandard_demo_db)",
			UptimeSec: int64(time.Since(startTime).Seconds()),
		}
		json.NewEncoder(w).Encode(APIResponse{
			Success:   true,
			Data:      status,
			Timestamp: time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Inventory Endpoint
	mux.HandleFunc("GET /accustandard/demo/api/v1/inventory", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(APIResponse{
			Success:   true,
			Message:   "Fetched inventory list successfully",
			Timestamp: time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Quotations Endpoint
	mux.HandleFunc("GET /accustandard/demo/api/v1/quotations", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(APIResponse{
			Success:   true,
			Message:   "Fetched quotations list successfully",
			Timestamp: time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Purchase Orders Endpoint
	mux.HandleFunc("GET /accustandard/demo/api/v1/purchase-orders", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(APIResponse{
			Success:   true,
			Message:   "Fetched purchase orders list successfully",
			Timestamp: time.Now().UTC().Format(time.RFC3339),
		})
	})

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      corsMiddleware(mux),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	log.Printf("==> AccuStandard Go Backend listening on port %s...", port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server error: %v", err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
