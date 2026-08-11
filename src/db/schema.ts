import { pgTable, text, timestamp, boolean, integer, numeric, jsonb, uuid } from 'drizzle-orm/pg-core';

// Users & RBAC
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(), // 'Admin', 'Chairman_DCS', 'GM', 'Bookkeeper', 'Warehouse', 'Purchasing', 'Sales', 'Marketing'
  permissions: jsonb('permissions').default({ viewAttachment: true, downloadAttachment: false, exportInventory: false }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Locations / Warehouses
export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(), // 'QC', 'PAM'
  name: text('name').notNull(),
  address: text('address').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// Master Item Catalog
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  sku: text('sku').notNull().unique(),
  barcode: text('barcode'),
  description: text('description').notNull(),
  category: text('category').notNull(), // 'Equipment', 'Supplies', 'Reagent'
  unit: text('unit').notNull(), // 'Kit', 'Box', 'Piece'
  isBatchTracked: boolean('is_batch_tracked').default(true).notNull(),
  isExpiryTracked: boolean('is_expiry_tracked').default(true).notNull(),
  isSerialTracked: boolean('is_serial_tracked').default(false).notNull(),
  reorderLevel: integer('reorder_level').default(10).notNull(),
  standardPrice: numeric('standard_price', { precision: 12, scale: 2 }).notNull(),
  costPrice: numeric('cost_price', { precision: 12, scale: 2 }).notNull(),
  wmaCost: numeric('wma_cost', { precision: 12, scale: 2 }).notNull(), // Weighted Moving Average Cost
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Multi-location Stock Inventory
export const inventoryStock = pgTable('inventory_stock', {
  id: uuid('id').primaryKey().defaultRandom(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  itemId: uuid('item_id').references(() => items.id).notNull(),
  batchNumber: text('batch_number'),
  expiryDate: timestamp('expiry_date'),
  serialNumber: text('serial_number'),
  qtyOnHand: integer('qty_on_hand').default(0).notNull(),
  qtyReserved: integer('qty_reserved').default(0).notNull(),
});

// Weighted Moving Average Cost History Ledger
export const inventoryCostingLogs = pgTable('inventory_costing_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id').references(() => items.id).notNull(),
  previousWma: numeric('previous_wma', { precision: 12, scale: 2 }).notNull(),
  incomingQty: integer('incoming_qty').notNull(),
  incomingUnitCost: numeric('incoming_unit_cost', { precision: 12, scale: 2 }).notNull(),
  newWma: numeric('new_wma', { precision: 12, scale: 2 }).notNull(),
  transactionType: text('transaction_type').notNull(), // 'BEGINNING_IMPORT', 'GOODS_RECEIPT', 'STOCK_ISSUE'
  referenceNo: text('reference_no').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Price Tiers & Maintenance
export const priceLists = pgTable('price_lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  tierCode: text('tier_code').notNull().unique(),
  isApproved: boolean('is_approved').default(false).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Vendors / Suppliers
export const vendors = pgTable('vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  tin: text('tin').notNull(),
  address: text('address').notNull(),
  bankDetails: text('bank_details').notNull(),
  contactPerson: text('contact_person').notNull(),
  isApproved: boolean('is_approved').default(false).notNull(),
  approvedBy: uuid('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Chart of Accounts (GL Accounts)
export const glAccounts = pgTable('gl_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'Asset', 'Liability', 'Expense', 'Revenue'
  isActive: boolean('is_active').default(true).notNull(),
});

// Client RFQs
export const rfqRequests = pgTable('rfq_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  rfqNo: text('rfq_no').notNull().unique(),
  customerName: text('customer_name').notNull(),
  facilityOwnership: text('facility_ownership').default('Private').notNull(),
  institutionalCharacter: text('institutional_character').default('Hospital').notNull(),
  setupType: text('setup_type').default('Initial Setup').notNull(),
  isRtu: boolean('is_rtu').default(false).notNull(),
  hasRtuCensusAttachment: boolean('has_rtu_census_attachment').default(false).notNull(),
  rtuCensusAttachmentName: text('rtu_census_attachment_name'),
  dailyCensus: integer('daily_census').default(0).notNull(),
  existingMachine: text('existing_machine'),
  existingSupplier: text('existing_supplier'),
  contractYears: integer('contract_years').default(3).notNull(),
  specialRequest: text('special_request'),
  remarks: text('remarks'),
  status: text('status').default('DRAFT').notNull(), // 'DRAFT', 'PENDING_MARKETING', 'ROI_COMPLETED'
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Marketing ROIs
export const marketingRois = pgTable('marketing_rois', {
  id: uuid('id').primaryKey().defaultRandom(),
  rfqId: uuid('rfq_id').references(() => rfqRequests.id).notNull(),
  version: integer('version').default(1).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  equipmentCost: numeric('equipment_cost', { precision: 12, scale: 2 }).notNull(),
  installationCost: numeric('installation_cost', { precision: 12, scale: 2 }).notNull(),
  operatingAssumptions: jsonb('operating_assumptions').notNull(),
  perSkuEconomics: jsonb('per_sku_economics').notNull(),
  annualContribution: numeric('annual_contribution', { precision: 12, scale: 2 }).notNull(),
  roiYears: numeric('roi_years', { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Sales Quotations
export const salesQuotations = pgTable('sales_quotations', {
  id: uuid('id').primaryKey().defaultRandom(),
  qrn: text('qrn').notNull().unique(),
  rfqId: uuid('rfq_id').references(() => rfqRequests.id),
  roiId: uuid('roi_id').references(() => marketingRois.id),
  clientName: text('client_name').notNull(),
  clientAddress: text('client_address').notNull(),
  clientContactPerson: text('client_contact_person').notNull(),
  salesperson: text('salesperson').notNull(),
  quotationDate: timestamp('quotation_date').defaultNow().notNull(),
  validityDays: integer('validity_days').default(30).notNull(),
  reservationExpiresAt: timestamp('reservation_expires_at').notNull(),
  status: text('status').default('DRAFT').notNull(), // 'DRAFT', 'PENDING_REVIEW', 'AWAITING_GM', 'AWAITING_CLIENT_APPROVAL', 'CLIENT_APPROVED', 'REJECTED'
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  clientApprovalEvidence: text('client_approval_evidence'),
  clientApprovalDate: timestamp('client_approval_date'),
  clientPoReference: text('client_po_reference'),
  isFulfillmentAllowed: boolean('is_fulfillment_allowed').default(false).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  quotationId: uuid('quotation_id').references(() => salesQuotations.id).notNull(),
  itemId: uuid('item_id').references(() => items.id).notNull(),
  description: text('description').notNull(),
  packaging: text('packaging').notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  totalPrice: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
});

// Statement of Account (SOA) Records
export const statementOfAccounts = pgTable('statement_of_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  soaNumber: text('soa_number').notNull().unique(),
  statementDate: timestamp('statement_date').defaultNow().notNull(),
  clientName: text('client_name').notNull(),
  clientAddress: text('client_address').notNull(),
  terms: text('terms').default('30 Days').notNull(),
  salesperson: text('salesperson').notNull(),
  totalCurrentBalance: numeric('total_current_balance', { precision: 12, scale: 2 }).notNull(),
  amountDue: numeric('amount_due', { precision: 12, scale: 2 }).notNull(),
  notYetDue: numeric('not_yet_due', { precision: 12, scale: 2 }).notNull(),
  preparedBy: text('prepared_by').notNull(),
  isFinalized: boolean('is_finalized').default(false).notNull(),
  finalizedByRole: text('finalized_by_role'), // 'GM' or 'DCS'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const soaItems = pgTable('soa_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  soaId: uuid('soa_id').references(() => statementOfAccounts.id).notNull(),
  salesInvoiceNo: text('sales_invoice_no').notNull(),
  drNo: text('dr_no').notNull(),
  siDate: timestamp('si_date').notNull(),
  dueDate: timestamp('due_date').notNull(),
  ageDays: integer('age_days').notNull(),
  invoiceAmount: numeric('invoice_amount', { precision: 12, scale: 2 }).notNull(),
  amountPaid: numeric('amount_paid', { precision: 12, scale: 2 }).default('0.00').notNull(),
  invoiceBalance: numeric('invoice_balance', { precision: 12, scale: 2 }).notNull(),
  runningBalance: numeric('running_balance', { precision: 12, scale: 2 }).notNull(),
});

// Purchase Orders
export const purchaseOrders = pgTable('purchase_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  poNumber: text('po_number').notNull().unique(),
  vendorId: uuid('vendor_id').references(() => vendors.id).notNull(),
  poDate: timestamp('po_date').defaultNow().notNull(),
  status: text('status').default('DRAFT').notNull(), // 'DRAFT', 'PENDING_ACCOUNTING', 'PENDING_GM', 'PENDING_DCS', 'APPROVED', 'REJECTED'
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  accountingApproved: boolean('accounting_approved').default(false).notNull(),
  gmApproved: boolean('gm_approved').default(false).notNull(),
  dcsApproved: boolean('dcs_approved').default(false).notNull(),
  isShortageException: boolean('is_shortage_exception').default(false).notNull(),
  shortageReason: text('shortage_reason'),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
});

export const poItems = pgTable('po_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  poId: uuid('po_id').references(() => purchaseOrders.id).notNull(),
  itemId: uuid('item_id').references(() => items.id).notNull(),
  orderedQty: integer('ordered_qty').notNull(),
  receivedQty: integer('received_qty').default(0).notNull(),
  unitCost: numeric('unit_cost', { precision: 12, scale: 2 }).notNull(),
});

// Vendor Invoices & 3-Way Match Records
export const vendorInvoices = pgTable('vendor_invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceNumber: text('invoice_number').notNull(),
  vendorId: uuid('vendor_id').references(() => vendors.id).notNull(),
  poId: uuid('po_id').references(() => purchaseOrders.id).notNull(),
  invoiceDate: timestamp('invoice_date').notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  attachmentUrl: text('attachment_url').notNull(),
  isVerified3Way: boolean('is_verified_3way').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Request for Payment (RFP)
export const paymentRequests = pgTable('payment_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  rfpNumber: text('rfp_number').notNull().unique(),
  makerId: uuid('maker_id').references(() => users.id).notNull(),
  payee: text('payee').notNull(),
  glAccountId: uuid('gl_account_id').references(() => glAccounts.id).notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  justification: text('justification').notNull(),
  attachmentUrl: text('attachment_url'),
  status: text('status').default('PENDING_GM').notNull(), // 'PENDING_GM', 'PENDING_DCS', 'APPROVED', 'RELEASED_PAID', 'REJECTED'
  releasedBank: text('released_bank'),
  releasedRefNo: text('released_ref_no'),
  disbursementProof: text('disbursement_proof'),
  releasedAt: timestamp('released_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Import Staging Table
export const importStaging = pgTable('import_staging', {
  id: uuid('id').primaryKey().defaultRandom(),
  batchId: text('batch_id').notNull(),
  importType: text('import_type').notNull(), // 'BEGINNING_INVENTORY', 'OPEN_PO', 'OPEN_AR'
  status: text('status').default('STAGED').notNull(), // 'STAGED', 'VALIDATED', 'PROCESSED', 'REJECTED'
  payload: jsonb('payload').notNull(),
  errors: jsonb('errors'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Workflow Approval Logs
export const approvalLogs = pgTable('approval_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentType: text('document_type').notNull(),
  documentId: uuid('document_id').notNull(),
  stepNumber: integer('step_number').notNull(),
  approverRole: text('approver_role').notNull(),
  approverUserId: uuid('approver_user_id').references(() => users.id).notNull(),
  action: text('action').notNull(),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Immutable System Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  userEmail: text('user_email').notNull(),
  actionType: text('action_type').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  beforeState: jsonb('before_state'),
  afterState: jsonb('after_state'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

