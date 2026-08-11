-- AccuStandard ERP PostgreSQL Database Schema
-- Version: 1.0.0

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
    id VARCHAR(64) PRIMARY KEY,
    sku VARCHAR(64) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    lot_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    on_hand INT NOT NULL DEFAULT 0,
    reserved INT NOT NULL DEFAULT 0,
    available INT NOT NULL DEFAULT 0,
    unit VARCHAR(32) NOT NULL,
    wma_cost DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'NORMAL',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS costing_history (
    id VARCHAR(64) PRIMARY KEY,
    sku VARCHAR(64) NOT NULL REFERENCES inventory(sku) ON DELETE CASCADE,
    previous_wma DECIMAL(12, 2) NOT NULL,
    incoming_qty INT NOT NULL,
    incoming_unit_cost DECIMAL(12, 2) NOT NULL,
    new_wma DECIMAL(12, 2) NOT NULL,
    transaction_type VARCHAR(64) NOT NULL,
    reference_no VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rfqs (
    id VARCHAR(64) PRIMARY KEY,
    rfq_no VARCHAR(64) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    requested_by VARCHAR(150) NOT NULL,
    facility_ownership VARCHAR(64) NOT NULL,
    institutional_character VARCHAR(64) NOT NULL,
    setup_type VARCHAR(64) NOT NULL,
    is_rtu BOOLEAN NOT NULL DEFAULT FALSE,
    census_per_day INT DEFAULT 0,
    existing_machine VARCHAR(150),
    contract_years INT DEFAULT 3,
    proposed_selling_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    landed_cost_per_unit DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    expected_margin_pct DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING_MARKETING_REVIEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotations (
    id VARCHAR(64) PRIMARY KEY,
    qrn VARCHAR(64) UNIQUE NOT NULL,
    rfq_no VARCHAR(64) REFERENCES rfqs(rfq_no),
    customer VARCHAR(255) NOT NULL,
    sku VARCHAR(64) NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    qty INT NOT NULL,
    unit_cost DECIMAL(12, 2) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    gross_margin_pct DECIMAL(5, 2) NOT NULL,
    owner_role VARCHAR(50) NOT NULL DEFAULT 'Sales',
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING_MARKETING_REVIEW',
    has_client_acceptance BOOLEAN NOT NULL DEFAULT FALSE,
    client_acceptance_file VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id VARCHAR(64) PRIMARY KEY,
    po_number VARCHAR(64) UNIQUE NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    sku VARCHAR(64) NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    qty INT NOT NULL,
    unit_cost DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    accounting_review_status VARCHAR(64) NOT NULL DEFAULT 'PENDING_ACCOUNTING_REVIEW',
    gm_approval_status VARCHAR(64) NOT NULL DEFAULT 'PENDING_GM_APPROVAL',
    dcs_approval_status VARCHAR(64) NOT NULL DEFAULT 'PENDING_DCS_APPROVAL',
    overall_status VARCHAR(64) NOT NULL DEFAULT 'PENDING_ACCOUNTING_REVIEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goods_receipts (
    id VARCHAR(64) PRIMARY KEY,
    rr_number VARCHAR(64) UNIQUE NOT NULL,
    po_number VARCHAR(64) NOT NULL REFERENCES purchase_orders(po_number),
    received_qty INT NOT NULL,
    received_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    inspector_name VARCHAR(150) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'POSTED'
);

CREATE TABLE IF NOT EXISTS vendor_invoices (
    id VARCHAR(64) PRIMARY KEY,
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    po_number VARCHAR(64) NOT NULL REFERENCES purchase_orders(po_number),
    rr_number VARCHAR(64) NOT NULL REFERENCES goods_receipts(rr_number),
    invoice_amount DECIMAL(12, 2) NOT NULL,
    match_status VARCHAR(64) NOT NULL DEFAULT '3_WAY_MATCHED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests_for_payment (
    id VARCHAR(64) PRIMARY KEY,
    rfp_number VARCHAR(64) UNIQUE NOT NULL,
    payee VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    gl_account VARCHAR(150) NOT NULL,
    description TEXT,
    bank_account VARCHAR(150),
    proof_of_disbursement VARCHAR(255),
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING_GM_APPROVAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS statements_of_account (
    id VARCHAR(64) PRIMARY KEY,
    invoice_no VARCHAR(64) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    invoice_amount DECIMAL(12, 2) NOT NULL,
    collected_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    outstanding_balance DECIMAL(12, 2) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'UNPAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
