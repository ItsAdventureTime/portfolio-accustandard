package handlers

import (
	"encoding/json"
	"errors"
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

func TestDecodeJSONRejectsMalformedPayload(t *testing.T) {
	req := httptest.NewRequest("POST", "/", strings.NewReader(`{"role":"Reviewer"} {"role":"GM"}`))
	var payload struct {
		Role string `json:"role"`
	}
	if err := decodeJSON(req, &payload); !errors.Is(err, errInvalidPayload) {
		t.Fatalf("decodeJSON() error = %v, want invalid payload", err)
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
