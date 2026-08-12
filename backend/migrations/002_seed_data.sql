-- Seed Mock Data for Accustandard Demo PostgreSQL DB

-- Locations
INSERT INTO locations (id, code, name, address, is_active)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'QC', 'Quezon City Main Warehouse', '124 East Avenue, Diliman, Quezon City', true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'PAM', 'Pampanga Regional Warehouse', 'McArthur Highway, San Fernando, Pampanga', true)
ON CONFLICT (code) DO NOTHING;

-- Master Items & Inventory (Class 1, 2, 3 items across QC and Pampanga)
INSERT INTO items (id, sku, barcode, description, category, unit, item_class, is_batch_tracked, is_expiry_tracked, is_serial_tracked, reorder_level, standard_price, cost_price)
VALUES
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ACC-BACT-01', '480651234001', 'Calibration Sticks Bact Alert', 'Supplies', 'Kits', 'Class 1 (Fast-Moving)', true, true, false, 50, 420.00, 245.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ACC-REAG-04', '480651234002', 'Blood Chemistry Reagents Kit', 'Reagent', 'Boxes', 'Class 2 (Controlled)', true, true, false, 80, 1850.00, 1100.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'ACC-HEMA-09', '480651234003', 'Hematology Lyse Reagent 5L', 'Reagent', 'Bottles', 'Class 1 (Fast-Moving)', true, true, false, 100, 3200.00, 1800.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ACC-URIN-12', '480651234004', 'Urine Analyzer Test Strips 100s', 'Supplies', 'Canisters', 'Class 1 (Fast-Moving)', true, true, false, 40, 650.00, 380.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'ACC-SPEC-99', '480651234005', 'Lyphotronic H100+ Specialized Column', 'Equipment', 'Units', 'Class 3 (Short-Expiry / Special)', true, true, true, 2, 48000.00, 28000.00)
ON CONFLICT (sku) DO NOTHING;

-- Multi-location Stock Inventory
INSERT INTO inventory_stock (id, location_id, item_id, batch_number, expiry_date, serial_number, qty_on_hand, qty_reserved)
VALUES
  ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'LOT-2026-A9', '2027-11-30 00:00:00+00', NULL, 45, 5),
  ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'LOT-2026-B2', '2026-09-15 00:00:00+00', NULL, 120, 20),
  ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'LOT-2026-C8', '2028-03-20 00:00:00+00', NULL, 200, 10),
  ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'LOT-2026-D4', '2027-06-10 00:00:00+00', NULL, 85, 0)
ON CONFLICT (id) DO NOTHING;

-- Replenishment Planner Seed
INSERT INTO replenishment_items (id, sku, description, item_class, available_stock, reserved_stock, open_customer_demand, critical_level, proposed_order_qty, lead_time_days, supplier, linked_customer_po, status)
VALUES
  ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ACC-BACT-01', 'Calibration Sticks Bact Alert', 'Class 1 (Fast-Moving)', 40, 5, 30, 50, 60, 14, 'BioMerieux Corp', 'N/A', 'REORDER_RECOMMENDED'),
  ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ACC-REAG-04', 'Blood Chemistry Reagents Kit', 'Class 2 (Controlled)', 100, 20, 45, 80, 50, 21, 'Sysmex Philippines Inc.', 'N/A', 'FORECAST_REVIEW'),
  ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'ACC-SPEC-99', 'Lyphotronic H100+ Specialized Column', 'Class 3 (Short-Expiry / Special)', 2, 2, 5, 2, 5, 30, 'Shenzhen Lyphotronic Technology', 'CUST-PO-2026-88', 'PO_LINKED_READY')
ON CONFLICT (sku) DO NOTHING;

-- RFQ Seed
INSERT INTO rfq_items (id, rfq_no, customer_name, requested_by, census_per_day, lis_connectivity, expected_contract_months, marketing_roi_status, proposed_selling_price, landed_cost_per_unit, expected_margin_pct)
VALUES
  ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'RFQ-2026-0081', 'Allied Care Experts (ACE) Medical Center', 'Sales Agent (Mark)', 180, true, 36, 'ROI_COMPLETED', 42000.00, 24500.00, 41.60),
  ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'RFQ-2026-0094', 'Medical City Clark Diagnostic Center', 'Sales Agent (Mark)', 95, false, 12, 'PENDING_ROI', 58000.00, 34000.00, 41.30)
ON CONFLICT (rfq_no) DO NOTHING;

-- Approval Pipeline (COSO 4-layer) Seed
INSERT INTO approval_logs (id, qrn, doc_type, maker, reviewer_status, gm_status, dcs_status, total_amount)
VALUES
  ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'QRN20240415037', 'Sales Quotation', 'Sales Officer', 'APPROVED', 'APPROVED', 'NOT_REQUIRED', 31500.00),
  ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'PO-2026-0891', 'Purchase Order', 'Purchasing Officer', 'APPROVED', 'PENDING', 'PENDING', 142000.00),
  ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'RFP-2026-0104', 'Request for Payment', 'Bookkeeper (Aila)', 'APPROVED', 'APPROVED', 'APPROVED', 18500.00)
ON CONFLICT (id) DO NOTHING;

-- Statement of Account (SOA) Seed
INSERT INTO statement_of_accounts (id, soa_number, client_name, client_address, terms, salesperson, total_current_balance, amount_due, not_yet_due, prepared_by)
VALUES
  ('g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'SOA-2026-001', 'Allied Care Experts (ACE) Medical Center', 'McArthur Hwy, San Fernando, Pampanga', '30 Days Net', 'Sales Officer (Mark)', 32208.00, 18928.00, 13280.00, 'Aila (Bookkeeper)')
ON CONFLICT (soa_number) DO NOTHING;

INSERT INTO soa_items (id, soa_id, sales_invoice_no, dr_no, si_date, due_date, age_days, invoice_amount, amount_paid, invoice_balance, running_balance)
VALUES
  ('h1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'SI-6087', 'DR-6075', '2026-06-18 00:00:00+00', '2026-07-18 00:00:00+00', 47, 16960.00, 0.00, 16960.00, 16960.00),
  ('h1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'SI-6107', 'DR-6097', '2026-06-26 00:00:00+00', '2026-07-26 00:00:00+00', 39, 1968.00, 0.00, 1968.00, 18928.00),
  ('h1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'SI-6118', 'DR-6113', '2026-06-30 00:00:00+00', '2026-07-30 00:00:00+00', 35, 13280.00, 0.00, 13280.00, 32208.00)
ON CONFLICT (id) DO NOTHING;

-- Purchase Orders Seed
INSERT INTO purchase_orders (id, po_number, vendor_name, item_description, po_qty, rr_qty_received, invoice_ref, total_amount, status)
VALUES
  ('i1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'PO-2026-0891', 'BioMerieux Diagnostics Corp', 'Calibration Sticks Bact Alert', 100, 100, 'SI #8812', 142000.00, 'AWAITING_VENDOR_INVOICE'),
  ('i1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'PO-2026-0914', 'Sysmex Philippines Inc.', 'Blood Chemistry Reagents Kit', 50, 0, 'Awaiting', 450000.00, 'PENDING_RECEIVING'),
  ('i1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'PO-2026-0925', 'Mindray Medical Corp', 'Hematology Lyse Reagent 5L', 80, 80, 'SI #9901', 640000.00, 'AWAITING_VENDOR_INVOICE')
ON CONFLICT (po_number) DO NOTHING;

-- Payment Requests (RFP) Seed
INSERT INTO payment_requests (id, rfp_number, payee, gl_account, description, amount, requested_by, status)
VALUES
  ('j1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'RFP-2026-0104', 'LBC Express Courier Services', '6100 - Freight & Delivery', 'Cold-chain express shipping for Pampanga hospital orders', 18500.00, 'Bookkeeper (Aila)', 'APPROVED_DCS'),
  ('j1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'RFP-2026-0112', 'Meralco Electric Utilities', '6200 - Utilities Expense', 'San Fernando warehouse climate-control power bill', 34200.00, 'General Manager', 'PENDING_GM'),
  ('j1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'RFP-2026-0120', 'Calibration Certifications Phils', '6300 - Professional & Calibration Fees', 'ISO 17025 annual calibration for Bact Alert analyzer units', 28000.00, 'Marketing', 'PENDING_MKTG')
ON CONFLICT (rfp_number) DO NOTHING;

-- QBO Sync Queue Seed
INSERT INTO qbo_queue (id, doc_type, doc_number, entity_name, amount, qbo_ref_id, sync_status, last_attempt, error_message)
VALUES
  ('k1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Sales Invoice', 'SI-6087', 'Allied Care Experts (ACE) Medical Center', 16960.00, 'QBO-INV-88902', 'SYNCED', '2026-08-04 14:30:12+00', ''),
  ('k1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Vendor Bill', 'PO-2026-0891 / SI-8812', 'BioMerieux Diagnostics Corp', 142000.00, 'QBO-BILL-44102', 'SYNCED', '2026-08-04 15:10:45+00', ''),
  ('k1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Customer Payment Collection', 'CHK-BDO-99201', 'Allied Care Experts (ACE) Medical Center', 25000.00, 'Awaiting Sync', 'QUEUED', '2026-08-05 08:45:00+00', '')
ON CONFLICT (id) DO NOTHING;

-- Audit Logs Seed
INSERT INTO audit_logs (id, timestamp, user_email, action)
VALUES
  ('l1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '02:55 PM', 'mark@accustandard.com', 'Created Quotation QRN20240415037 for Allied Care Experts'),
  ('l1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', '03:10 PM', 'rmt@accustandard.com', 'Reviewed and Approved Quotation QRN20240415037'),
  ('l1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', '03:14 PM', 'karen@accustandard.com', 'Approved Quotation QRN20240415037')
ON CONFLICT (id) DO NOTHING;
