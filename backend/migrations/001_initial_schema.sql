-- PostgreSQL 16 Initial Schema for Accustandard Medical ERP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users & RBAC
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Locations / Warehouses
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Master Item Catalog
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    item_class TEXT DEFAULT 'Class 1 (Fast-Moving)' NOT NULL,
    is_batch_tracked BOOLEAN DEFAULT TRUE NOT NULL,
    is_expiry_tracked BOOLEAN DEFAULT TRUE NOT NULL,
    is_serial_tracked BOOLEAN DEFAULT FALSE NOT NULL,
    reorder_level INT DEFAULT 10 NOT NULL,
    standard_price NUMERIC(12,2) NOT NULL,
    cost_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Inventory Stock
CREATE TABLE IF NOT EXISTS inventory_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    batch_number TEXT,
    expiry_date TIMESTAMP WITH TIME ZONE,
    serial_number TEXT,
    qty_on_hand INT DEFAULT 0 NOT NULL,
    qty_reserved INT DEFAULT 0 NOT NULL
);

-- Price Lists
CREATE TABLE IF NOT EXISTS price_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tier_code TEXT UNIQUE NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tin TEXT NOT NULL,
    address TEXT NOT NULL,
    bank_details TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE NOT NULL,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- GL Accounts
CREATE TABLE IF NOT EXISTS gl_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL
);

-- Sales Quotations
CREATE TABLE IF NOT EXISTS sales_quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qrn TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_address TEXT NOT NULL,
    client_contact_person TEXT NOT NULL,
    salesperson TEXT NOT NULL,
    quotation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    validity_days INT DEFAULT 30 NOT NULL,
    reservation_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'DRAFT' NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Quotation Items
CREATE TABLE IF NOT EXISTS quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID REFERENCES sales_quotations(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id),
    description TEXT NOT NULL,
    packaging TEXT NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    quantity INT NOT NULL,
    total_price NUMERIC(12,2) NOT NULL
);

-- Statement of Accounts (SOA)
CREATE TABLE IF NOT EXISTS statement_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    soa_number TEXT UNIQUE NOT NULL,
    statement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    client_name TEXT NOT NULL,
    client_address TEXT NOT NULL,
    terms TEXT DEFAULT '30 Days' NOT NULL,
    salesperson TEXT NOT NULL,
    total_current_balance NUMERIC(12,2) NOT NULL,
    amount_due NUMERIC(12,2) NOT NULL,
    not_yet_due NUMERIC(12,2) NOT NULL,
    prepared_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- SOA Items
CREATE TABLE IF NOT EXISTS soa_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    soa_id UUID REFERENCES statement_of_accounts(id) ON DELETE CASCADE,
    sales_invoice_no TEXT NOT NULL,
    dr_no TEXT NOT NULL,
    si_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    age_days INT NOT NULL,
    invoice_amount NUMERIC(12,2) NOT NULL,
    amount_paid NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
    invoice_balance NUMERIC(12,2) NOT NULL,
    running_balance NUMERIC(12,2) NOT NULL
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number TEXT UNIQUE NOT NULL,
    vendor_name TEXT NOT NULL,
    item_description TEXT NOT NULL,
    po_qty INT NOT NULL,
    rr_qty_received INT DEFAULT 0 NOT NULL,
    invoice_ref TEXT NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    status TEXT DEFAULT 'DRAFT' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Payment Requests (RFP)
CREATE TABLE IF NOT EXISTS payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfp_number TEXT UNIQUE NOT NULL,
    payee TEXT NOT NULL,
    gl_account TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    requested_by TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING_GM' NOT NULL,
    released_bank TEXT,
    released_ref_no TEXT,
    released_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Approval Pipeline Logs (COSO 4-layer)
CREATE TABLE IF NOT EXISTS approval_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qrn TEXT NOT NULL,
    doc_type TEXT NOT NULL,
    maker TEXT NOT NULL,
    reviewer_status TEXT NOT NULL,
    gm_status TEXT NOT NULL,
    dcs_status TEXT NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- QBO Sync Queue
CREATE TABLE IF NOT EXISTS qbo_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_type TEXT NOT NULL,
    doc_number TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    qbo_ref_id TEXT NOT NULL,
    sync_status TEXT DEFAULT 'QUEUED' NOT NULL,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    error_message TEXT DEFAULT '' NOT NULL
);

-- Replenishment Planning Items
CREATE TABLE IF NOT EXISTS replenishment_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    item_class TEXT NOT NULL,
    available_stock INT NOT NULL,
    reserved_stock INT NOT NULL,
    open_customer_demand INT NOT NULL,
    critical_level INT NOT NULL,
    proposed_order_qty INT NOT NULL,
    lead_time_days INT NOT NULL,
    supplier TEXT NOT NULL,
    linked_customer_po TEXT NOT NULL,
    status TEXT NOT NULL
);

-- RFQ Items
CREATE TABLE IF NOT EXISTS rfq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_no TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    requested_by TEXT NOT NULL,
    census_per_day INT NOT NULL,
    lis_connectivity BOOLEAN DEFAULT FALSE NOT NULL,
    expected_contract_months INT NOT NULL,
    marketing_roi_status TEXT NOT NULL,
    proposed_selling_price NUMERIC(12,2) NOT NULL,
    landed_cost_per_unit NUMERIC(12,2) NOT NULL,
    expected_margin_pct NUMERIC(5,2) NOT NULL
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TEXT NOT NULL,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
