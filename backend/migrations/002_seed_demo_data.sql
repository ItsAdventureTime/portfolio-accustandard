-- AccuStandard ERP PostgreSQL Seed Data
-- Version: 1.0.0

INSERT INTO users (id, username, full_name, role, email) VALUES
('u-1', 'sales_mark', 'Mark Sales', 'Sales', 'mark@accustandard.ph'),
('u-2', 'mktg_reviewer', 'Marketing Reviewer', 'Marketing', 'marketing@accustandard.ph'),
('u-3', 'gm_karen', 'Karen GM', 'General Manager', 'karen.gm@accustandard.ph'),
('u-4', 'dcs_chairman', 'DCS Chairman', 'Chairman (DCS)', 'chairman@accustandard.ph'),
('u-5', 'wh_marie', 'Marie Warehouse', 'Warehouse', 'marie.wh@accustandard.ph'),
('u-6', 'acct_aila', 'Aila Bookkeeper', 'Bookkeeper', 'aila.acct@accustandard.ph'),
('u-7', 'admin_bridge', 'Bridge Admin', 'Admin', 'admin@accustandard.ph')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inventory (id, sku, description, location, lot_number, expiry_date, on_hand, reserved, available, unit, wma_cost, status) VALUES
('inv-1', 'ACC-BACT-01', 'Calibration Sticks Bact Alert', 'Pampanga', 'LOT-2026-A9', '2027-11-30', 45, 5, 40, 'Kits', 500.00, 'NORMAL'),
('inv-2', 'ACC-REAG-04', 'Blood Chemistry Reagents Kit', 'Quezon City', 'LOT-2026-B2', '2026-09-15', 120, 20, 100, 'Boxes', 650.00, 'NEAR_EXPIRY'),
('inv-3', 'ACC-HEMA-09', 'Hematology Lyse Reagent 5L', 'Quezon City', 'LOT-2026-C8', '2028-03-20', 200, 10, 190, 'Bottles', 420.00, 'NORMAL'),
('inv-4', 'ACC-URIN-12', 'Urine Analyzer Test Strips 100s', 'Pampanga', 'LOT-2026-D4', '2027-06-10', 85, 0, 85, 'Canisters', 180.00, 'NORMAL')
ON CONFLICT (id) DO NOTHING;

INSERT INTO costing_history (id, sku, previous_wma, incoming_qty, incoming_unit_cost, new_wma, transaction_type, reference_no) VALUES
('cost-1', 'ACC-BACT-01', 500.00, 20, 600.00, 516.67, 'GOODS_RECEIPT', 'GR-2026-0041')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rfqs (id, rfq_no, customer_name, requested_by, facility_ownership, institutional_character, setup_type, is_rtu, census_per_day, existing_machine, contract_years, proposed_selling_price, landed_cost_per_unit, expected_margin_pct, status) VALUES
('rfq-1', 'RFQ-2026-0081', 'Allied Care Experts (ACE) Medical Center', 'Sales Agent (Mark)', 'Private', 'Tertiary Hospital', 'Initial Setup', TRUE, 180, 'Sysmex XN-550', 3, 42000.00, 24500.00, 41.60, 'ROI_COMPLETED')
ON CONFLICT (id) DO NOTHING;

INSERT INTO quotations (id, qrn, rfq_no, customer, sku, item_description, qty, unit_cost, unit_price, total_amount, gross_margin_pct, owner_role, status, has_client_acceptance) VALUES
('q-1', 'QRN-2026-00101', 'RFQ-2026-0081', 'St. Luke Medical Center QC', 'ACC-BACT-01', 'Calibration Sticks Bact Alert', 5, 500.00, 850.00, 4250.00, 41.18, 'Sales', 'APPROVED_BY_GM', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO purchase_orders (id, po_number, supplier, sku, item_description, qty, unit_cost, total_amount, accounting_review_status, gm_approval_status, dcs_approval_status, overall_status) VALUES
('po-1', 'PO-2026-0091', 'BioMerieux Corp', 'ACC-BACT-01', 'Calibration Sticks Bact Alert', 20, 500.00, 10000.00, 'VERIFIED_BY_ACCOUNTING', 'APPROVED_BY_GM', 'APPROVED_BY_DCS', 'APPROVED')
ON CONFLICT (id) DO NOTHING;

INSERT INTO statements_of_account (id, invoice_no, client_name, invoice_date, due_date, invoice_amount, collected_amount, outstanding_balance, status) VALUES
('soa-1', 'INV-2026-0045', 'St. Luke Medical Center QC', '2026-07-01', '2026-07-31', 125000.00, 25000.00, 100000.00, 'PARTIALLY_PAID'),
('soa-2', 'INV-2026-0052', 'ACE Medical Center Pateros', '2026-07-15', '2026-08-15', 85000.00, 0.00, 85000.00, 'UNPAID')
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, actor_name, actor_role, action, target_entity, details) VALUES
('audit-1', 'Karen GM', 'General Manager', 'APPROVE_QUOTATION', 'QRN-2026-00101', 'Sales quotation approved with 41.18% gross margin'),
('audit-2', 'Marie Warehouse', 'Warehouse', 'POST_GOODS_RECEIPT', 'GR-2026-0041', 'Received 20 kits under PO-2026-0091')
ON CONFLICT (id) DO NOTHING;
