package db

import (
	"os"
	"path/filepath"
	"regexp"
	"sync"
	"testing"

	"accustandard-backend/internal/models"

	"github.com/google/uuid"
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

func TestRuntimeModelUsesCanonicalAcronymColumns(t *testing.T) {
	cache := &sync.Map{}
	cases := []struct {
		name      string
		model     interface{}
		fieldName string
		want      string
		wrong     string
	}{
		{name: "approval DCS status", model: &models.ApprovalLog{}, fieldName: "DCSStatus", want: "dcs_status", wrong: "d_csstatus"},
		{name: "SOA invoice date", model: &models.SOAItem{}, fieldName: "SIDate", want: "si_date", wrong: "s_idate"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			parsed, err := schema.Parse(tc.model, cache, schema.NamingStrategy{})
			if err != nil {
				t.Fatalf("parse runtime model: %v", err)
			}
			field, ok := parsed.FieldsByName[tc.fieldName]
			if !ok {
				t.Fatalf("field %s not found in parsed schema", tc.fieldName)
			}
			if field.DBName != tc.want {
				t.Fatalf("field %s maps to %q, want %q", tc.fieldName, field.DBName, tc.want)
			}
			if field.DBName == tc.wrong {
				t.Fatalf("field %s retained legacy alias %q", tc.fieldName, tc.wrong)
			}
		})
	}
}

func TestSeedUsesCanonicalAcronymColumns(t *testing.T) {
	seedPath := filepath.Join("..", "..", "migrations", "002_seed_data.sql")
	seed, err := os.ReadFile(seedPath)
	if err != nil {
		t.Fatalf("read seed SQL: %v", err)
	}
	seedText := string(seed)
	for _, column := range []string{"dcs_status", "si_date"} {
		if !regexp.MustCompile(`(?i)` + column).MatchString(seedText) {
			t.Errorf("seed SQL does not reference canonical column %q", column)
		}
	}
	for _, legacyColumn := range []string{"d_csstatus", "s_idate"} {
		if regexp.MustCompile(`(?i)` + legacyColumn).MatchString(seedText) {
			t.Errorf("seed SQL still references legacy column %q", legacyColumn)
		}
	}
}

func TestSeedUsesValidUUIDLiterals(t *testing.T) {
	seedPath := filepath.Join("..", "..", "migrations", "002_seed_data.sql")
	seed, err := os.ReadFile(seedPath)
	if err != nil {
		t.Fatalf("read seed SQL: %v", err)
	}

	uuidLiteral := regexp.MustCompile(`'([0-9A-Za-z]{8}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{12})'`)
	matches := uuidLiteral.FindAllSubmatch(seed, -1)
	if len(matches) == 0 {
		t.Fatal("seed SQL has no UUID literals")
	}
	for _, match := range matches {
		if _, err := uuid.Parse(string(match[1])); err != nil {
			t.Errorf("seed contains invalid UUID %q: %v", match[1], err)
		}
	}
}
