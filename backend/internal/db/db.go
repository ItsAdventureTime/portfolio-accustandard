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

	if err := runRuntimeSQL(db, "migrations/003_cleanup_legacy_schema.sql"); err != nil {
		return nil, err
	}

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
		&models.CollectionPayment{},
		&models.PurchaseOrder{},
		&models.PaymentRequest{},
		&models.QBOQueueItem{},
		&models.AuditLog{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to apply runtime schema: %w", err)
	}

	if err := runRuntimeSeed(db); err != nil {
		return nil, err
	}

	return db, nil
}

func runRuntimeSeed(db *gorm.DB) error {
	return runRuntimeSQL(db, "migrations/002_seed_data.sql")
}

func runRuntimeSQL(db *gorm.DB, file string) error {
	cleanPath := filepath.Clean(file)
	content, err := os.ReadFile(cleanPath)
	if err != nil {
		return fmt.Errorf("failed to read runtime SQL %s: %w", file, err)
	}

	log.Printf("==> Executing SQL script: %s", file)
	if err := db.Exec(string(content)).Error; err != nil {
		return fmt.Errorf("failed to execute runtime SQL %s: %w", file, err)
	}
	return nil
}
