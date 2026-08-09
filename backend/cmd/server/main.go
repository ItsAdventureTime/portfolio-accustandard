package main

import (
	"log"
	"net/http"
	"os"

	"accustandard-backend/internal/db"
	"accustandard-backend/internal/handlers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://accustandard:accustandardpass@localhost:5432/accustandard_demo_db?sslmode=disable"
	}

	log.Printf("==> Accustandard Go Backend initializing (Port: %s)...", port)
	_, err := db.InitDB(dsn)
	if err != nil {
		log.Printf("! Database init warning: %v", err)
	}

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Mount API endpoints under /accustandard/demo/api/v1
	r.Route("/accustandard/demo/api/v1", func(r chi.Router) {
		handlers.RegisterRoutes(r)
	})

	// Fallback root health check
	r.Get("/health", handlers.HealthCheck)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Accustandard Medical ERP Go Backend Service"))
	})

	log.Printf("==> Go REST API Server listening on 0.0.0.0:%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server stopped unexpectedly: %v", err)
	}
}
