# Accustandard Web App — Functional Specification (Developer Handover)

> **Document type:** Spec-driven development (SDD) source-of-truth document.
> **Audience:** Software/web developer and AI coding agents.
> **Status:** Draft v4 — added named RFQ flow (Client → Sales RFQ → Marketing → GM → DCS).
> **Convention:** Requirements use RFC-style keywords — MUST (mandatory), SHOULD (strongly recommended), MAY (optional).

---

## 1. Business Context

- **Client:** Accustandard — a medical supplies and equipment provider (Philippines).
- **Business model:** Retail/distribution — the company carries **physical inventory** (unlike a pure service/logistics business).
- **Key history driving design:** The company previously experienced:
  - **Inventory fraud**
  - **Sales fraud** (driven by a sales incentives scheme)
  - **Purchasing fraud**
- **Design consequence:** The app MUST be **control-first**. Every transaction that moves money or stock requires layered, non-bypassable approvals, full audit trails, and segregation of duties (maker ≠ checker ≠ approver), consistent with COSO internal-control principles.

---

## 2. Core Design Principles (Non-Negotiable)

- **Segregation of duties:** No single user can create, approve, and post the same transaction.
- **Maker–checker–approver workflow** on all critical documents (sales, purchases, inventory adjustments, price changes).
- **Immutable audit log:** Every create/edit/approve/reject/void action MUST record user, timestamp, before/after values, and device/location where practical.
- **No silent edits after approval:** Approved documents are locked; changes require a formal revision that restarts the approval chain.
- **Role-based access control (RBAC):** Permissions assigned by role, not by individual; configurable in-app.
- **Configurability:** Approval tiers, thresholds, and approvers MUST be maintainable in-app by an admin (add/edit tiers, assign approvers) — not hard-coded.

---

## 3. Approval Matrix

Standard 4-layer approval chain (same concept as the Pimascor app, but applied to an inventory-carrying company):

| Level | Role | Function |
|---|---|---|
| 1 | **Maker** | Creates/encodes the transaction |
| 2 | **Reviewer** | Checks completeness, accuracy, supporting documents |
| 3 | **GM** (General Manager) | Business approval |
| 4 | **DCS (Chairman)** | Final approval |

- The chain MUST apply (with configurable thresholds) to:
  - Sales quotations / sales orders (especially price overrides and special deals)
  - Purchase orders
  - Inventory adjustments, transfers, and write-offs
  - Price list changes / pricing maintenance
- **Launch decision:** At go-live, ALL documents route through the full chain up to **DCS (Chairman)** regardless of amount — this builds the Chairman's comfort with the process.
- The approval engine MUST still be built with **threshold-based routing** capability (configurable peso thresholds per document type), so tiered routing (e.g., small transactions stop at GM) can be switched on later without code changes.
- Approvers MUST NOT be able to approve their own transactions.
- Each approval step MUST capture approver identity, timestamp, and optional remarks; rejections MUST require a reason.

---

## 4. Functional Modules

### 4.1 Inventory (Multi-Location)

- **Multi-location / multi-warehouse:** Stock tracked per location; per-location on-hand, reserved, and available quantities.
  - **Go-live locations (2):** Quezon City and Pampanga. Architecture MUST support adding locations without code changes.
- **Inter-location transfers:** Transfer-out and transfer-in with approval + receiving confirmation (stock is "in transit" until received).
- **Batch/lot and expiry tracking:** Required for medical supplies (FEFO — first expiry, first out — SHOULD be the default picking logic).
- **Serial-number tracking:** Required for **equipment** items (per-unit serial capture at receiving and dispatch). Item master MUST flag each item as: batch/expiry-tracked, serial-tracked, or untracked.
- **Inventory adjustments:** Only via approved adjustment documents (maker → reviewer → GM → DCS depending on threshold); never direct quantity edits.
- **Cycle count / physical count support:** Count sheets, variance report, approved adjustment posting.

### 4.2 Barcode System (Mobile)

- Barcode scanning MUST work using an ordinary **cellphone camera** (web-based scanner or PWA) — no dedicated hardware required.
- Scanning use cases:
  - **Receiving (stock-in):** Scan items against PO, quantity match, generate Receiving Report (RR).
  - **Picking/dispatch (stock-out):** Scan against approved Sales Order / Delivery Receipt (DR).
  - **Counting:** Scan during physical/cycle counts.
- Each item MUST support barcode(s) (supplier barcode and/or internal SKU barcode); the system SHOULD be able to generate printable internal barcodes.

### 4.3 Sales — Quotation Routing with Inventory Reservation

**Named flow (client-specified):** `Client → Sales RFQ → Marketing → GM → DCS`

- **Client** submits a Request for Quotation (RFQ) — inquiry for pricing on specific items/quantities.
- **Sales** (Maker) encodes the RFQ into a formal Sales Quotation in the system.
- **Marketing** acts as the **Reviewer** role in this chain — checks the quotation (pricing, terms, completeness) before it proceeds.
- **GM** and **DCS (Chairman)** approve per the standard approval matrix (§3).

This maps onto the general Maker → Reviewer → GM → DCS pattern (§3), with **Sales = Maker** and **Marketing = Reviewer** specifically for quotations.

Anti-fraud sales flow (this ordering is intentional):

1. **Sales Quotation created (Sales / Maker)** — item, quantity, price tier.
2. **Inventory reservation check FIRST:** Before a quotation can proceed/route for approval, the system MUST check available (not just on-hand) stock and **soft-reserve** the quantity, ensuring quoted stock actually exists.
3. **Approval routing:** Quotation routes **Marketing (Reviewer) → GM → DCS** per thresholds, especially when price overrides or special deal pricing is applied.
4. **On approval:** Reservation is confirmed/locked (hard reserve); converts to Sales Order.
5. **Fulfillment:** Barcode-scanned picking → Delivery Receipt → Invoice.
6. **Reservation expiry:** Unapproved/unconverted quotations MUST auto-release reserved stock after a configurable period. **Launch setting: 3 days** (placeholder — MUST be admin-configurable, anticipated to change).

- Reserved stock MUST be excluded from "available" quantity shown to other quotations.
- 3-way match discipline on the sales side: SO ↔ DR ↔ Invoice.

### 4.4 Sales Pricing Maintenance

- **Dedicated Price Maintenance role:** Only users with the **Price Maintenance role** can create/edit price lists, tiers, and deal pricing (exact person to be assigned by the client later — role-based so assignment is flexible). Changes route through approval.
- **Standard price lists** maintained centrally with approval on changes.
- **Price tiers** (e.g., standard, distributor, government/institutional) — configurable in-app.
- **Deal-specific pricing:** Special prices for specific customers/deals MUST be set up as approved pricing records (with validity dates), not ad-hoc edits at quotation time.
- **Price overrides** below floor/approved price MUST trigger escalated approval and be fully logged (who, when, original vs. override price, justification).
- Anti-fraud note: because past sales fraud was incentive-driven, all discounting/override activity SHOULD be reportable per salesperson for incentive audit.

### 4.5 Purchasing (Stock-In)

Fraud occurred here previously — controls are mandatory:

1. **PO creation (Maker)** — supplier, items, quantities, prices.
2. **Approval chain:** Reviewer → GM → DCS/President per threshold (configurable).
3. **Send to supplier** only after full approval.
4. **Receiving:** Barcode scan at receipt; system enforces **quantity match vs. PO** — over-receipt is **HARD-BLOCKED**: all POs MUST be served strictly per approved quantity and amount (no receiving beyond the PO; any excess requires a new/revised approved PO); generates Receiving Report (RR); inventory updated per location/batch.
5. **Supplier invoice entry** and **3-way match** (PO ↔ RR ↔ Supplier Invoice) before the payable is recognized.
6. **Accounts Payable** recorded; sync/export to accounting system (QuickBooks Online).

- **Vendor (supplier) maintenance — dedicated control:** A dedicated **Vendor Maintenance role** MUST be the only role able to create/edit supplier records (new supplier, TIN, bank details, contact info). All changes route through approval and are fully audit-logged — supplier master tampering is a common purchasing-fraud vector.

### 4.6 Request for Payment (Other Expenses)

Same concept as the Pimascor app's payment request flow, for non-PO expenses:

- **Maker creates a Request for Payment (RFP)** for other expenses (utilities, rent, professional fees, etc.).
- **GL account picklist:** The maker selects the expense's **GL account from a maintained list** (chart of accounts) — free-text account entry is NOT allowed.
- **Approval flow:** Maker → GM → DCS (same approval engine; thresholds configurable like all other documents).
- **New GL accounts:** Only the **Admin** can add/modify GL accounts in the picklist; changes are audit-logged.
- Each RFP MUST capture payee, amount, GL account, description/justification, and supporting document attachments.
- **Fund releasing:** Approved RFPs are released from a **bank/fund source set up by the Admin** (see §4.8); the release step records which bank account was used, reference number, and release date.
- Approved RFPs flow into the QBO sync/export like other transactions.

### 4.7 Admin & System Administration

A dedicated **Admin role** with the following capabilities:

- **Control view of each user ("view as"):** Admin can open a read-only view of any user's screen/access for checking — what that user sees, their pending items, and their permissions.
- **Override authority:** Admin can override any transaction/workflow state when needed. **Every override MUST be prominently audit-logged** (who, what, when, before/after, reason required) and SHOULD appear in a dedicated "Admin Overrides" report visible to GM and DCS — this keeps the override power itself under oversight, consistent with the control-first design.
- **Approval configuration:** Admin adds/modifies approval chains, tiers, thresholds, and approver assignments in-app.
- **User & access management:** Admin creates/deactivates users, assigns/changes roles and permissions, and handles all user-access changes **through the Admin's own view** (self-service admin console — no developer involvement needed for user changes).
- **GL account maintenance:** Admin maintains the chart of accounts used by the RFP picklist (§4.6).
- **Bank setup for fund releasing:** Admin sets up and maintains the bank accounts / fund sources used when releasing payments for approved RFPs.

### 4.8 Accounting Integration

- **Dual integration — build BOTH:**
  - **Real-time API sync** with QuickBooks Online (QBO REST API, OAuth 2.0 connection owned by the client) for approved, matched transactions (invoices, bills/RRs, payments).
  - **Export/import for ALL modules** (CSV/Excel) as a fallback and for reporting flexibility.
- **The app maintains its own complete database of all records** — it is the permanent operational/control system of record for workflows, approvals, and audit trails; QBO remains the books of account.

---

## 5. Dashboards & Reports

### 5.1 Executive Dashboard (GM, Chairman/DCS, Admin)

A dashboard/overview screen for the **GM, Chairman (DCS), and Admin** showing at minimum:

- **Inventory level per location** (Quezon City, Pampanga, and future locations) — on-hand, reserved, available; drill-down to item/batch.
- **Sales profitability per sales quote** — quoted price vs. cost, gross margin per quotation/SO; drill-down to line items. (Requires item cost data — see open item in §8.)
- Pending approvals summary for the logged-in approver.
- SHOULD also surface: near-expiry stock alerts, admin-override activity, and open RFPs.

### 5.2 Reports (Minimum)

- Stock on hand / reserved / available per location, per batch/expiry.
- Near-expiry and expired stock report.
- Pending approvals queue per approver (with aging).
- Price override / discount log per salesperson.
- Open quotations with reservations (and expiry countdown).
- PO status, receiving variance, and 3-way match exception reports.
- Full audit trail report (filterable by user, document, date).

---

## 6. Technical & Delivery Guidance

- **Platform:** Responsive web app (mobile-friendly is mandatory for barcode scanning and on-the-go approvals); PWA approach RECOMMENDED for camera scanning.
- **Reusability goal:** Build as a configurable base ERP (tiers, approvers, locations, price lists all data-driven) so it can be adapted for future clients.
- **Development approach:** Spec-driven development — treat this document as the versioned source of truth; keep it in the repo, update it before changing behavior, and derive plans/tasks from it rather than ad-hoc prompting.
- **Suggested build order:** (1) Core masters + RBAC + approval engine → (2) Inventory + barcode → (3) Purchasing → (4) Sales quotation/reservation/pricing → (5) Reports + QBO integration.

---

## 7. Confirmed Decisions (Client Sign-Off Log)

| # | Topic | Decision |
|---|---|---|
| 1 | Approval thresholds | **All documents go to DCS (Chairman) at launch** — no amount-based shortcuts yet. Build the threshold/tier engine now, activate later. |
| 2 | Locations at go-live | **2**: Quezon City and Pampanga (must scale to more without code changes). |
| 3 | Reservation expiry | **3 days** for unapproved quotations (placeholder; admin-configurable). |
| 4 | PO over-receiving | **Hard-blocked.** Receiving strictly per approved PO qty and amount. |
| 5 | Pricing & vendor maintenance | Dedicated **Price Maintenance role** and dedicated **Vendor Maintenance role** (added as extra purchasing control). Specific users to be assigned later. |
| 6 | QBO integration | **Both**: real-time API sync (client's own QBO connection) AND export/import for all modules. App keeps its own full database of records. |
| 7 | Serial tracking | **Yes** — serial-number tracking for equipment, in addition to batch/expiry for supplies. |

## 8. Remaining Open Items

1. Who will be assigned the Price Maintenance and Vendor Maintenance roles (and who holds the Admin role).
2. Price tiers to configure at launch.
3. Future threshold amounts for tiered approval routing (to be defined when the Chairman is ready to delegate).
4. **Cost basis for profitability per quote** — confirm costing method (e.g., moving average vs. FIFO per batch) so gross margin on the dashboard is computed consistently.
5. Bank accounts to set up as fund sources for RFP releasing.
