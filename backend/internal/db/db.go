package db

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"accustandard-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	DB = db

	log.Println("==> Running GORM AutoMigrations...")
	err = db.AutoMigrate(
		&models.Location{},
		&models.Item{},
		&models.InventoryStock{},
		&models.ReplenishmentItem{},
		&models.RFQItem{},
		&models.ApprovalLog{},
		&models.StatementOfAccount{},
		&models.SOAItem{},
		&models.PurchaseOrder{},
		&models.PaymentRequest{},
		&models.QBOQueueItem{},
		&models.AuditLog{},
	)
	if err != nil {
		log.Printf("! AutoMigrate warning: %v", err)
	}

	runMigrationsAndSeeds(db)

	return db, nil
}

func runMigrationsAndSeeds(db *gorm.DB) {
	migrationFiles := []string{
		"migrations/001_initial_schema.sql",
		"migrations/002_seed_data.sql",
	}

	for _, file := range migrationFiles {
		cleanPath := filepath.Clean(file)
		content, err := os.ReadFile(cleanPath)
		if err != nil {
			log.Printf("Notice: SQL file %s not found on host disk: %v", file, err)
			continue
		}

		log.Printf("==> Executing SQL script: %s", file)
		if err := db.Exec(string(content)).Error; err != nil {
			log.Printf("! SQL execution warning for %s: %v", file, err)
		}
	}
}
