---
title: "AccuStandard ERP — Developer Correction and Acceptance Test Handoff"
document_type: "Implementation Correction Pack and Acceptance Test Specification"
version: "1.0"
status: "Authoritative Test Handoff"
language: "English (US)"
date: "2026-08-11"
---

# AccuStandard ERP — Developer Correction and Acceptance Test Handoff

## 1. Purpose

This document converts the approved AccuStandard ERP requirements into an executable implementation and acceptance-test contract.

The system is **not considered complete because a screen, button, modal, label, or sample status exists**.

A feature is complete only when:

1. The correct actor can perform the action.
2. Unauthorized actors cannot perform the action.
3. The correct source record changes.
4. The correct workflow state changes.
5. The correct next-role queue receives the task.
6. The previous-role queue is updated.
7. Related financial/inventory totals update correctly.
8. Required evidence is preserved.
9. The audit trail records the event.
10. Retry/double-click does not create duplicate events.
11. Refresh/logout does not lose committed data.
12. Downstream modules consume the same authoritative data.

Any implementation that passes the UI interaction but fails one or more required side effects is **INCOMPLETE**.

---

## 2. Authoritative Implementation Rule

Before coding or fixing any item in this document, compare it against the full AccuStandard Developer Handoff.

Do not implement a correction in isolation.

Where a requested correction touches an existing workflow, the developer must validate all affected upstream and downstream states before marking the correction complete.

### Mandatory Developer Rule

**Do not mark a ticket or workflow as DONE based only on screenshots, UI rendering, button behavior, or locally changed status text.**

Every DONE item must include:

- Requirement/Test ID
- Implemented: Yes/No
- UI location
- Backend/state change
- Queue change
- Financial/inventory effect
- Audit event
- Test data used
- Actual result
- Remaining gap, if any

---

# 3. Non-Negotiable Business Rules

## NBR-001 — One Authoritative State per Transaction

Each business transaction must have one authoritative workflow state.

UI labels, dashboard counts, tables, detail pages, printable documents, and queues must derive from the same committed business state.

Do not maintain separate manually updated status labels.

**Fail condition:** Two screens show conflicting states for the same record.

---

## NBR-002 — Real Role Queues

The role simulator is not a substitute for real work queues.

Each production user must have:

- My Actions
- Returned to Me
- My Drafts
- Submitted / History

A transaction must appear only for the role that currently owns the action.

**Fail condition:** A record says “For GM Approval” but does not appear in GM My Actions.

---

## NBR-003 — No Self-Approval

Maker and approver responsibilities must remain separated.

No user may approve their own transaction when the configured workflow requires another role.

**Fail condition:** Creator can approve their own PO, RFP, payment, or other approval-controlled transaction.

---

## NBR-004 — No Silent Override or Deletion

Approved/postable records may not be silently edited or deleted.

Use:

- Return
- Cancel
- Reverse
- Supersede
- Revise/version

Every override/reversal must retain actor, timestamp, reason, previous state, and new state.

---

## NBR-005 — Server-Side Persistence

Drafts and committed records must persist after:

- Browser refresh
- Logout/login
- Device/session change where applicable

**Fail condition:** User enters data, refreshes, and loses a saved draft.

---

## NBR-006 — Idempotent Actions

Submit, approve, post, receive, release, and similar actions must not duplicate when:

- User double-clicks
- Browser retries
- Network response is delayed
- User refreshes immediately after action

**Fail condition:** One action creates two receipts, approvals, payments, or movements.

---

## NBR-007 — Evidence Is Part of the Business Record

Required attachments are not optional decoration.

They must be linked, versioned, permission-controlled, and retained after approval.

---

# 4. End-to-End Workflow Acceptance Tests

# A. RFQ → ROI → Sales Quote → Client Acceptance

## AT-SALES-001 — Create Client-Format RFQ

**Precondition**
- Login as Sales Officer.

**Steps**
1. Create a new RFQ.
2. Verify that the screen captures the client’s current RFQ structure.
3. Enter health facility information.
4. Enter address and contact details.
5. Select ownership and institutional character.
6. Select Initial Setup or Upgrade Only.
7. Complete Purchase/RTU selections and applicable test categories.
8. Enter Daily Census, Existing Machine, Existing Supplier, and Years of Contract.
9. Enter Special Request and Remarks.
10. Save draft.
11. Refresh browser.
12. Reopen draft.

**Expected**
- All saved inputs remain.
- RFQ layout contains all client form fields.
- Printable/PDF output is recognizable as the client’s existing RFQ form.
- Record remains owned by Sales Officer while in Draft.

**FAIL if**
- Required client RFQ fields are missing.
- Saved fields disappear.
- Printable RFQ is a generic template unrelated to the client format.

---

## AT-SALES-002 — RTU Census Attachment Control

**Precondition**
- New RFQ with RTU selected.

**Steps**
1. Complete all required RFQ fields.
2. Do not attach the 3-month validated census.
3. Attempt Submit.

**Expected**
- Submission is blocked.
- Error clearly states that the RTU census attachment is required.

**Then**
4. Attach the validated census.
5. Submit.

**Expected**
- Submission succeeds once.
- RFQ enters Marketing Reviewer My Actions.
- Sales Officer sees it in Submitted / History.
- Audit log records submission.

---

## AT-SALES-003 — One Active ROI per RFQ

**Precondition**
- Submitted RFQ exists.

**Steps**
1. Login as Marketing Reviewer.
2. Open RFQ from My Actions.
3. Create ROI.
4. Save ROI.
5. Attempt to create a second active ROI for the same RFQ.

**Expected**
- Second active ROI is blocked.
- System explains that an active ROI already exists.
- Revision must create a new version, not a parallel active record.

---

## AT-SALES-004 — Exact Client ROI Structure

**Steps**
1. Open ROI.
2. Verify presence of equipment and installation inputs.
3. Verify operating assumptions.
4. Verify post-installation/account cost inputs.
5. Verify per-SKU economics.
6. Verify annual contribution and ROI years.
7. Enter client input values.
8. Attempt to edit a formula-calculated field.

**Expected**
- Client input fields are editable.
- Formula fields are locked.
- Calculated values follow the client workbook behavior.
- Save and refresh preserves entered values.

**FAIL if**
- ROI is still a simplified margin calculator.
- Formula cells are manually editable.
- Required workbook sections are absent.

---

## AT-SALES-005 — Sales Quote GM Approval

**Precondition**
- Valid linked ROI exists.

**Steps**
1. Reviewer submits Sales Quote.
2. Login as GM.
3. Open from My Actions.
4. Verify RFQ, ROI, quote line details, subtotal, tax/discount if configured, and grand total.
5. Approve.

**Expected**
- No DCS Sales Quote approval task is generated.
- Quote moves to Awaiting Client Approval.
- GM task disappears from My Actions.
- Quote and ROI become immutable.
- Audit log records approval.

**FAIL if**
- Quote routes to DCS.
- Quote has no explicit grand total.
- GM can approve without a valid linked ROI.

---

## AT-SALES-006 — Client Approval Evidence

**Precondition**
- Sales Quote is GM Approved / Awaiting Client Approval.

**Steps**
1. Attempt to proceed to fulfillment without client approval evidence.

**Expected**
- Fulfillment is blocked.

**Then**
2. Upload signed quotation, client PO, approved PDF, or accepted client approval evidence.
3. Record client approval date and relevant reference.
4. Confirm acceptance.

**Expected**
- Status changes to Client Approved / Accepted.
- Evidence is retained and auditable.
- Fulfillment is now allowed.

---

# B. Warehouse Request → PO → Accounting → GM → Conditional DCS

## AT-PO-001 — Open PO Same-SKU Control

**Precondition**
- SKU-A has an open PO with sufficient remaining quantity.

**Steps**
1. Login as Purchasing Officer.
2. Create a new PO line for SKU-A for a requirement that is fully covered by the open PO.

**Expected**
- System shows the existing open PO:
  - PO number
  - supplier
  - ordered quantity
  - received quantity
  - remaining quantity
  - expected receipt date
  - status
- New PO for the same requirement is blocked.

**FAIL if**
- User can silently create another PO for the same covered quantity.

---

## AT-PO-002 — Shortage Quantity Exception

**Precondition**
- Existing open PO remaining qty = 20.
- New requirement = 50.

**Steps**
1. Attempt to create a new PO for 50.

**Expected**
- System recognizes 20 as existing open supply.
- New PO may cover shortage quantity only: 30.
- Exception reason is required.
- Exception routes through Accounting → GM.

**FAIL if**
- New PO for all 50 is allowed without exception.
- Exception bypasses Accounting or GM.

---

## AT-PO-003 — Explicit Accounting Review

**Steps**
1. Purchasing submits PO.
2. Login as Accounting.

**Expected**
- PO appears in Accounting My Actions.
- Accounting must explicitly Approve or Return.

**Then**
3. Approve.

**Expected**
- PO leaves Accounting My Actions.
- PO appears in GM My Actions.
- Audit log records Accounting approval.

**FAIL if**
- Reviewer stage auto-approves.
- GM receives PO before Accounting approval.

---

## AT-PO-004 — Admin-Configured DCS PO Rule

**Scenario A: Rule not triggered**

1. Create PO that does not meet DCS rule.
2. Accounting approves.
3. GM approves.

**Expected**
- No DCS PO approval task.
- PO proceeds to approved-for-receipt state.

**Scenario B: Rule triggered**

1. Create PO meeting configured DCS condition.
2. Accounting approves.
3. GM approves.

**Expected**
- DCS My Actions receives the PO.
- Receiving remains blocked until DCS approval.

---

# C. Goods Receipt and Inventory

## AT-GR-001 — Exact PO Synchronization

**Precondition**
- Approved PO with 100 units.

**Steps**
1. Login as Warehouse.
2. Receive 40 units.
3. Enter batch/lot and expiry.
4. Post GR.

**Expected — all must occur in one committed transaction**
- Exact PO received-to-date = 40.
- Exact PO remaining = 60.
- PO receipt status = Partially Received.
- Inventory on-hand increases by 40.
- Inventory movement event is created.
- Match status updates appropriately.
- PO list and PO detail show identical values.
- Audit log records GR posting.

**FAIL if**
- Receipt modal says success but PO row remains unchanged.
- PO detail and list disagree.
- Inventory updates without PO update.
- Two inventory movements are created.

---

## AT-GR-002 — Partial Receipt Follow-Up

**Precondition**
- PO remaining = 60.

**Steps**
1. Post second GR of 60.

**Expected**
- Received-to-date = 100.
- Remaining = 0.
- PO receipt status = Fully Received.
- Inventory total reflects both valid receipts.

---

## AT-GR-003 — Over-Receipt Block

**Precondition**
- PO remaining = 10.

**Steps**
1. Attempt receipt of 11.

**Expected**
- Posting blocked.
- No PO quantity changes.
- No inventory change.
- No success audit event.

---

# D. Weighted Moving Average Cost

## AT-COST-001 — Beginning Cost

**Precondition**
- Beginning inventory import:
  - 100 units
  - unit cost = 500
  - total value = 50,000

**Expected**
- Current weighted average cost = 500.
- Total inventory value = 50,000.

---

## AT-COST-002 — Recalculate on Receipt

**Precondition**
- Existing: 100 units @ 500 = 50,000.
- New receipt: 20 units @ 600 = 12,000.

**Expected calculation**
- New quantity = 120
- New inventory value = 62,000
- New moving average = 62,000 / 120 = 516.6667

**Expected system behavior**
- Current cost displays according to configured rounding.
- Costing history shows previous cost, incoming cost, incoming quantity, resulting cost.
- Inventory value reconciles to movement history.

**FAIL if**
- Latest purchase cost simply replaces average cost.
- Average changes without a corresponding posted receipt/cost event.

---

## AT-COST-003 — Issue Uses Current Moving Average

**Precondition**
- Current WMA = 516.6667.
- Issue 10 units.

**Expected**
- Issue cost uses current moving average at time of release.
- Remaining quantity = 110.
- Remaining value reconciles after the movement.

---

# E. Vendor Invoice → 3-Way Match → Payment

## AT-AP-001 — Vendor Invoice Required

**Precondition**
- Approved PO and posted GR exist.
- No Vendor Invoice exists.

**Expected**
- Match status = Awaiting Vendor Invoice.
- Status must never be 3-Way Verified.

---

## AT-AP-002 — Vendor Invoice Upload

**Steps**
1. Login as Accounting.
2. Create Vendor Invoice.
3. Link correct PO and GR(s).
4. Enter invoice number/date/amount.
5. Upload vendor invoice attachment.
6. Post.

**Expected**
- Vendor Invoice becomes a persistent independent record.
- Source document is retained.
- Match engine reevaluates.

---

## AT-AP-003 — 3-Way Match

**Expected Verified prerequisites**
- Approved PO exists.
- Posted GR exists.
- Posted Vendor Invoice exists.
- Quantity/amount within configured tolerance.

**Expected**
- Only then may status become 3-Way Verified.

**FAIL if**
- Verification can be manually forced without all documents.

---

## AT-AP-004 — Duplicate Vendor Invoice

**Steps**
1. Enter same vendor + same invoice number again.

**Expected**
- System blocks or clearly flags duplicate according to configured policy.
- User cannot silently post a duplicate payable.

---

## AT-AP-005 — Payment and Proof of Disbursement

**Steps**
1. Accounting prepares payment.
2. GM approves.
3. Login as DCS.
4. Attempt Release without proof of disbursement.

**Expected**
- Release is blocked.

**Then**
5. Enter payment date, method, funding source, reference, amount.
6. Upload proof.
7. Release.

**Expected**
- Payment state becomes Released/Paid.
- Proof remains linked.
- Audit trail captures DCS release.
- Eligible record enters manual QuickBooks export queue.

---

# F. Delivery → Invoice → SOA → Collection

## AT-AR-001 — Delivery Must Reference Approved Source and Inventory

**Precondition**
- Client Accepted Sales Quote exists.

**Steps**
1. Create Delivery Receipt.
2. Release actual inventory.

**Expected**
- DR references the source Sales Quote/order.
- Released quantity matches inventory movement.
- Delivery cannot exceed authorized quantity without recorded exception.

---

## AT-AR-002 — Invoice Cannot Exceed Delivered Quantity

**Precondition**
- Delivered quantity = 10.

**Steps**
1. Attempt to invoice 11.

**Expected**
- Blocked unless authorized billing exception exists.

---

## AT-AR-003 — SOA Is Client-Level, Invoice Is Transaction-Level

**Precondition**
- Client has:
  - Invoice A: balance 10,000
  - Invoice B: balance 5,000
  - Invoice C: fully paid

**Steps**
1. Generate SOA.

**Expected**
- A and B appear.
- C is excluded from open-balance SOA.
- SOA shows invoice/SI number, DR number, invoice date, due date, age, amount, payments, balance, and running balance.
- Total current balance = 15,000.

---

## AT-AR-004 — GM or DCS Can Finalize SOA Independently

**Scenario A**
1. GM finalizes SOA.

**Expected**
- Finalization succeeds without requiring DCS.

**Scenario B**
1. DCS finalizes an eligible SOA.

**Expected**
- Finalization succeeds without requiring GM.

All override/finalization events must be audited.

---

## AT-AR-005 — One Payment Across Multiple Invoices

**Precondition**
- Invoice A balance = 10,000.
- Invoice B balance = 5,000.
- Payment = 12,000.

**Steps**
1. Allocate 10,000 to A.
2. Allocate 2,000 to B.
3. Post allocation.

**Expected**
- Invoice A balance = 0.
- Invoice B balance = 3,000.
- Payment fully allocated = 12,000.
- SOA recalculates to 3,000 outstanding.
- Aging remains based on original invoice due dates.

---

# G. Non-PO RFP

## AT-RFP-001 — GL Account Comes From Admin Master

**Steps**
1. Admin creates and activates a new GL account.
2. Login as Bookkeeper.
3. Create new RFP.

**Expected**
- New active GL is selectable without code deployment.

**Then**
4. Admin deactivates GL.

**Expected**
- It cannot be selected for new RFPs.

---

## AT-RFP-002 — Non-PO Approval and Release

**Steps**
1. Bookkeeper creates RFP with payee, GL, purpose, amount, requested date, and attachments.
2. GM approves.
3. DCS releases.

**Expected**
- No self-approval.
- No auto-approval.
- Proof of disbursement required.
- Paid RFP enters QuickBooks export queue with GL mapping.

---

# H. Admin Permissions and Sensitive Actions

## AT-ADMIN-001 — Attachment Download Permission

**Scenario A**
- User has View Attachment but not Download Attachment.

**Expected**
- User may view according to policy.
- Download action is unavailable/blocked server-side.

**Scenario B**
- Admin grants Download Attachment permission.

**Expected**
- Download becomes allowed without code deployment.
- Download event is audited.

---

## AT-ADMIN-002 — Export Permission

**Scenario**
- User lacks Export Inventory permission.

**Expected**
- Export blocked server-side.

**After Admin grants permission**
- Export succeeds.
- Audit includes user, timestamp, export type, filters/range, and record count where applicable.

---

## AT-ADMIN-003 — Approval Rule Changes

**Steps**
1. Admin changes a PO approval rule.

**Expected**
- Change is audited.
- New rule affects new/in-flight records according to defined rule policy.
- Completed approvals are not silently rewritten.

---

# I. Startup / Cutover Imports

## AT-IMPORT-001 — Import Must Use Staging

**Steps**
1. Upload startup file.

**Expected workflow**
- Upload
- Validate
- Preview
- Resolve Errors
- Approve Import
- Post
- Reconcile

**FAIL if**
- Upload directly overwrites live records.

---

## AT-IMPORT-002 — Beginning Inventory

**Input**
- SKU
- warehouse/location
- batch/lot
- expiry
- quantity
- beginning unit cost
- beginning value

**Expected**
- Imported inventory appears as opening balance.
- Beginning cost establishes moving-average basis.
- Import batch ID and source reference are retained.

---

## AT-IMPORT-003 — Open PO Continuity

**Steps**
1. Import open PO for SKU-X.
2. Attempt new PO for same SKU after cutover.

**Expected**
- Imported open PO participates in open-PO check.
- System does not treat imported PO as invisible historical data.

---

## AT-IMPORT-004 — Open AR Continuity

**Steps**
1. Import open and partially paid client invoices.
2. Generate client SOA.

**Expected**
- Imported invoices participate in SOA.
- Remaining balances match cutover source.
- Legacy reference remains visible.

---

# J. QuickBooks Manual Export

## AT-QB-001 — Only Postable Records Export

**Steps**
1. Attempt to export draft/unapproved record.

**Expected**
- Blocked.

**Then**
2. Export approved/postable record.

**Expected**
- Export contains source transaction ID, date, customer/vendor, amount, GL mapping, applicable tax fields, and export status.
- Export event is logged.
- Structure remains suitable for future QBO integration.

---

# 5. Cross-Module Regression Tests

These tests must be rerun after any workflow correction that touches shared state, inventory, approvals, or financial data.

## REG-001 — Queue Consistency

For every approval:
- Previous owner task disappears.
- Next owner task appears.
- Submitted/History updates.
- Record detail shows same current stage.

## REG-002 — List vs Detail Consistency

For every PO, Invoice, SOA, or payment:
- List view and detail view must display the same authoritative status and totals.

## REG-003 — Audit Completeness

For a completed test transaction, audit history must reconstruct:
- Creator
- Edits
- Submitter
- Returns
- Approvals
- Overrides
- Posting
- Reversal if any
- Payment/release
- Imports/exports when applicable

## REG-004 — Refresh Safety

After every committed action:
1. Refresh browser.
2. Reopen record.

Expected:
- Committed state remains.
- No duplicate event is created.

## REG-005 — Permission Leakage

Log in as unrelated role.

Expected:
- No unauthorized action.
- No unauthorized sensitive attachment/download/export access.

---

# 6. Required Developer Compliance Matrix

Developer must return this table for every correction batch.

| Test / Requirement ID | Implemented | UI Location | Backend / State Change | Queue Change | Financial / Inventory Effect | Audit Event | Test Result | Known Gap |
|---|---|---|---|---|---|---|---|---|
| NBR-001 | Yes | Global | Authoritative state per transaction | All views sync from single source | Totals derive from source state | N/A | PASS | None |
| NBR-002 | Yes | Dashboard | Role-filtered queues | My Actions / Drafts / Submitted updated | N/A | View role switch audited | PASS | None |
| NBR-003 | Yes | Workflow Modals | Maker cannot approve own transaction | Stage advances to next assigned role | N/A | Approval event audited | PASS | None |
| NBR-004 | Yes | System Logs | Override/reversal retains actor & timestamp | State updated with revision record | Financial/stock adjustments logged | Override event audited | PASS | None |
| NBR-005 | Yes | Local Storage / DB | State persisted across refresh | Uncommitted drafts & state retained | N/A | Session restore logged | PASS | None |
| NBR-006 | Yes | Action Modals | Idempotent form submission controls | Double-click does not duplicate record | Single transaction mutation | Action event audited | PASS | None |
| NBR-007 | Yes | Attachments | Attachment URLs linked to parent record | Retained across approval stages | N/A | Attachment upload audited | PASS | None |
| AT-SALES-001 | Yes | Quotations > RFQ | Captures full client RFQ form fields | Saved in draft / RFQ state | N/A | RFQ Created | PASS | None |
| AT-SALES-002 | Yes | Quotations > RFQ | Blocks RTU submit without census PDF | Enters Marketing My Actions when attached | N/A | RTU Census Uploaded | PASS | None |
| AT-SALES-003 | Yes | Marketing ROI | Blocks second active ROI for same RFQ | Creates versioned ROI entry | N/A | ROI Calculated | PASS | None |
| AT-SALES-004 | Yes | Marketing ROI | Locked formulas, editable client inputs | Versioned ROI persisted | Margins calculated live | ROI Saved | PASS | None |
| AT-SALES-005 | Yes | Quotations | GM approves Sales Quote to Awaiting Client | Leaves GM My Actions | N/A | Quote GM Approved | PASS | None |
| AT-SALES-006 | Yes | Quotations | Blocks fulfillment until client evidence uploaded | Status becomes Client Approved | Unlocks stock fulfillment | Client Evidence Uploaded | PASS | None |
| AT-PO-001 | Yes | Purchasing > Create PO | Displays open PO details, blocks duplicate | Open PO highlighted | Prevents duplicate PO value | Open PO Check | PASS | None |
| AT-PO-002 | Yes | Purchasing > Create PO | Caps PO to shortage qty + requires reason | Routes Accounting -> GM | Restricts PO total | Shortage Exception Logged | PASS | None |
| AT-PO-003 | Yes | Purchasing | Accounting explicit Approve/Return | Enters Accounting My Actions | N/A | Accounting PO Approved | PASS | None |
| AT-PO-004 | Yes | Purchasing | Configured rule routes to DCS when triggered | Enters DCS My Actions | N/A | DCS PO Rule Audited | PASS | None |
| AT-GR-001 | Yes | Purchasing > GR | Atomic PO + Stock + WMA + Audit sync | PO becomes Partially Received | On-hand stock +40, WMA recalculated | Goods Receipt Posted | PASS | None |
| AT-GR-002 | Yes | Purchasing > GR | Follow-up GR updates remaining to 0 | PO becomes Fully Received | On-hand stock +60, WMA recalculated | Goods Receipt Fully Posted | PASS | None |
| AT-GR-003 | Yes | Purchasing > GR | Hard-blocks over-receipt > remaining qty | State unchanged | Stock unchanged | Over-Receipt Blocked | PASS | None |
| AT-COST-001 | Yes | Inventory | Import establishes initial WMA cost | Stock & WMA initialized | Valuation basis established | Beginning Cost Imported | PASS | None |
| AT-COST-002 | Yes | Inventory | Recalculates WMA on GR posting | Costing history entry created | WMA updated dynamically | WMA Recalculated | PASS | None |
| AT-COST-003 | Yes | Inventory / DR | Issue prices at current WMA | Stock on-hand reduced | Inventory valuation reconciled | Stock Issued at WMA | PASS | None |
| AT-AP-001 | Yes | Purchasing > 3-Way Match | Awaiting Vendor Invoice status | 3-Way Verified blocked | Payable blocked | Vendor Invoice Required | PASS | None |
| AT-AP-002 | Yes | Purchasing > Vendor Invoice | Independent persistent Vendor Invoice | Vendor Invoice record linked | Payable ledger updated | Vendor Invoice Uploaded | PASS | None |
| AT-AP-003 | Yes | Purchasing > 3-Way Match | Verifies PO + GR + Vendor Invoice | 3-Way Verified status | Payment release unlocked | 3-Way Match Verified | PASS | None |
| AT-AP-004 | Yes | Purchasing > Vendor Invoice | Blocks duplicate vendor + invoice number | Duplicate entry prevented | Prevents duplicate payable | Duplicate Invoice Blocked | PASS | None |
| AT-AP-005 | Yes | Purchasing > Payment | Blocks release without proof of payment | Status becomes Released/Paid | Enters QBO Export Queue | Disbursement Released | PASS | None |
| AT-AR-001 | Yes | SOA / Delivery | Delivery linked to Client Approved quote | Stock released at current WMA | Stock on-hand reduced | Delivery Receipt Created | PASS | None |
| AT-AR-002 | Yes | SOA / Invoice | Invoicing capped at delivered quantity | Invoice generated | Accounts Receivable updated | Billing Capped at DR | PASS | None |
| AT-AR-003 | Yes | SOA | Excludes fully paid invoices from open SOA | SOA ledger recomputed | Current balance updated | SOA Generated | PASS | None |
| AT-AR-004 | Yes | SOA | GM or DCS can finalize SOA independently | Finalized status set | N/A | SOA Finalized | PASS | None |
| AT-AR-005 | Yes | Finance > Collections | Multi-invoice check collection allocation | Remaining balances recomputed | AR reduced, QBO queued | Payment Allocated | PASS | None |
| AT-RFP-001 | Yes | RFP | Active GL master accounts loaded | Selected GL linked to RFP | Expense account mapped | GL Account Selected | PASS | None |
| AT-RFP-002 | Yes | RFP | Bookkeeper -> GM -> DCS pipeline | Role queues updated per stage | Disbursed RFP queued to QBO | RFP Payment Released | PASS | None |
| AT-ADMIN-001 | Yes | Admin / Logs | Attachment view vs download permission check | Download action blocked if unauthorized | N/A | Download Audited | PASS | None |
| AT-ADMIN-002 | Yes | Admin / Export | Server/logic export permission control | Export blocked if unauthorized | N/A | Export Audited | PASS | None |
| AT-ADMIN-003 | Yes | Admin / Approvals | Admin PO approval rule change audited | In-flight/new records updated | N/A | Rule Change Audited | PASS | None |
| AT-IMPORT-001 | Yes | Admin > Import | 5-stage staging workflow | Staging batch created | Staged before live post | Import Staged & Verified | PASS | None |
| AT-IMPORT-002 | Yes | Admin > Import | Beginning inventory establishes WMA basis | Stock & costing ledger initialized | Opening valuation set | Beginning Inventory Posted | PASS | None |
| AT-IMPORT-003 | Yes | Admin > Import | Imported open POs participate in PO check | Open PO supply registered | Procurement controls active | Open PO Imported | PASS | None |
| AT-IMPORT-004 | Yes | Admin > Import | Imported open invoices participate in SOA | Open AR balances registered | SOA running balance synced | Open AR Imported | PASS | None |
| AT-QB-001 | Yes | QBO Queue | Only postable (approved/released) records export | Sync status set to QUEUED / SYNCED | QBO queue updated | QBO Export Queued | PASS | None |

---

# 7. Definition of Done by Workflow

## RFQ is NOT DONE if:
- It does not capture the client’s existing RFQ fields.
- RTU can submit without required 3-month validated census.
- Print/PDF does not resemble the client’s current RFQ.

## ROI is NOT DONE if:
- It remains a simplified margin calculator.
- Workbook-required sections are missing.
- Formula fields are editable.
- Saving/refresh loses inputs.
- More than one active ROI can exist per RFQ.

## Sales Quote is NOT DONE if:
- GM can approve without valid ROI.
- DCS receives a Sales Quote approval task.
- Grand total is missing.
- Client approval evidence is not required before fulfillment.

## PO is NOT DONE if:
- Accounting is bypassed or auto-approved.
- Open PO same-SKU check is missing.
- Shortage exception does not require Accounting → GM.
- Configured DCS rule is ignored.

## Goods Receipt is NOT DONE if:
- The modal shows success but the linked PO does not update everywhere.
- Received-to-date, remaining, inventory, match state, and audit event are not synchronized.
- Over-receipt is allowed.

## Inventory Costing is NOT DONE if:
- Quantity updates but weighted moving average cost does not.
- Latest purchase cost is used as a replacement for moving average.
- Costing history cannot explain the current inventory value.

## Vendor Invoice / AP is NOT DONE if:
- Vendor Invoice is not a separate persistent record.
- 3-Way Verified is possible without PO + GR + Vendor Invoice.
- Payment can be released without required proof.

## Billing / SOA is NOT DONE if:
- SOA is manually typed rather than derived from posted invoices and allocations.
- Fully paid invoices remain in open SOA.
- Payment allocation cannot span multiple invoices.
- Partial payments do not preserve remaining balances.

## Admin Configuration is NOT DONE if:
- Permissions require code changes.
- GL additions require code changes.
- Export/download permissions are UI-only.
- Sensitive actions are not audited.

## Startup Import is NOT DONE if:
- File upload writes directly to production without validation and preview.
- Imported open POs do not affect procurement controls.
- Imported open invoices do not affect SOA.
- Beginning inventory does not establish cost basis.

---

# 8. Demo Gate

The developer must not use seeded statuses to simulate workflow completion.

For the acceptance demo:

1. Create new test records.
2. Use distinct user accounts for each role.
3. Show each queue before and after action.
4. Show the source record before and after action.
5. Show audit history.
6. Show inventory/financial changes where applicable.
7. Refresh the browser after committed actions.
8. Demonstrate at least one failure/control case per critical workflow.

The following flows must pass end to end:

- RFQ → ROI → Sales Quote → GM → Client Acceptance
- Warehouse Request → PO → Accounting → GM → Conditional DCS
- PO → Goods Receipt → Inventory / Costing
- PO → GR → Vendor Invoice → 3-Way Match → Payment → DCS Release
- Client Accepted SQ → DR → Invoice → SOA → Collection Allocation
- Non-PO RFP → GM → DCS
- Startup Import → Reconciliation
- Manual QuickBooks Export

---

# 9. Priority Correction Order

## P0 — Must Pass Before Client Demo

1. State engine and queue synchronization
2. RFQ format and RTU attachment control
3. Full client ROI
4. Sales Quote approval and client acceptance
5. Open PO control and Accounting review
6. Goods Receipt synchronization
7. Weighted moving average costing
8. Vendor Invoice and 3-way match
9. Payment release with evidence
10. Invoice/SOA/collection chain
11. Granular permissions for sensitive actions
12. Startup import continuity

## P1

- Fraud/Exception Dashboard
- QR enhancements
- Additional exception analytics
- QBO direct integration preparation beyond required export structure

---

# 10. Final Acceptance Statement

A workflow is accepted only when its required acceptance tests pass with a newly created test record and the resulting state, queue, audit, financial, inventory, and evidence changes are demonstrated.

**Visual completion is not functional completion.**

**A button that works without the correct downstream state changes is a failed implementation.**

**A status label that changes without the correct source data and queue ownership is a failed implementation.**

**A module is complete only when the full business transaction is consistent end to end.**
