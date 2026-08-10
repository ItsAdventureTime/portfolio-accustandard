---
title: "AccuStandard ERP Demo — Developer Handoff"
document_type: "Product Requirements and Developer Handoff"
version: "1.0"
status: "Confirmed for Handoff"
language: "English (US)"
date: "2026-08-10"
---

# AccuStandard ERP Demo — Developer Handoff

## 1. Executive Summary

AccuStandard requires a working ERP demo that executes the real end-to-end workflow by user role. The system must not rely on manually seeded statuses, disconnected sample data, or role simulation as a substitute for production workflow behavior.

Every submission, review, approval, receipt, invoice, payment, collection, fund release, import, export, and override must update the correct business record, balances, inventory, audit trail, and user queue.

This handoff incorporates the latest confirmed workflow and control requirements, including:

1. Client-format ROI with locked formula fields and editable client input fields.
2. Sales Quote approval by Marketing Reviewer and GM, with no DCS approval stage.
3. Client acceptance evidence before fulfillment.
4. Explicit Accounting review in the PO workflow.
5. Admin-configurable DCS PO approval rules.
6. Open-PO controls to reduce duplicate and potentially fraudulent purchasing.
7. Reliable PO-linked Goods Receipt synchronization.
8. Separate Vendor Invoice and 3-way match workflow.
9. PO and non-PO payment workflows with proof of disbursement.
10. Weighted moving average inventory costing with a visible costing history.
11. Transaction-level Invoice and client-level SOA based on uncollected invoices.
12. Allocation of one client payment across multiple invoices, including partial allocations.
13. Granular Admin-configurable access for downloads, exports, imports, and administrative functions.
14. Startup/cutover imports for master data, beginning balances, inventory, and open transactions.
15. Manual QuickBooks export for v1 with a QBO-ready data structure.

---

## 2. Background and Problem

The current reviewed demo contains the intended modules and high-level flow, but several areas are incomplete, simplified, or not synchronized end to end.

Confirmed gaps include:

- The current ROI calculator is materially simpler than the client’s actual ROI workbook.
- DCS was incorrectly included as a required Sales Quote approver.
- Purchasing review could bypass or auto-approve the Accounting reviewer stage.
- Goods Receipt posting does not reliably update the exact linked PO across all views.
- Some purchasing statuses can show inconsistent combinations, such as verified match status while receipt or invoice data is still missing.
- The Vendor Invoice and PO-payment workflow is incomplete.
- A role simulator exists, but real user-specific actionable queues are required.
- Billing/SOA presentation exists, but the full transaction chain must function.
- Weighted moving average costing was not explicitly included.
- Open PO quantities are not sufficiently considered before creating new POs for the same SKU.
- Supporting evidence is not consistently required or controlled.
- Admin permissions, exports, GL maintenance, approval rules, and startup imports must be configurable rather than hard-coded.
- The ERP needs a controlled migration/cutover process so the client can start with valid balances and open transactions instead of an empty database.

---

## 3. Goals and Success Criteria

### 3.1 Goals

- Execute each critical workflow using real records and distinct user accounts.
- Maintain one authoritative state machine per transaction type.
- Enforce server-side role and action permissions.
- Enforce segregation of duties and no self-approval.
- Maintain traceability from source request to final financial or inventory outcome.
- Keep finance, inventory, procurement, billing, and payment balances reconciled.
- Reduce code changes by moving changeable business rules and privileges into Admin configuration.
- Support controlled startup/cutover migration.
- Keep the system ready for future QuickBooks Online integration.

### 3.2 Success Criteria

The next demo is considered successful when:

- A fresh record can move through the complete workflow using separate user accounts.
- Each role sees only the records that require its action, plus permitted drafts, returned items, and history.
- ROI sections and calculations match the client-approved workbook structure and logic.
- A GM-approved Sales Quote cannot proceed to fulfillment until client acceptance evidence is recorded, unless an authorized exception is explicitly approved.
- PO review, approval, receiving, Vendor Invoice, match, and payment states reconcile.
- A posted Goods Receipt updates the exact linked PO and inventory atomically.
- A new same-SKU PO cannot bypass valid open PO quantities without an approved exception.
- Weighted moving average cost is recalculated correctly after qualifying receipts.
- SOA balances reconcile to posted invoices and payment allocations.
- Sensitive exports, downloads, imports, and configuration changes are permission-controlled and audited.
- Startup balances and open transactions can be imported, validated, posted, and reconciled.

---

## 4. Non-Goals and Scope

### 4.1 In Scope for v1

- Single web application
- RBAC and granular action permissions
- Per-role work queues
- RFQ
- ROI
- Sales Quote
- Client acceptance evidence
- Warehouse purchase request
- Purchase Order
- Accounting PO review
- GM PO approval
- Conditional DCS PO approval
- Goods Receipt
- Vendor Invoice
- 3-way match
- PO-related payment processing
- Delivery Receipt
- Invoice
- SOA
- Collections and invoice allocation
- Non-PO RFP
- GL account maintenance
- QR-enabled inventory tracking
- Weighted moving average inventory costing
- Audit log
- Attachment and evidence controls
- Manual QuickBooks export
- Startup/cutover imports
- Procurement fraud and exception controls

### 4.2 Future Consideration

- Direct QuickBooks Online integration
- Advanced fraud scoring or anomaly models beyond the specified rules
- Additional analytics beyond required operational and exception reporting

---

## 5. Users and Stakeholders

### 5.1 Primary System Roles

- Sales Officer
- Marketing Reviewer
- Warehouse
- Purchasing Officer
- Accounting
- Bookkeeper
- GM
- DCS
- Admin

### 5.2 Stakeholders

- AccuStandard management
- Finance and Accounting
- Sales and Marketing
- Warehouse and Purchasing
- Client-facing operations
- Product and development team

---

## 6. Pain Points

- ROI does not match the client’s actual working format.
- Approval stages are not consistently aligned with real responsibilities.
- Role-based work is not sufficiently separated.
- PO, receipt, invoice, and payment statuses can become inconsistent.
- Open PO quantities are not sufficiently protected from duplicate purchasing.
- Costing is not visible as weighted moving average.
- SOA is not fully driven by posted operational transactions.
- Supporting documents are not consistently enforced.
- Administrative controls depend too much on code changes.
- Startup continuity is at risk if balances, inventory, and open transactions cannot be migrated cleanly.
- Existing controls are not yet sufficient to reduce ghost purchases, duplicate invoices, approval bypasses, and related procurement fraud risks.

---

## 7. Current Workflow

The reviewed demo contains the major screens and workflow concepts, but some states are represented visually without complete transaction-state synchronization.

Key current gaps:

1. Simplified ROI calculator instead of the client workbook structure.
2. Incorrect Sales Quote approval path.
3. Missing explicit Accounting PO review.
4. Unreliable Goods Receipt-to-PO synchronization.
5. Missing complete Vendor Invoice workflow.
6. Incomplete per-role queues.
7. Incomplete transaction-driven billing/SOA chain.
8. No explicit weighted moving average costing view.
9. No full startup import/cutover process.
10. No complete configurable permission matrix for sensitive actions.
11. No explicit client Sales Quote acceptance evidence.
12. No comprehensive open-PO anti-fraud control.

---

## 8. Proposed Workflow

### 8.1 Sales Workflow

1. Sales Officer creates an RFQ.
2. Sales Officer submits the RFQ.
3. Marketing Reviewer opens the RFQ from My Actions.
4. Marketing Reviewer creates the linked ROI.
5. System prevents a second active ROI for the same RFQ.
6. Marketing Reviewer saves the ROI and links it to the Sales Quote.
7. GM reviews the RFQ, full ROI, quote lines, totals, and attachments.
8. GM approves or returns.
9. After GM approval, status becomes **Awaiting Client Approval**.
10. Sales Officer records client acceptance and uploads approved/signed evidence.
11. Status becomes **Client Approved / Accepted**.
12. Only then may fulfillment proceed, unless an explicitly authorized exception exists.

DCS is not a required Sales Quote approver.

### 8.2 Procurement Workflow

1. Warehouse identifies procurement need.
2. Before a new PO line is created, the system checks relevant existing open PO quantities for the same SKU.
3. Purchasing Officer prepares the PO.
4. If sufficient usable open PO quantity exists, a new PO for the same requirement is blocked.
5. If existing open PO quantity is insufficient, a new PO may be requested only for the shortage quantity.
6. Any same-SKU open-PO exception requires documented justification.
7. Accounting explicitly reviews and approves or returns.
8. GM approves or returns.
9. DCS approval is inserted only when an Admin-configured PO approval rule is triggered.
10. Warehouse receives against the approved PO.
11. Vendor Invoice is recorded.
12. System performs 3-way match.
13. Accounting prepares payment.
14. GM approves payment.
15. DCS releases funds and records proof of disbursement.

### 8.3 Billing and Collection Workflow

1. Client-approved Sales Quote/order proceeds to fulfillment.
2. Delivery Receipt references the approved source transaction and actual released inventory.
3. Invoice is created at transaction level.
4. Client SOA is generated from that client’s posted invoices with remaining balances.
5. Either GM or DCS may finalize the SOA independently.
6. Client payments are recorded.
7. One payment may be allocated across multiple invoices.
8. Partial allocations are allowed.
9. Remaining balances and aging update from posted allocations.

### 8.4 Non-PO RFP Workflow

1. Bookkeeper creates the RFP.
2. GM approves or returns.
3. DCS releases, holds, or returns.
4. Proof of disbursement is required for completed payment.
5. Approved/paid RFP enters the manual QuickBooks export queue.

---

## 9. Roles and Permissions

### 9.1 General Principles

- Permissions must be enforced server-side.
- No self-approval.
- Users must not gain access merely because a UI button is hidden or shown.
- Admin role simulation/View As is read-only.
- Sensitive actions must be independently configurable.
- Admin configuration changes must be audited.
- Not every Admin account should automatically receive every administrative privilege.

### 9.2 Granular Admin-Configurable Permissions

Admin must be able to grant or revoke permissions such as:

- View attachment
- Upload attachment
- Download attachment
- Replace/version attachment
- Print document
- Export list/report
- Export item master
- Export inventory
- Export transaction data/database extract
- Import startup data
- Manage GL accounts
- Manage approval rules
- Manage users and roles
- View inventory costing
- View sensitive financial information
- Record overrides
- Perform reversals
- Access audit logs

### 9.3 Confirmed Role Responsibilities

| Role | Primary Responsibilities |
|---|---|
| Sales Officer | RFQ creation, Sales Quote coordination, client-approval evidence |
| Marketing Reviewer | ROI preparation and review |
| Warehouse | Purchase request, receiving, inventory movement |
| Purchasing Officer | PO preparation |
| Accounting | PO review, Vendor Invoice, match review, payment preparation |
| Bookkeeper | Billing/SOA support, non-PO RFP |
| GM | Sales Quote approval, PO approval, payment approval, SOA finalization |
| DCS | Conditional PO approval, fund release, SOA finalization |
| Admin | Users, roles, permissions, approval rules, GL master, imports, controlled configuration |

---

## 10. Functional Requirements

### FR-001: RFQ Creation and Submission

- **Description:** Sales Officer creates and submits an RFQ using the client’s existing AccuStandard Request for Quotation format as the source of truth.
- **Actor:** Sales Officer
- **Trigger:** New customer request
- **Expected behavior:** The web form captures the same business information as the client’s current RFQ form, persists the record, routes it to Marketing Reviewer, and generates a client-recognizable printable/PDF RFQ.
- **Inputs and outputs:**
  - Date
  - Name of Health Facility
  - Full address: No. & Street, Barangay, City/Municipality, Province, Region
  - Addressee of Quotation
  - Addressee Position
  - Chief Medical Technologist
  - Pathologist
  - Contact Person
  - Contact Person Position
  - Contact Number
  - Email Address
  - Ownership: Government / Private
  - Institutional Character: Hospital / Free-Standing Laboratory
  - Initial Setup / Upgrade Only
  - Per-category Purchase / RTU selections
  - Test categories: Chemistry, Electrolytes, HbA1c, Hematology, Immunology, Microscopy (UA), Others
  - Others specification
  - Daily Census
  - Existing Machine
  - Existing Supplier
  - Years of Contract
  - Special Request, including payment terms/deals where applicable
  - Remarks
  - Requestor’s Name
  - Required/supporting attachments
- **Business rules:**
  - Draft must persist across refresh/logout.
  - The uploaded client RFQ form is the source of truth for required RFQ structure and recognizable document layout.
  - The web form may improve usability, field grouping, validation, and data entry, but it must not remove required client fields.
  - Where machine census/test census is required, the system must support the relevant attachment.
  - For RTU requests, a 3-month validated census attachment is required before submission unless an authorized exception is configured and audited.
  - RFQ print/PDF output must preserve the client-recognizable AccuStandard branding, header treatment, field grouping, classification section, selection/table section, notes, requestor area, and footer structure.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Submitted RFQ appears in Marketing Reviewer My Actions.
  - Draft RFQ persists server-side.
  - RFQ status is derived from authoritative workflow state.
  - All fields represented in the current client RFQ form can be captured in the system.
  - RTU submission is blocked when the required 3-month validated census is missing, unless an authorized exception rule applies.
  - Generated RFQ print/PDF output is recognizably aligned with the client’s existing RFQ document.

### FR-002: Client-Format ROI
- **Description:** Replace the simplified ROI calculator with the client-approved ROI workbook structure.
- **Actor:** Marketing Reviewer
- **Trigger:** Eligible RFQ selected for ROI preparation
- **Expected behavior:** System exposes the same meaningful sections, inputs, calculated fields, totals, and formula relationships as the client workbook.
- **Inputs and outputs:** Equipment, installation, operating assumptions, pre/post-installation costs, per-SKU economics, annual contribution, ROI years.
- **Business rules:**
  - Editable workbook input cells become editable system fields.
  - Formula/calculated fields are automatic and locked.
  - The client workbook’s calculation behavior is the v1 source of truth.
  - The current workbook landed-cost behavior, including the `USD × FX ÷ 0.70` treatment, is preserved in v1 unless the client formally changes it.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Reviewer can enter all client input fields.
  - Formula fields cannot be manually overwritten.
  - Refresh does not lose ROI data.
  - Calculated values match approved workbook logic for equivalent inputs.

### FR-003: One Active ROI per RFQ
- **Description:** Each RFQ may have only one active ROI.
- **Actor:** Marketing Reviewer
- **Trigger:** ROI creation or revision
- **Expected behavior:** Existing active ROI blocks duplicate active creation.
- **Business rules:** Revisions are versioned.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Ineligible RFQ explains why it cannot be selected.
  - Revision creates a new version rather than a duplicate active ROI.

### FR-004: Sales Quote Approval
- **Description:** Sales Quote requires Marketing Reviewer-prepared ROI and GM approval.
- **Actor:** GM
- **Trigger:** Reviewer-submitted Sales Quote
- **Expected behavior:** GM sees RFQ, full ROI, quote lines, totals, and attachments.
- **Business rules:** DCS is not part of Sales Quote approval.
- **Priority:** Must Have
- **Acceptance criteria:**
  - GM cannot approve if ROI is absent, incomplete, stale, or unlinked.
  - Quote total equals the sum of line totals adjusted by configured taxes/discounts.
  - No DCS task is generated.
  - Approved commercial terms are immutable until revision.

### FR-005: Client Acceptance Evidence for Sales Quote
- **Description:** Internal approval does not equal client acceptance.
- **Actor:** Sales Officer
- **Trigger:** GM-approved Sales Quote
- **Expected behavior:** Status becomes Awaiting Client Approval until evidence is recorded.
- **Inputs and outputs:** Signed quotation, approved PDF, client PO, email approval evidence, client approval date, client approver/contact, remarks.
- **Business rules:** Fulfillment cannot proceed before acceptance unless an authorized exception exists.
- **Priority:** Must Have
- **Acceptance criteria:**
  - System requires client-approval evidence before status becomes Client Approved / Accepted.
  - Evidence is versioned and auditable.
  - Downstream fulfillment is blocked while Awaiting Client Approval.

### FR-006: Open PO Check by SKU
- **Description:** Prevent unnecessary new POs while valid open PO quantities exist.
- **Actor:** Purchasing Officer
- **Trigger:** New PO line for a SKU
- **Expected behavior:** System checks all relevant open PO balances.
- **Inputs and outputs:** Existing PO number, supplier, ordered quantity, received quantity, remaining quantity, expected receipt date, status.
- **Business rules:**
  - Sufficient open PO quantity blocks a new PO for the same requirement.
  - If open PO is insufficient, a new PO may cover shortage quantity only.
  - Exception requires justification and Accounting → GM approval.
- **Priority:** Must Have
- **Acceptance criteria:**
  - System displays relevant open PO balances before PO submission.
  - Duplicate same-SKU PO cannot proceed silently.
  - Exception reason is stored in audit history.

### FR-007: Accounting PO Review
- **Description:** Accounting explicitly reviews the PO after Purchasing.
- **Actor:** Accounting
- **Trigger:** Purchasing submits PO
- **Expected behavior:** Accounting may approve or return.
- **Business rules:** No automatic reviewer approval.
- **Priority:** Must Have
- **Acceptance criteria:**
  - PO appears in Accounting My Actions.
  - GM cannot approve until Accounting approval is complete.

### FR-008: Configurable DCS PO Approval
- **Description:** DCS PO approval is optional and controlled by Admin-configured rules.
- **Actor:** Admin, DCS
- **Trigger:** PO meets configured rule
- **Expected behavior:** DCS stage is inserted only when the rule evaluates true.
- **Business rules:** Rule changes are audited and do not retroactively alter completed approvals.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Admin can configure DCS approval rules without code deployment.
  - PO not matching a rule does not generate a DCS approval task.
  - PO matching a rule cannot proceed until DCS action is complete.

### FR-009: Goods Receipt Posting
- **Description:** Warehouse posts a receipt against one approved PO.
- **Actor:** Warehouse
- **Trigger:** Physical goods received
- **Expected behavior:** Selected PO, inventory, and receipt state update atomically.
- **Inputs and outputs:** Quantity, batch/lot, expiry, serial if applicable.
- **Business rules:** Over-receipt blocked; partial receipt supported.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Posted GR updates exact PO received-to-date and remaining quantity.
  - PO list and PO detail show the same derived values.
  - Inventory increases once and only once.
  - Cancelled/unposted GR does not increase stock.

### FR-010: Vendor Invoice Module
- **Description:** Separate module for supplier invoices.
- **Actor:** Accounting
- **Trigger:** Vendor invoice received
- **Expected behavior:** Invoice is linked to PO and one or more GRs.
- **Inputs and outputs:** Supplier invoice number/date, amount, attachments, PO and GR references.
- **Business rules:** Vendor invoice attachment is required.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Vendor Invoice can be independently tracked.
  - 3-way verification is impossible without a posted Vendor Invoice.

### FR-011: 3-Way Match
- **Description:** Compare approved PO, cumulative posted GR, and posted Vendor Invoice.
- **Actor:** System / Accounting
- **Trigger:** Required documents exist
- **Expected behavior:** Match or exception status is derived.
- **Business rules:** Missing Vendor Invoice = Awaiting Vendor Invoice, not Verified.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Verified requires all three valid documents.
  - Variances remain in exception status.
  - Status cannot be manually forced to Verified without compliant records.

### FR-012: PO Payment Processing
- **Description:** Accounting prepares payment, GM approves, DCS releases funds.
- **Actor:** Accounting, GM, DCS
- **Trigger:** Valid payable transaction
- **Expected behavior:** Payment proceeds through maker/approval/release workflow.
- **Inputs and outputs:** Payee, amount, bank/funding source, payment date, method, reference.
- **Business rules:** Proof of disbursement is required at DCS release.
- **Priority:** Must Have
- **Acceptance criteria:**
  - DCS cannot mark payment released without required evidence.
  - Released payment stores amount, payment source, date, reference, and proof.

### FR-013: QR Inventory Identification
- **Description:** Generate and scan QR identifiers for inventory.
- **Actor:** Warehouse
- **Trigger:** Valid posted receipt
- **Expected behavior:** QR resolves to exact SKU/batch and serial where applicable.
- **Priority:** Should Have
- **Acceptance criteria:**
  - Printed/scanned QR opens the correct SKU/batch record.
  - Unposted/cancelled receipt cannot create scannable stock.

### FR-014: Weighted Moving Average Cost
- **Description:** Maintain inventory costing using weighted moving average.
- **Actor:** System; authorized finance/inventory users
- **Trigger:** Qualifying inventory receipt
- **Expected behavior:** Average unit cost is recalculated from prior inventory value plus incoming inventory value.
- **Business rules:**
  - Stock issues/releases use the current weighted moving average cost at the time of movement.
  - Beginning inventory cost establishes the opening basis.
  - Cost changes must be traceable.
- **Priority:** Must Have
- **Acceptance criteria:**
  - New valid receipt recalculates average cost.
  - Inventory movement history shows resulting unit cost and inventory value.
  - Inventory valuation reconciles to movement history.

### FR-015: Inventory Costing View
- **Description:** Show transparent costing per SKU.
- **Actor:** Authorized Inventory, Accounting, and Admin users
- **Trigger:** User opens SKU costing
- **Expected behavior:** Costing view displays current cost and history.
- **Inputs and outputs:** On-hand quantity, current weighted moving average unit cost, total inventory value, latest receipt cost, movement/receipt history, resulting average after each receipt.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Current displayed average cost matches movement-derived calculation.
  - Cost history is visible to authorized users.

### FR-016: Role-Based Work Queues
- **Description:** Provide real queues per user role.
- **Actor:** All users
- **Trigger:** Login
- **Expected behavior:** Users see only relevant work.
- **Priority:** Must Have
- **Acceptance criteria:**
  - My Actions shows actionable current-stage records.
  - Returned to Me shows reason and returner.
  - My Drafts persists unsent work.
  - Submitted/History shows current stage, next owner, timestamps, and outcome.

### FR-017: Delivery Receipt
- **Description:** DR references approved/client-accepted source transaction and actual inventory release.
- **Actor:** Authorized fulfillment user
- **Trigger:** Approved order fulfillment
- **Expected behavior:** Delivered quantities are linked to actual stock movement.
- **Business rules:** Cannot release more than allowed quantity without an authorized exception.
- **Priority:** Must Have
- **Acceptance criteria:**
  - DR references source Sales Quote/order.
  - Inventory movement and DR quantity reconcile.

### FR-018: Invoice
- **Description:** Invoice exists at transaction level.
- **Actor:** Bookkeeper or authorized billing user
- **Trigger:** Billable delivery
- **Expected behavior:** Invoice references source DR and client.
- **Business rules:** Invoice quantities cannot exceed delivered quantities without an authorized exception.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Invoice line quantities reconcile to eligible delivered quantities.
  - Posted invoice becomes eligible for SOA.

### FR-019: Client SOA
- **Description:** SOA is generated per client from uncollected and partially collected posted invoices.
- **Actor:** Bookkeeper, GM, DCS
- **Trigger:** SOA generation
- **Expected behavior:** SOA shows invoice/SI number, DR number, invoice date, due date, age, amount, payments, balance, and running balance.
- **Business rules:** Either GM or DCS may finalize independently.
- **Priority:** Must Have
- **Acceptance criteria:**
  - No SOA line exists without a posted invoice and linked client.
  - Fully collected invoices are excluded from the open-balance SOA.
  - Totals reconcile to invoice balances and posted allocations.
  - Print/export matches on-screen totals and finalization status.

### FR-020: Collection Allocation
- **Description:** Client payment may be allocated across multiple invoices.
- **Actor:** Authorized Accounting/Collection user
- **Trigger:** Payment received
- **Expected behavior:** User allocates amount across eligible client invoices.
- **Business rules:** Partial allocation is allowed.
- **Priority:** Must Have
- **Acceptance criteria:**
  - One payment can cover multiple invoices.
  - Remaining invoice balance is preserved after partial payment.
  - Amount paid is derived from posted allocations, not a manual status flag.

### FR-021: Non-PO RFP
- **Description:** Maker → GM → DCS workflow for non-PO requests.
- **Actor:** Bookkeeper, GM, DCS
- **Trigger:** Non-PO payment request
- **Expected behavior:** Request proceeds through approval and fund release.
- **Inputs and outputs:** Payee/vendor, GL account, purpose, amount, requested date, attachments.
- **Business rules:** No auto-approval and no self-approval.
- **Priority:** Must Have
- **Acceptance criteria:**
  - GM can approve/return.
  - DCS can release/hold/return.
  - Proof of disbursement is required for released payment.

### FR-022: Admin GL Account Maintenance
- **Description:** Admin maintains active GL accounts used by transactions.
- **Actor:** Admin
- **Trigger:** GL maintenance
- **Expected behavior:** Add, edit, activate, deactivate, and map GL accounts.
- **Priority:** Must Have
- **Acceptance criteria:**
  - New active GL appears in relevant dropdowns without code deployment.
  - Inactive GL cannot be selected for new transactions.
  - Changes are audited.

### FR-023: Attachment Controls
- **Description:** Attachments are controlled business evidence.
- **Actor:** Authorized users
- **Trigger:** Upload, download, replace
- **Expected behavior:** Files are versioned and linked to the business record.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Required evidence cannot disappear after approval.
  - Download permission is independently configurable.
  - Attachment actions are auditable.

### FR-024: Manual QuickBooks Export
- **Description:** v1 uses controlled manual export.
- **Actor:** Accounting/Admin
- **Trigger:** Approved/postable transaction
- **Expected behavior:** Eligible transactions enter an export queue.
- **Business rules:** Data structure must remain QBO-ready for future integration.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Only approved/postable records are exportable.
  - Export includes source reference and GL mapping.
  - Export event is logged.

### FR-025: Startup/Cutover Import
- **Description:** Admin can import startup data for operational continuity.
- **Actor:** Authorized Admin
- **Trigger:** Initial setup/cutover
- **Expected behavior:** Import supports controlled staging, validation, preview, posting, and reconciliation.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Import does not silently overwrite live records.
  - Batch has a unique Import Batch ID.
  - Accepted/rejected counts and validation errors are retained.

### FR-026: Import Master Data
- **Description:** Import initial master data.
- **Actor:** Authorized Admin
- **Inputs:** Customers, vendors, SKUs, warehouses/locations, GL accounts, applicable price data.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Duplicate/potential-match records are flagged.
  - Valid data can be previewed before posting.

### FR-027: Import Beginning Inventory
- **Description:** Import inventory quantity and cost as of cutover date.
- **Actor:** Authorized Admin
- **Inputs:** SKU, warehouse/location, batch/lot, expiry, quantity, beginning unit cost, beginning value.
- **Business rules:** Beginning cost establishes the opening weighted-average basis.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Imported quantity/value reconciles to approved legacy inventory.
  - Resulting inventory appears in SKU/location balances.

### FR-028: Import Beginning Financial Balances
- **Description:** Import approved opening balances.
- **Actor:** Authorized Admin
- **Inputs:** GL opening balances, AR opening balances, AP opening balances where applicable.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Batch records the cutover/as-of date.
  - Totals reconcile to approved legacy source balances.

### FR-029: Import Ongoing Client Transactions
- **Description:** Import open customer transactions for continuity.
- **Actor:** Authorized Admin
- **Inputs:** Open invoices, partially collected invoices, payment allocations where needed, approved/open quotes/orders, delivered-not-billed transactions where applicable.
- **Business rules:** Imported records retain legacy reference numbers and are marked as imported.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Open balances remain accurate after import.
  - Imported transactions can participate in SOA and collection workflows.

### FR-030: Import Open Procurement Transactions
- **Description:** Import open procurement records.
- **Actor:** Authorized Admin
- **Inputs:** Open POs, partially received POs, outstanding quantities, relevant GRs, unpaid Vendor Invoices.
- **Business rules:** Imported open PO data must participate in same-SKU open-PO checks.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Open PO balances match legacy source.
  - New PO creation correctly considers imported open PO quantities.

### FR-031: Import Staging and Reconciliation
- **Description:** All startup imports use controlled staging.
- **Actor:** Authorized Admin/Accounting
- **Trigger:** File upload
- **Expected behavior:** Upload → Validate → Preview → Resolve Errors → Approve Import → Post → Reconcile.
- **Priority:** Must Have
- **Acceptance criteria:**
  - Invalid rows do not silently post.
  - Duplicate records require review.
  - Posted batch produces reconciliation totals.

### FR-032: Anti-Fraud Procurement Controls
- **Description:** System provides preventive and detective controls against ghost purchases, duplicate buying, fake receiving, duplicate invoices, and approval bypass.
- **Actor:** System, Accounting, GM, Admin
- **Priority:** Must Have
- **Acceptance criteria:**
  - Same-SKU open PO check runs before new PO submission.
  - Duplicate vendor invoice numbers are blocked or flagged.
  - Suspicious duplicate vendor master data can be identified using configured identifiers.
  - Split purchases near configured approval thresholds can be flagged.
  - Posted receipts cannot be invisibly edited.
  - Approved transactions cannot be deleted; only controlled cancellation/reversal is permitted.

### FR-033: Fraud/Exception Dashboard
- **Description:** Provide Accounting/GM with a view of material exceptions.
- **Actor:** Accounting, GM, authorized Admin
- **Priority:** Should Have
- **Acceptance criteria:**
  - Dashboard can surface duplicate PO attempts, open-PO overrides, duplicate invoice flags, unusual vendor changes, threshold splitting, receipts without invoices, invoices without receipts, long-open POs, and repeated overrides.

### FR-034: Sensitive Export and Download Audit
- **Description:** Sensitive exports and downloads must be controlled and traceable.
- **Actor:** Authorized users
- **Priority:** Must Have
- **Acceptance criteria:**
  - Permission is checked server-side.
  - Audit log records user, timestamp, action type, relevant filters/range, and record/file count where applicable.

---

## 11. Screens and Interface

### 11.1 Required Screens

- Login
- Role-based Dashboard
- My Actions
- Returned to Me
- My Drafts
- Submitted / History
- RFQ list/detail/form
- ROI list/detail/form
- Sales Quote list/detail/preview
- Client Approval Evidence action
- Warehouse Purchase Request
- PO list/detail/form
- Accounting PO Review
- Goods Receipt
- Vendor Invoice
- 3-Way Match / Exception view
- Payment Processing
- Inventory List
- SKU Detail
- SKU Costing View
- QR generation/print/scan
- Delivery Receipt
- Invoice
- SOA
- Collection Allocation
- Non-PO RFP
- GL Account Maintenance
- Roles & Permissions
- Approval Rule Configuration
- Startup Data Import
- Import Batch Detail / Errors / Reconciliation
- QuickBooks Export Queue
- Fraud/Exception Dashboard
- Audit Log

### 11.2 RFQ Screen and Document Layout

The RFQ module must use the client’s current **Request for Quotation** form as the visual and structural reference.

The screen may be optimized for web entry, but it must preserve the same business sections:

1. AccuStandard / Marketing Department document identity
2. Health facility and address details
3. Quotation addressee and clinical/contact persons
4. Classification
5. Initial Setup / Upgrade selection
6. Purchase / RTU selections by test category
7. Daily Census
8. Existing Machine
9. Existing Supplier
10. Years of Contract
11. Special Request
12. Remarks
13. Requestor’s Name
14. Census attachment notes

The generated printable/PDF RFQ should remain recognizable as the same document used by the client, including the branded header, structured field lines/sections, category table, notes, requestor area, and footer/contact treatment.

### 11.3 Queue Columns

At minimum:

- Document ID
- Transaction type
- Maker
- Customer/vendor
- Amount
- Age
- Current stage
- Due date
- Action
- Next owner where applicable

---

## 12. Forms, Data, and Validation

### 12.1 RFQ

The RFQ form must support the exact information represented in the client’s current RFQ document:

- Date
- Name of Health Facility
- Full address
- Addressee of Quotation and Position
- Chief Medical Technologist
- Pathologist
- Contact Person and Position
- Contact Number
- Email Address
- Ownership
- Institutional Character
- Initial Setup / Upgrade Only
- Purchase / RTU by category
- Chemistry
- Electrolytes
- HbA1c
- Hematology
- Immunology
- Microscopy (UA)
- Others + specification
- Daily Census
- Existing Machine
- Existing Supplier
- Years of Contract
- Special Request
- Remarks
- Requestor’s Name
- Machine/test census attachment where applicable
- 3-month validated census for RTU requests

Validation must follow the client form’s intent while supporting clear digital validation and attachment requirements.

### 12.2 ROI

The ROI screen must follow the client workbook structure, including:

#### Equipment and Installation
- Machine USD cost
- Currency
- Exchange rate
- PHP price
- Quantity
- Shipping
- Miscellaneous equipment
- LIS connectivity
- Pre-installation expenses

#### Operating Assumptions
- Volume/day
- Volume/month
- Tests per kit
- Kits/month

#### Post-Installation / Account Costs
- PMS
- Troubleshooting
- Spare parts
- Sponsorship
- Team building
- Christmas party
- PAMET
- Incentive
- Sales and collection
- Training

#### Per-SKU Economics
- NDP USD
- FX
- Shipping assumption
- Landed cost
- Price offer
- 12% tax
- Net price
- Unit margin
- Annual quantity
- Annual cost
- Annual margin

#### Payback / ROI
- Total upfront investment
- Annual net contribution
- ROI in years

### 12.3 Goods Receipt

Required fields as applicable:

- Approved PO
- SKU
- Actual received quantity
- Batch/lot
- Expiry
- Serial number
- Warehouse/location
- Supporting evidence if configured

### 12.4 Vendor Invoice

- Vendor
- Invoice number
- Invoice date
- Amount
- Linked PO
- Linked GR(s)
- Attachment
- Tax fields as configured

### 12.5 RFP

- Payee/vendor
- GL account
- Purpose
- Amount
- Requested date
- Attachments
- Maker

### 12.6 DCS Disbursement

- Payment date
- Method
- Bank/funding source
- Reference/check/transaction number
- Amount disbursed
- Proof of disbursement attachment

---

## 13. Notifications, Approvals, and Integrations

### 13.1 Approval Routing

Approval tasks must be created only when the transaction’s authoritative state reaches that role.

No UI-only or manually seeded status may create a false approval outcome.

### 13.2 Returns

Return action must capture:

- Returner
- Reason
- Timestamp
- Previous stage
- Required correction if provided

### 13.3 Overrides

Where overrides are permitted, capture:

- Actor
- Timestamp
- Reason
- Previous state
- New state
- Related evidence where required

SOA-specific rule: either GM or DCS may finalize independently.

### 13.4 QuickBooks

v1 uses manual export.

Export-ready records should include:

- Source transaction ID
- Transaction type
- Date
- Customer/vendor
- Amount
- GL mapping
- Tax data where applicable
- Export status
- Exported by
- Export timestamp

The structure should be designed so future QBO integration can consume the same approved/postable source data.

---

## 14. Design, Usability, and Accessibility

### 14.1 Confirmed Design Direction

- The ROI must visually and structurally resemble the client’s actual workbook enough that the client recognizes the same logic and information.
- Web usability may improve layout, spacing, grouping, navigation, and validation, but must not remove required workbook sections or change formula meaning.
- Actionable queues should minimize searching and show the next required action clearly.
- Errors must explain what is wrong and what the user can do next.
- The interface must not display success until the server transaction has committed.

### 14.2 Suggested Accessibility Direction

- Keyboard-accessible forms and actions
- Clear labels and validation messages
- Sufficient contrast
- Visible focus states
- Non-color-only status indicators
- Accessible table and form semantics

---

## 15. Security and Privacy

### 15.1 Access Control

- Server-enforced authorization
- Least-privilege permissions
- Separation of duties
- No self-approval
- Granular control over attachments, exports, imports, financial data, and Admin functions

### 15.2 Attachment Security

- Authorized upload/download only
- Allowlisted file types
- File size limits
- Versioning
- Protected storage
- Malware scanning where available
- Audit trail for upload/download/replace

### 15.3 Sensitive Export Controls

Bulk exports and database extracts require explicit permission and generate an audit event.

### 15.4 Transaction Integrity

Approved/postable records must not be directly deleted.

Use controlled:

- Return
- Cancel
- Reverse
- Supersede
- Version/revise

---

## 16. Non-Functional Requirements

### 16.1 Persistence
Server-side drafts must survive refresh, logout, or device change.

### 16.2 Idempotency
Submit, approve, post, release, and similar endpoints must be idempotent. Double-click or retry must not create duplicate events.

### 16.3 Authoritative State
Each transaction type must have one authoritative state machine. UI labels are derived from state, not independently stored in disconnected views.

### 16.4 Auditability
Audit log must capture:

- Create
- Edit
- Submit
- Return
- Approve
- Override
- Post
- Reverse
- Sync/export
- Download/export where sensitive
- Import
- Permission change
- Approval-rule change
- Vendor-master change
- GL-master change

### 16.5 Reliability
No success state before server commit.

### 16.6 Data Consistency
PO list, PO detail, GR, Vendor Invoice, 3-way match, inventory, payment, and audit views must derive from the same underlying source records and events.

---

## 17. Errors and Edge Cases

### 17.1 Sales / ROI
- RFQ already has an active ROI.
- ROI is incomplete or stale.
- Quote changed after ROI approval.
- Client approval evidence is missing.
- Client rejects or requests revision after internal approval.

### 17.2 Procurement
- Existing open PO fully covers requirement.
- Existing open PO partially covers requirement.
- Open PO expected delivery is delayed.
- Existing PO is cancelled or closed.
- New PO requested for shortage quantity.
- Same SKU requested from a different supplier.
- Duplicate PO submission due to retry/double-click.
- Purchase splitting near an approval threshold.

### 17.3 Receiving
- Over-receipt
- Partial receipt
- Wrong PO selected
- Duplicate receipt post
- Missing/invalid batch or expiry
- Receipt reversal

### 17.4 Vendor Invoice
- Duplicate vendor invoice number
- Invoice before receipt
- Invoice amount/quantity variance
- Missing invoice attachment
- Vendor mismatch
- Invoice references cancelled PO

### 17.5 Inventory Costing
- Zero or negative quantity receipt
- Cost correction after receipt
- Return to vendor
- Inventory adjustment
- Beginning balance correction
- Transfer between warehouses/locations

### 17.6 Billing and Collection
- Invoice exceeds delivered quantity
- Payment exceeds client open balance
- Partial allocation
- One payment across multiple invoices
- Reversal of posted allocation
- Negative or impossible aging

### 17.7 Imports
- Duplicate SKU/customer/vendor/reference
- Missing GL account
- Unknown warehouse
- Invalid batch/expiry
- Opening values do not reconcile
- Imported open PO conflicts with an existing live PO
- Re-running the same import batch

---

## 18. Priorities

### Must Have

- RBAC and granular permissions
- Role queues
- Audit trail
- RFQ → ROI → Sales Quote → GM
- Client acceptance evidence
- PO → Accounting → GM → conditional DCS
- Open PO same-SKU control
- Goods Receipt synchronization
- Vendor Invoice
- 3-way match
- Payment → GM → DCS release
- Weighted moving average costing
- Inventory costing view
- Approved SQ → DR → Invoice → SOA → Collection
- Non-PO RFP
- GL maintenance
- Attachment controls
- Proof of disbursement
- Startup imports
- Manual QuickBooks export
- Idempotent transaction actions

### Should Have

- Fraud/Exception Dashboard
- QR label generation and scanning
- Enhanced exception analytics

### Future Consideration

- Direct QBO integration
- More advanced automated fraud scoring/risk models

---

## 19. Assumptions and Constraints

### 19.1 Confirmed

- One active ROI per RFQ.
- Formula/calculated ROI fields are locked.
- Marketing Reviewer edits client input fields.
- Sales Quote internal approval ends with GM.
- Client acceptance must be recorded separately.
- DCS PO approval is Admin-rule-driven.
- Open PO balances must be considered before new same-SKU PO creation.
- Same-SKU shortage PO exceptions require Accounting → GM approval.
- Either GM or DCS may finalize SOA independently.
- Invoice is transaction-level; SOA is client-level.
- SOA is based on uncollected and partially collected posted invoices.
- Client payments may be allocated across multiple invoices.
- Partial invoice allocation is supported.
- v1 QuickBooks handoff is manual export.
- System should remain QBO-ready.
- Weighted moving average is the inventory costing method.
- Required supporting documents must be uploadable for Vendor Invoice, PO and non-PO RFP workflows, and DCS disbursement.
- Admin must be able to configure access to attachment downloads and data exports.
- Admin must be able to add and maintain GL accounts.
- Admin must be able to import beginning balances, beginning inventory, and ongoing transactions for cutover continuity.

### 19.2 Suggested

- Track weighted moving average per SKU per warehouse/location as the implementation default unless AccuStandard later directs otherwise.
- Use a fraud/exception dashboard.
- Use configurable administrative privileges rather than one unrestricted super-admin.
- Use staged startup imports with validation, preview, posting, and reconciliation.
- Flag suspicious purchase splitting, duplicate vendor identities, duplicate invoices, and repeated override activity.

---

## 20. Open Questions

The following items remain unresolved and must not be hard-coded as final business policy unless confirmed:

1. Final names/person assignments for Sales Officer, Purchasing Officer, and Marketing Reviewer roles.
2. Final active GL chart and final QuickBooks account mappings.
3. Exact Admin-configurable conditions that should trigger DCS PO approval.
4. Exact tax/document-label configuration where official invoice terminology may need to follow client accounting or statutory requirements.
5. Whether weighted moving average should remain per SKU per warehouse/location or be changed to another costing scope after client validation.
6. Exact tolerance rules for 3-way match quantity and amount variances.
7. Exact attachment requirements by transaction subtype beyond the confirmed mandatory categories.

---

## 21. Suggested Implementation Considerations

The following are recommendations, not confirmed business requirements unless otherwise stated.

### 21.1 Inventory Costing Scope
Use weighted moving average per SKU per warehouse/location by default. This avoids blending costs across physically separate locations where purchase or transfer costs may differ.

### 21.2 Procurement Fraud Controls
Implement layered controls rather than relying on one approval step:

- Open-PO same-SKU check
- Duplicate invoice detection
- Vendor-master duplicate indicators
- Approval-threshold splitting alerts
- Price and quantity variance alerts
- Controlled receipt reversals instead of edits
- Immutable approval and payment history
- Long-open PO monitoring
- Receipt-without-invoice and invoice-without-receipt exceptions
- Admin-rule-change audit history

### 21.3 Startup/Cutover Import Pattern
Use:

**Upload → Stage → Validate → Preview → Resolve Errors → Approve → Post → Reconcile**

Do not allow direct silent overwrite of live records.

### 21.4 Migration Traceability
Every imported record should retain:

- Import Batch ID
- Source/legacy reference
- Cutover/as-of date
- Imported by
- Imported timestamp
- Source filename
- Reconciliation status

### 21.5 Startup Reconciliation
Provide reconciliation views for:

- Inventory quantity and value
- Open AR
- Open AP
- Open POs
- Beginning GL balances

### 21.6 QBO Readiness
Even though v1 is manual export, use stable transaction IDs, GL mappings, postable-state flags, and export status fields so a future direct integration does not require redesign of source transactions.

---

## 22. Developer Handoff Checklist

Before the next client demo, confirm:

- [ ] Real user accounts exist for each tested role.
- [ ] Role queues are functional.
- [ ] Draft persistence works.
- [ ] RFQ captures all fields from the client’s existing RFQ form.
- [ ] RFQ print/PDF output is recognizably aligned with the client’s current document.
- [ ] RTU RFQ enforces the 3-month validated census attachment requirement.
- [ ] ROI matches the client workbook structure.
- [ ] ROI formula fields are locked.
- [ ] One active ROI per RFQ is enforced.
- [ ] Sales Quote has correct totals.
- [ ] Sales Quote generates no DCS approval task.
- [ ] Client acceptance evidence is required before fulfillment.
- [ ] Accounting PO review is mandatory.
- [ ] DCS PO approval is triggered only by Admin-configured rules.
- [ ] Open PO same-SKU checks are enforced.
- [ ] Shortage PO exception requires justification and Accounting → GM approval.
- [ ] Goods Receipt updates the exact PO and inventory atomically.
- [ ] Partial receipt works.
- [ ] Over-receipt is blocked.
- [ ] Vendor Invoice is a separate module.
- [ ] 3-way match cannot verify without PO + GR + Vendor Invoice.
- [ ] DCS payment release requires proof of disbursement.
- [ ] Weighted moving average costing recalculates correctly.
- [ ] SKU costing view reconciles to inventory movements.
- [ ] DR quantities reconcile to released inventory.
- [ ] Invoice quantities reconcile to delivered quantities.
- [ ] SOA includes only valid posted invoices with open balances.
- [ ] One payment can be allocated across multiple invoices.
- [ ] Partial allocations preserve remaining balances.
- [ ] Admin can maintain GL accounts without code changes.
- [ ] Admin can configure granular permissions.
- [ ] Attachment downloads and sensitive exports are permission-controlled.
- [ ] Sensitive download/export actions are audited.
- [ ] Startup master data import works.
- [ ] Beginning inventory import establishes correct opening cost/value.
- [ ] Beginning financial balances can be imported and reconciled.
- [ ] Open client transactions can be imported.
- [ ] Open procurement transactions can be imported.
- [ ] Imported open POs participate in duplicate/open-PO checks.
- [ ] Import batches use staging, validation, preview, posting, and reconciliation.
- [ ] Manual QuickBooks export is available for approved/postable records.
- [ ] Status labels are derived from one authoritative workflow state.
- [ ] Double-click/retry cannot create duplicate actions.
- [ ] Approved records cannot be silently deleted or edited.
- [ ] Audit log captures approvals, overrides, imports, exports, permission changes, and reversals.

---

## 23. References

### Source Materials

- `accustandard-updated-developer-handoff-2026-08-10.docx`
  - Used for corrected workflows, approval matrix, demo defects, role queues, Sales/ROI requirements, purchasing/receiving, Vendor Invoice, billing/SOA, RFP, shared platform requirements, and release priorities.

- `REVISED ROI_ACE PATEROS.xlsx`
  - Used as the client-approved ROI structure and formula source for v1 implementation.

- `RFQ Form.pdf`
  - Used as the client-approved RFQ visual and structural reference, including facility/contact fields, classification, Purchase/RTU selections, test categories, census fields, special requests, remarks, requestor details, and RTU census attachment note.

### External Guidance Used During Requirement Refinement

The following external guidance informed the **Suggested Implementation Considerations** only and does not replace confirmed client requirements:

- NIST access-control guidance: least privilege and separation of duties.
- OWASP Authorization Cheat Sheet: server-side authorization principles.
- OWASP File Upload Cheat Sheet: controlled file upload and storage practices.
- OECD procurement integrity guidance: controlled exceptions, oversight, red flags, and traceability.
- World Bank procurement integrity materials: fraud-risk and procurement-control concepts.
- GAO Green Book: preventive controls, segregation of duties, and fraud/improper-payment controls.
- ERP migration guidance from major enterprise platforms: staged migration of master data, opening balances, stock, and open transactions.

---

## Final Implementation Rule

Where this document differs from earlier organizer documents or demo assumptions, this confirmed handoff controls.

Do not simulate completion using manually seeded statuses. Demonstrate each critical flow by creating a new record and moving it through distinct user accounts while underlying totals, inventory, balances, audit history, and role queues update correctly.
