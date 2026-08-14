package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"accustandard-backend/internal/models"
)

func TestValidateAllocationInput(t *testing.T) {
	tests := []struct {
		name  string
		want  error
		input collectionInput
	}{
		{
			name: "valid partial allocation",
			input: collectionInput{
				CheckNo: "CHK-1", Bank: "BDO", Amount: 100,
				Allocations: []allocationInput{{InvoiceNo: "SI-1", Amount: 40}},
			},
		},
		{
			name: "non-positive check",
			want: errInvalidPayload,
			input: collectionInput{
				CheckNo: "CHK-1", Bank: "BDO", Amount: 0,
				Allocations: []allocationInput{{InvoiceNo: "SI-1", Amount: 40}},
			},
		},
		{
			name: "over-allocated check",
			want: errAllocationOverrun,
			input: collectionInput{
				CheckNo: "CHK-1", Bank: "BDO", Amount: 100,
				Allocations: []allocationInput{{InvoiceNo: "SI-1", Amount: 101}},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			total, err := validateAllocationInput(test.input)
			if test.want != nil {
				if !errors.Is(err, test.want) {
					t.Fatalf("validateAllocationInput() error = %v, want %v", err, test.want)
				}
				return
			}
			if err != nil || total != 40 {
				t.Fatalf("validateAllocationInput() = (%v, %v), want (40, nil)", total, err)
			}
		})
	}
}

func TestValidateRejectionEnforcesPipeline(t *testing.T) {
	base := models.ApprovalLog{
		DocType: "Purchase Order", Maker: "Purchasing Officer",
		ReviewerStatus: "APPROVED", GMStatus: "APPROVED", DCSStatus: "PENDING",
	}
	if err := validateRejection(base, "DCS"); err != nil {
		t.Fatalf("valid DCS rejection rejected: %v", err)
	}

	duplicate := base
	duplicate.DCSStatus = "REJECTED"
	if err := validateRejection(duplicate, "DCS"); err == nil {
		t.Fatal("finalized DCS rejection was accepted")
	}

	quote := base
	quote.DocType = "Sales Quotation"
	if err := validateRejection(quote, "DCS"); err == nil {
		t.Fatal("Sales Quotation DCS rejection was accepted")
	}

	outOfOrder := base
	outOfOrder.GMStatus = "PENDING"
	if err := validateRejection(outOfOrder, "DCS"); err == nil {
		t.Fatal("out-of-order DCS rejection was accepted")
	}
}

func TestCanReceivePO(t *testing.T) {
	for _, status := range []string{"PENDING_RECEIVING", "PARTIALLY_RECEIVED", "APPROVED", "AWAITING_RECEIVING"} {
		if !canReceivePO(status) {
			t.Errorf("canReceivePO(%q) = false, want true", status)
		}
	}
	for _, status := range []string{"DRAFT", "AWAITING_VENDOR_INVOICE", "VERIFIED_3WAY", "CLOSED", "CANCELLED"} {
		if canReceivePO(status) {
			t.Errorf("canReceivePO(%q) = true, want false", status)
		}
	}
}

func TestApplyApprovalRestrictsDocumentStageRoles(t *testing.T) {
	po := models.ApprovalLog{
		DocType: "Purchase Order", Maker: "Purchasing Officer",
		ReviewerStatus: "PENDING", GMStatus: "PENDING", DCSStatus: "NOT_REQUIRED",
	}
	if err := applyApproval(&po, "Marketing"); err == nil {
		t.Fatal("Marketing approval was accepted for a Purchase Order")
	}
	if err := applyApproval(&po, "Accounting"); err != nil || po.ReviewerStatus != "APPROVED" {
		t.Fatalf("Accounting PO review = (%v, %s), want approved", err, po.ReviewerStatus)
	}
	if err := applyApproval(&po, "General Manager"); err != nil || po.GMStatus != "APPROVED" {
		t.Fatalf("GM PO approval = (%v, %s), want approved", err, po.GMStatus)
	}
}

func TestDecodeJSONRejectsMalformedPayload(t *testing.T) {
	req := httptest.NewRequest("POST", "/", strings.NewReader(`{"role":"Reviewer"} {"role":"GM"}`))
	var payload struct {
		Role string `json:"role"`
	}
	if err := decodeJSON(req, &payload); !errors.Is(err, errInvalidPayload) {
		t.Fatalf("decodeJSON() error = %v, want invalid payload", err)
	}
}

func TestRequireAuthenticatedActorEnforcesDemoBoundary(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		actor, ok := actorFromRequest(r)
		if !ok || actor.Role != "General Manager" {
			t.Fatalf("actor = (%+v, %v), want General Manager", actor, ok)
		}
		w.WriteHeader(http.StatusNoContent)
	})

	t.Setenv("APP_ENV", "production")
	productionResponse := httptest.NewRecorder()
	RequireAuthenticatedActor(next).ServeHTTP(productionResponse, httptest.NewRequest("GET", "/", nil))
	if productionResponse.Code != http.StatusServiceUnavailable {
		t.Fatalf("non-demo status = %d, want %d", productionResponse.Code, http.StatusServiceUnavailable)
	}

	t.Setenv("APP_ENV", "demo")
	missingRoleResponse := httptest.NewRecorder()
	RequireAuthenticatedActor(next).ServeHTTP(missingRoleResponse, httptest.NewRequest("GET", "/", nil))
	if missingRoleResponse.Code != http.StatusUnauthorized {
		t.Fatalf("missing demo role status = %d, want %d", missingRoleResponse.Code, http.StatusUnauthorized)
	}

	demoRequest := httptest.NewRequest("GET", "/", nil)
	demoRequest.Header.Set(demoRoleHeader, "General Manager")
	demoResponse := httptest.NewRecorder()
	RequireAuthenticatedActor(next).ServeHTTP(demoResponse, demoRequest)
	if demoResponse.Code != http.StatusNoContent {
		t.Fatalf("valid demo role status = %d, want %d", demoResponse.Code, http.StatusNoContent)
	}
}

func TestSOAJSONUsesFrontendFieldNames(t *testing.T) {
	payload, err := json.Marshal(models.SOAItem{
		SalesInvoiceNo: "SI-1", InvoiceBalance: 12.50,
	})
	if err != nil {
		t.Fatal(err)
	}
	encoded := string(payload)
	if !strings.Contains(encoded, `"salesInvoiceNo":"SI-1"`) ||
		!strings.Contains(encoded, `"invoiceBalance":12.5`) {
		t.Fatalf("SOA JSON = %s, want frontend field names", encoded)
	}
}
