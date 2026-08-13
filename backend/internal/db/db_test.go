package db

import (
	"os"
	"path/filepath"
	"regexp"
	"sync"
	"testing"

	"gorm.io/gorm/schema"
)

func TestSeedTargetsUseAutoMigrateTableNames(t *testing.T) {
	cache := &sync.Map{}
	expectedTables := map[string]string{
		"Location":           "locations",
		"Item":               "items",
		"InventoryStock":     "inventory_stocks",
		"ReplenishmentItem":  "replenishment_items",
		"RFQItem":            "rfq_items",
		"ApprovalLog":        "approval_logs",
		"StatementOfAccount": "statement_of_accounts",
		"SOAItem":            "soa_items",
		"CollectionPayment":  "collection_payments",
		"PurchaseOrder":      "purchase_orders",
		"PaymentRequest":     "payment_requests",
		"QBOQueueItem":       "qbo_queue_items",
		"AuditLog":           "audit_logs",
	}
	runtimeTables := make(map[string]struct{}, len(expectedTables))

	for _, model := range runtimeModels() {
		parsed, err := schema.Parse(model, cache, schema.NamingStrategy{})
		if err != nil {
			t.Fatalf("parse runtime model: %v", err)
		}

		want, ok := expectedTables[parsed.Name]
		if !ok {
			t.Fatalf("runtime model %q missing from expected table contract", parsed.Name)
		}
		if parsed.Table != want {
			t.Errorf("GORM table for %s = %q, want %q", parsed.Name, parsed.Table, want)
		}
		runtimeTables[parsed.Table] = struct{}{}
	}

	seedPath := filepath.Join("..", "..", "migrations", "002_seed_data.sql")
	seed, err := os.ReadFile(seedPath)
	if err != nil {
		t.Fatalf("read seed SQL: %v", err)
	}

	insertTargets := regexp.MustCompile(`(?im)^\s*INSERT\s+INTO\s+([a-z][a-z0-9_]*)\s*\(`).
		FindAllSubmatch(seed, -1)
	if len(insertTargets) == 0 {
		t.Fatal("seed SQL has no INSERT targets")
	}
	for _, match := range insertTargets {
		target := string(match[1])
		if _, ok := runtimeTables[target]; !ok {
			t.Errorf("seed INSERT target %q is not a GORM AutoMigrate table", target)
		}
	}
}
