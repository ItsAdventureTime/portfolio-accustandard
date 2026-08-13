package models

import (
	"time"

	"github.com/google/uuid"
)

type Location struct {
	ID       uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Code     string    `gorm:"unique;not null" json:"code"`
	Name     string    `gorm:"not null" json:"name"`
	Address  string    `gorm:"not null" json:"address"`
	IsActive bool      `gorm:"default:true;not null" json:"isActive"`
}

type Item struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	SKU             string    `gorm:"unique;not null" json:"sku"`
	Barcode         *string   `json:"barcode"`
	Description     string    `gorm:"not null" json:"description"`
	Category        string    `gorm:"not null" json:"category"`
	Unit            string    `gorm:"not null" json:"unit"`
	ItemClass       string    `gorm:"default:'Class 1 (Fast-Moving)';not null" json:"itemClass"`
	IsBatchTracked  bool      `gorm:"default:true;not null" json:"isBatchTracked"`
	IsExpiryTracked bool      `gorm:"default:true;not null" json:"isExpiryTracked"`
	IsSerialTracked bool      `gorm:"default:false;not null" json:"isSerialTracked"`
	ReorderLevel    int       `gorm:"default:10;not null" json:"reorderLevel"`
	StandardPrice   float64   `gorm:"type:numeric(12,2);not null" json:"standardPrice"`
	CostPrice       float64   `gorm:"type:numeric(12,2);not null" json:"costPrice"`
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"createdAt"`
}

type InventoryStock struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	LocationID   uuid.UUID  `gorm:"type:uuid;not null" json:"locationId"`
	ItemID       uuid.UUID  `gorm:"type:uuid;not null" json:"itemId"`
	BatchNumber  *string    `json:"batchNumber"`
	ExpiryDate   *time.Time `json:"expiryDate"`
	SerialNumber *string    `json:"serialNumber"`
	QtyOnHand    int        `gorm:"default:0;not null" json:"qtyOnHand"`
	QtyReserved  int        `gorm:"default:0;not null" json:"qtyReserved"`

	// Relational / View helper fields
	SKU         string `gorm:"-" json:"sku"`
	Description string `gorm:"-" json:"description"`
	Location    string `gorm:"-" json:"location"`
	Unit        string `gorm:"-" json:"unit"`
	Available   int    `gorm:"-" json:"available"`
	Status      string `gorm:"-" json:"status"`
}

type ReplenishmentItem struct {
	ID                 uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	SKU                string    `gorm:"unique;not null" json:"sku"`
	Description        string    `gorm:"not null" json:"description"`
	ItemClass          string    `gorm:"not null" json:"itemClass"`
	AvailableStock     int       `gorm:"not null" json:"availableStock"`
	ReservedStock      int       `gorm:"not null" json:"reservedStock"`
	OpenCustomerDemand int       `gorm:"not null" json:"openCustomerDemand"`
	CriticalLevel      int       `gorm:"not null" json:"criticalLevel"`
	ProposedOrderQty   int       `gorm:"not null" json:"proposedOrderQty"`
	LeadTimeDays       int       `gorm:"not null" json:"leadTimeDays"`
	Supplier           string    `gorm:"not null" json:"supplier"`
	LinkedCustomerPO   string    `gorm:"not null" json:"linkedCustomerPO"`
	Status             string    `gorm:"not null" json:"status"`
}

type RFQItem struct {
	ID                     uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	RFQNo                  string    `gorm:"unique;not null" json:"rfqNo"`
	CustomerName           string    `gorm:"not null" json:"customerName"`
	RequestedBy            string    `gorm:"not null" json:"requestedBy"`
	CensusPerDay           int       `gorm:"not null" json:"censusPerDay"`
	LISConnectivity        bool      `gorm:"default:false;not null" json:"lisConnectivity"`
	ExpectedContractMonths int       `gorm:"not null" json:"expectedContractMonths"`
	MarketingROIStatus     string    `gorm:"not null" json:"marketingRoiStatus"`
	ProposedSellingPrice   float64   `gorm:"type:numeric(12,2);not null" json:"proposedSellingPrice"`
	LandedCostPerUnit      float64   `gorm:"type:numeric(12,2);not null" json:"landedCostPerUnit"`
	ExpectedMarginPct      float64   `gorm:"type:numeric(5,2);not null" json:"expectedMarginPct"`
}

type ApprovalLog struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	QRN            string    `gorm:"not null" json:"qrn"`
	DocType        string    `gorm:"not null" json:"type"`
	Maker          string    `gorm:"not null" json:"maker"`
	ReviewerStatus string    `gorm:"not null" json:"reviewerStatus"`
	GMStatus       string    `gorm:"not null" json:"gmStatus"`
	DCSStatus      string    `gorm:"column:dcs_status;not null" json:"dcsStatus"`
	TotalAmount    float64   `gorm:"type:numeric(12,2);not null" json:"totalAmount"`
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"createdAt"`
}

type StatementOfAccount struct {
	ID                  uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	SOANumber           string    `gorm:"unique;not null" json:"soaNumber"`
	StatementDate       time.Time `gorm:"autoCreateTime" json:"statementDate"`
	ClientName          string    `gorm:"not null" json:"clientName"`
	ClientAddress       string    `gorm:"not null" json:"clientAddress"`
	Terms               string    `gorm:"default:'30 Days';not null" json:"terms"`
	Salesperson         string    `gorm:"not null" json:"salesperson"`
	TotalCurrentBalance float64   `gorm:"type:numeric(12,2);not null" json:"totalCurrentBalance"`
	AmountDue           float64   `gorm:"type:numeric(12,2);not null" json:"amountDue"`
	NotYetDue           float64   `gorm:"type:numeric(12,2);not null" json:"notYetDue"`
	PreparedBy          string    `gorm:"not null" json:"preparedBy"`
}

type SOAItem struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	SOAID          uuid.UUID `gorm:"type:uuid;not null" json:"soaId"`
	SalesInvoiceNo string    `gorm:"not null" json:"salesInvoiceNo"`
	DRNo           string    `gorm:"not null" json:"drNo"`
	SIDate         time.Time `gorm:"column:si_date;not null" json:"date"`
	DueDate        time.Time `gorm:"not null" json:"dueDate"`
	AgeDays        int       `gorm:"not null" json:"ageDays"`
	InvoiceAmount  float64   `gorm:"type:numeric(12,2);not null" json:"invoiceAmount"`
	AmountPaid     float64   `gorm:"type:numeric(12,2);default:0.00;not null" json:"amountPaid"`
	InvoiceBalance float64   `gorm:"type:numeric(12,2);not null" json:"invoiceBalance"`
	RunningBalance float64   `gorm:"type:numeric(12,2);not null" json:"runningBalance"`
}

type CollectionPayment struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	CheckNo         string    `gorm:"unique;not null" json:"checkNo"`
	Bank            string    `gorm:"not null" json:"bank"`
	Amount          float64   `gorm:"type:numeric(12,2);not null" json:"amount"`
	AllocatedTotal  float64   `gorm:"type:numeric(12,2);not null" json:"allocatedTotal"`
	UnappliedCredit float64   `gorm:"type:numeric(12,2);not null" json:"unappliedCredit"`
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"createdAt"`
}

type PurchaseOrder struct {
	ID                  uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	PONumber            string    `gorm:"unique;not null" json:"poNumber"`
	VendorName          string    `gorm:"not null" json:"vendorName"`
	SKU                 string    `gorm:"index;not null;default:''" json:"sku"`
	ItemDescription     string    `gorm:"not null" json:"itemDescription"`
	ItemClass           string    `gorm:"not null;default:''" json:"itemClass"`
	LinkedCustomerPO    string    `gorm:"not null;default:''" json:"linkedCustomerPO"`
	POQty               int       `gorm:"not null" json:"poQty"`
	RRQtyReceived       int       `gorm:"default:0;not null" json:"rrQtyReceived"`
	InvoiceRef          string    `gorm:"not null" json:"invoiceRef"`
	TotalAmount         float64   `gorm:"type:numeric(12,2);not null" json:"totalAmount"`
	IsShortageException bool      `gorm:"default:false;not null" json:"isShortageException"`
	ShortageReason      *string   `json:"shortageReason"`
	Status              string    `gorm:"default:'DRAFT';not null" json:"status"`
	CreatedAt           time.Time `gorm:"autoCreateTime" json:"createdAt"`
}

type PaymentRequest struct {
	ID            uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	RFPNumber     string     `gorm:"unique;not null" json:"rfpNo"`
	Payee         string     `gorm:"not null" json:"payee"`
	GLAccount     string     `gorm:"not null" json:"glAccount"`
	Description   string     `gorm:"not null" json:"description"`
	Amount        float64    `gorm:"type:numeric(12,2);not null" json:"amount"`
	RequestedBy   string     `gorm:"not null" json:"requestedBy"`
	Status        string     `gorm:"default:'PENDING_GM';not null" json:"status"`
	ReleasedBank  *string    `json:"releasedBank"`
	ReleasedRefNo *string    `json:"releasedRefNo"`
	ReleasedAt    *time.Time `json:"releasedAt"`
	CreatedAt     time.Time  `gorm:"autoCreateTime" json:"createdAt"`
}

type QBOQueueItem struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	DocType      string    `gorm:"not null" json:"docType"`
	DocNumber    string    `gorm:"not null" json:"docNumber"`
	EntityName   string    `gorm:"not null" json:"entityName"`
	Amount       float64   `gorm:"type:numeric(12,2);not null" json:"amount"`
	QBORefID     string    `gorm:"not null" json:"qboRefId"`
	SyncStatus   string    `gorm:"default:'QUEUED';not null" json:"syncStatus"`
	LastAttempt  time.Time `gorm:"autoCreateTime" json:"lastAttempt"`
	ErrorMessage string    `gorm:"default:'';not null" json:"errorMessage"`
}

type AuditLog struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Time      string    `gorm:"column:timestamp;not null" json:"time"`
	User      string    `gorm:"column:user_email;not null" json:"user"`
	Action    string    `gorm:"not null" json:"action"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
}
