# AccuStandard ERP-Lite — Workflow and Product Blueprint

> **Reconciled 2026-08-12:** Sales Quote approval ends at GM; procurement and
> RFP DCS approval is conditional on configured rules. v1 uses a manual QBO
> export/queue; direct QBO integration remains future scope. See
> `IMPLEMENTATION_STATUS.md` for the current demo boundary.

## Product direction

Build a controlled operations layer that mirrors AccuStandard’s real workflow and feeds clean, approved transactions into QuickBooks. It is not a replacement accounting ledger. The system’s job is to connect sales, pricing, inventory, purchasing, receiving, fulfillment, billing, collections, and disbursement with a complete audit trail.

Primary source: [Aug 4, 2026 ERP workflow review](https://fathom.video/calls/771570646). Supporting validation: [Jul 22 bug/workflow review](https://fathom.video/calls/756038036) and [Jul 24 operational dashboard review](https://fathom.video/calls/759278258).

UI/UX scope is governed by `implementation_plan.md`; confirmed business rules
by the acceptance handoff; current runtime status by
`IMPLEMENTATION_STATUS.md`; operations by `README.md`, `ARCHITECTURE.md`, and
`CONTRIBUTING.md`.

## Correct end-to-end workflow

### 1. Demand and sales qualification

1. Sales Agent creates an RFQ/request, selecting the customer, products, quantities, expected term, delivery needs, and customer requirements.
2. The system checks customer-specific price rules, available/on-order/allocated inventory, batch cost, expiry class, and any existing customer PO or contract.
3. Sales prepares the sales quotation and Marketing reviews it with the ROI.
   The ROI must show side-by-side cost and selling price, including landed cost,
   sponsorship, LIS connectivity, other account-specific overhead, and expected
   margin over the contract.
4. GM reviews commercial reasonableness. The Sales Quote then waits for client
   acceptance evidence; Accounting and conditional DCS review do not apply to
   this sales approval chain.
6. Approved quotation becomes locked. A customer PO or signed contract/conforme is required before fulfillment; for Class 3/short-expiry items it is also required before any supplier PO.

### 2. Inventory allocation and fulfillment

1. Confirmed customer order reserves stock by batch using FEFO (first-expiry-first-out).
2. Warehouse scans barcode/QR when picking and releasing stock.
3. Inventory movement records quantity in/out, warehouse, batch/lot, expiry, source document, user, and timestamp.
4. Warehouse produces the delivery/issuance record. Fulfilled quantities update the customer order and available inventory automatically.
5. Partial fulfillment stays open with an explicit remaining quantity; it never silently closes.

### 3. Demand-driven replenishment

1. Replenishment is triggered by actual available stock, reservations, open customer demand, lead time, and critical level—not by a blind quarterly schedule.
2. Default planning view is monthly/as-needed. A proposed order shows demand coverage, open supplier POs, expected arrivals, 10% buffer where approved, excess-stock risk, cash requirement, and expiry risk.
3. Item classes drive controls:
   - Class 1: fast-moving/core stock; reorder at approved critical level plus buffer.
   - Class 2: controlled/slower-moving; require demand forecast and stricter quantity review.
   - Class 3: short-expiry/special order; no customer PO, no supplier PO.
4. Before creating a supplier PO, the system warns about or blocks overlapping open POs for the same supplier/item unless an authorized exception is recorded.

### 4. Purchasing, receiving, and payment

1. Purchasing Officer converts an approved replenishment recommendation into a supplier PO.
2. Accounting validates that the purchase is needed, checks existing stock/open POs/cash impact, and reviews financial terms.
3. GM approves; DCS gives final approval only when the configured control rule
   requires it.
4. Warehouse records Goods Receipt independently, including partial receipts, batch/lot, expiry, and discrepancies. Inventory updates only from a posted receipt.
5. Accounting records the vendor invoice and performs three-way matching: approved PO vs Goods Receipt vs Vendor Invoice.
6. A payment request is released only within tolerance. Exceptions require a reason, attachment, and named approval.
7. GM approves payment; President/DCS marks the disbursement as paid/on hold/returned and records funding source plus proof of payment.

### 5. Billing and collections

1. Fulfilled customer orders move to Billing Ready.
2. Accounting creates a billing document from approved quotation/order and actual fulfillment. Keep “Billing” distinct from the BIR sales invoice.
3. Finalized billing is immutable. Correction uses a controlled cancel/revision or credit memo; original records remain in the audit trail.
4. Collections records check/reference number, bank, date, amount, customer, and proof.
5. A single collection can be allocated across multiple open SOAs/billings. Partial allocation leaves the correct balance and aging.
6. Overpayments remain unapplied customer credits; underpayments keep the billing partially collected.

### 6. Accounting handoff

Only approved/postable events enter the manual QuickBooks export queue: sales
invoice, inventory/COGS entry, vendor bill, payment, collection, and approved
adjustment. Each record shows export status, an optional QuickBooks reference,
last attempt, and any actionable error. Direct QBO API posting is future scope.

## Roles and segregation of duties

| Role | Creates | Reviews/approves | Cannot do |
|---|---|---|---|
| Sales Agent | RFQ/request, customer demand | — | Change cost, approve own request, release stock |
| Marketing Manager | Quotation, ROI, account budget | Sales Agent inputs | Post accounting, approve final quote |
| Accounting | Cost/tax validation, billing, vendor invoice, collection allocation | Quotation ROI, supplier PO need, three-way match | Approve own disbursement, erase finalized records |
| Purchasing Officer | Supplier PO | Replenishment proposal | Receive goods, approve own PO |
| Warehouse | Goods receipt, pick/release, count | Physical quantities and batch data | Change prices/costs, create/approve PO |
| GM | — | Commercial, PO, payment approvals | Alter submitted source data |
| President/DCS | — | Final approval/disbursement | Modify audit history |
| BRIDGE Admin/Auditor | Configuration, controlled reversals | Exceptions and audit | Perform undocumented deletion |

## Status model

Use one visible status per record and a chronological history behind it.

- RFQ/Sales Quote: Draft → Submitted → Marketing Review → Quotation Draft → GM Approval → Awaiting Client Acceptance → Accepted/Returned/Rejected/Expired (no DCS Sales Quote stage)
- Procurement/RFP documents: Draft → Submitted → Review → GM Approval → DCS Approval when required by the configured control rule → Approved/Returned/Rejected/Expired
- Customer order: Awaiting Customer PO → Confirmed → Reserved → Partially Fulfilled → Fulfilled → Billing Ready → Closed
- Supplier PO: Draft → Accounting Validation → GM Approval → Conditional DCS Approval → Open → Partially Received → Fully Received/Closed/Cancelled
- Vendor invoice: Draft → Match Exception/Matched → Payment Approval → On Hold/Approved → Paid
- Billing: Draft → Finalized → Partially Collected/Fully Collected → Closed; revision and credit memo are linked documents, never overwrites
- Inventory count: Open → Frozen/Cutoff → Counted → Variance Review → Approved Adjustment → Posted

## Required screens

1. Role-based Work Queue: My drafts, needs my review, returned to me, overdue, blocked exceptions.
2. RFQ and Quotation Workspace: customer request, stock view, batch cost, price maintenance, ROI, attachments, approval timeline.
3. Demand & Replenishment Planner: critical levels, reservations, open POs, lead times, buffer, expiry class, proposed order quantity.
4. Purchase Order Workspace: need justification, open-PO check, approval history, receipts, invoice match.
5. Warehouse Mobile: scan receipt, transfer, pick, release, count; clear success/offline/error state.
6. Inventory Control: on hand, reserved, available, on order, batch/lot, expiry, aging, movement ledger, valuation.
7. Billing & Collections: billings, open SOAs, aging, multi-SOA allocation, unapplied credits.
8. Approval Center: one consistent layout across quote, PO, payment, and exception approvals; compare request vs policy/stock/cost/ROI.
9. Audit & QuickBooks Sync: immutable event history, attachments, overrides, reversals, sync results.

## Controls that prevent the errors seen in the prototype

- Persist every draft server-side; refresh must never erase work.
- Autosave with “Saved at…” and a visible retry state; protect against duplicate submit.
- Do not log users out on refresh; use an idle timeout with warning and draft preservation.
- Exactly two draft actions: Save draft and Submit. After submission, edit only through Return or controlled revision.
- No automatic disbursement. Paid requires authorized user, payment method/source, date, amount, and proof.
- No direct delete of approved/finalized records. Use cancel, close, reverse, or credit memo with reason.
- Use idempotency keys for submit/post actions so double-clicks cannot duplicate records.
- Validate required fields, positive quantities, allocation totals, approval sequence, tax treatment, available stock, batch/expiry, and three-way match.
- Distinguish service-charge/VAT items from pass-through/reimbursable items; tax rules are configuration, not free text.
- Separate internal Billing/SOA from BIR invoice issuance.
- Show why a record is blocked and the exact person/action needed to unblock it.
- Record every override with actor, original value/state, reason, timestamp, and attachment.

## Inventory valuation and planning decision

The meeting raised both weighted/moving-average costing and per-batch profitability. Implement both without conflict:

- Statutory/accounting inventory valuation: moving weighted average, synchronized to QuickBooks.
- Operational profitability and pricing: batch/lot landed cost retained for traceability and ROI comparison.
- Allocation: FEFO by default, with controlled override and reason.

This gives Accounting a consistent ledger value while management can still see whether a specific batch is profitable.

## MVP release order

1. Foundation: users/roles, master data, audit log, attachments, approval matrix, stable persistence.
2. Sales-to-order: RFQ, quotation, ROI, cost/price review, approvals, customer PO/contract.
3. Inventory: opening balance from the approved Jul 31 count, batch/expiry, reservations, movements, mobile scan, monthly count.
4. Procure-to-pay: replenishment planner, supplier PO, open-PO control, receiving, three-way match, payment approval.
5. Order-to-cash: fulfillment, billing/SOA, multi-document collection allocation, aging.
6. QuickBooks integration and management reporting.

Do not build dashboards first. The dashboard becomes trustworthy only after the transaction workflow, validations, and audit trail are stable.

## MVP acceptance tests

- A saved draft survives refresh, logout, and device change.
- A double-click on Submit creates one request only.
- A Class 3 item cannot generate a supplier PO without a linked customer PO.
- A new supplier PO warns/blocks when an applicable open PO exists.
- Receiving a partial quantity updates inventory and leaves the PO open for the balance.
- Vendor invoice outside tolerance cannot proceed without an exception approval.
- Warehouse cannot release more than available/reserved stock without an override.
- Finalized billing cannot be edited or deleted; a correction creates a linked revision/credit memo.
- One payment can allocate to several SOAs and leaves accurate balances and aging.
- “Mark paid” cannot complete without proof, funding source, and authorization.
- Every approval, return, hold, override, cancellation, count variance, and sync attempt appears in the audit history.

## Open decisions for the next client validation meeting

1. Final definition and controls for Classes 1, 2, and 3.
2. Critical-level formula per item: lead time, monthly usage window, and approved buffer.
3. Approval thresholds and whether Accounting is reviewer or approver at each stage.
4. Three-way match tolerances for quantity, price, freight, duties, and foreign exchange.
5. Exact BIR invoice trigger and QuickBooks posting map.
6. Barcode vs QR standard and label ownership.
7. Whether the Jul 31 physical count is the final ERP opening balance after reconciliation.
