# ChatGPT Codex Handoff Prompt: AccuStandard Medical ERP Revamp & Implementation

> **2026-08-12 audit baseline:** Treat `IMPLEMENTATION_STATUS.md` as the
> current runtime evidence companion. The confirmed handoff and acceptance
> handoff outrank this historical execution prompt.

> **Authority map:** Use `implementation_plan.md` for UI/UX scope, the
> confirmed acceptance handoff for business rules,
> `IMPLEMENTATION_STATUS.md` for runtime status, and
> `README.md`/`ARCHITECTURE.md`/`CONTRIBUTING.md` for operations. This file is
> historical prompt material and must not override those sources.

> **Instructions for User:** Copy and paste the entire prompt block below directly into **ChatGPT Codex**. This prompt instructs Codex to implement the complete UI/UX revamp (desktop & mobile), brand design system based on the official logo (`public/photo_2026-08-01_23-55-07.jpg`), and align the entire codebase strictly with the project specifications.

---

```markdown
# Comprehensive Execution Prompt for ChatGPT Codex

You are an expert Go backend engineer, Next.js React frontend architect, UI/UX product designer, and DevOps specialist. Your objective is to perform a complete UI/UX revamp and end-to-end implementation of the **AccuStandard Medical ERP Dashboard**, incorporating the official brand identity from the logo (`public/photo_2026-08-01_23-55-07.jpg`) and aligning the codebase strictly with:
- `AccuStandard_Developer_Handoff_UPDATED.md`
- `AccuStandard_Developer_Correction_and_Acceptance_Test_Handoff.md`
- `accustandard-webapp-spec.md`
- `GO_MIGRATION_PLAN.md`
- `ARCHITECTURE.md`
- `ChatGPT-Codex-UI-UX-Design-Reference-Context.md`
- `llm-interface-design-context-prompt.md`

---

## 🎨 PART 1: BRAND IDENTITY & UI/UX REVAMP (DESKTOP & MOBILE)

Redesign and modernize the entire web application UI/UX for desktop power users and mobile field users based on 2026 enterprise design standards and the official AccuStandard brand logo (`public/photo_2026-08-01_23-55-07.jpg`).

### 1.1 Brand Identity & Color Tokens (Derived from Logo)
- **Official Brand Logo Reference:** `public/photo_2026-08-01_23-55-07.jpg`
  - Full Entity Name: **ACCUSTANDARD MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION**
  - Brand Primary Navy: `#1E3A8A` (Deep Royal Navy) & `#2563EB` (Electric Sapphire)
  - Signature Brand Accent Red: `#DC2626` (Medical Rx Red, matching the stylized Rx logo flourish and red underline bar)
  - Neutral Backgrounds: Soft Anti-glare Slate (`#F8FAFC`, `bg-slate-100/90`), Pure Surface White (`#FFFFFF`), Border Stroke (`#E2E8F0`)
  - Sub-Headline Typography: Tracking-wide uppercase sans-serif (`font-extrabold tracking-wider text-xs uppercase text-slate-600`)
- **Glassmorphism 2.0 & Adaptive Blur:**
  - Header Bar & Nav Rails: `bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs` (Dark mode: `bg-slate-900/90 backdrop-blur-xl border-slate-800 text-white`).
  - Overlay Backdrops: High-contrast slate overlay `bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200`.
- **Standardized Rx Pill Badge System:**
  - Standardize primary key tags across all data tables (`bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-150 cursor-pointer shadow-2xs group flex items-center gap-2`):
    - `DOCUMENT QRN`: FileText icon + QRN Code + Red Rx Accent Dot + Eye inspector trigger.
    - `SKU / BARCODE`: Barcode icon + SKU Code + Eye stock modal trigger.
    - `PO NUMBER`: FileText icon + PO Code + Eye 3-Way match modal trigger.
    - `RFP VOUCHER`: CreditCard icon + Voucher ID + Eye voucher modal trigger.
    - `RFQ REF #`: FileText icon + RFQ Code + Eye preview modal trigger.
    - `USER NAME`: User icon + Name + Access matrix modal trigger.

### 1.2 Desktop Ergonomics (1024px and up)
- **Responsive Navigation Shell:** Horizontal desktop navigation with
  Dashboard, Inventory, Orders, Finance, and Reports; active destinations are
  underlined and role-filtered. Mobile retains the drawer and bottom
  navigation for the same permitted destinations.
- **Decision-First Role Action Dashboards:** A "Needs Your Attention Today"
  action center with three role-aware cards for approvals, RFQs, and
  receiving/stock alerts, followed by a compact approval queue.
- **Compact Operational Tables:** Responsive five-column queues with clear
  status pills, inspect actions inside row content, and secondary exports or
  QBO tools grouped under the header Operations & tools menu.
- **Right Slide-Over Inspector Drawers (`max-w-4xl`):** Contextual slide-out drawers for quick inspection of documents, PO 3-way match, client SOA ledgers, and QBO live sync queues without leaving the main table context.

### 1.3 Mobile Ergonomics & PWA (Below 1024px)
- **Thumb-Zone Bottom Navigation Rail (`BottomNav.tsx`):** Optimized for 4 primary destinations (Overview, Inventory, Quotes, SOA) + quick action trigger button.
- **Mobile Navigation Drawer (`MobileNavDrawer.tsx`):** Slide-in drawer for secondary items, role simulator, and system administration.
- **Touch-First Controls:** Minimum 44x44px touch targets on all buttons, select dropdowns, and input fields.
- **Mobile Barcode Scanner Camera:** Integrated camera scanner (`BarcodeScannerModal.tsx`) using HTML5/ZXing for stock receiving, picking/dispatch, and physical cycle counts on smartphones.
- **PWA & Offline Readiness:** PWA install modal (`PWAInstallModal.tsx`), offline connection status indicator, and local caching for mobile field users.
- **Accessibility:** WCAG 2.2 AA compliance across form controls, focus rings (`focus:ring-2 focus:ring-blue-600 focus:outline-hidden`), and contrast ratios.

---

## ⚙️ PART 2: GO REST API BACKEND & DATABASE MIGRATION

Migrate the system from client-side `localStorage` state into an authoritative **Go REST API + PostgreSQL** backend as specified in `GO_MIGRATION_PLAN.md`.

### 2.1 Backend Architecture & Tech Stack
- Directory: `backend/`
- Language/Framework: Go from the moving official
  `docker.io/library/golang:alpine` build image, with `go-chi/chi/v5` and
  PostgreSQL driver (`pgx/v5` or `gorm`). Do not replace the floating image
  with a version-pinned Go image.
- REST API Base Path: `/accustandard/demo/api/v1/*`.
- Database: PostgreSQL 17 (`accustandard_demo_db`).
- Runtime schema: GORM `AutoMigrate` plus idempotent `backend/migrations/002_seed_data.sql` demo seed.

### 2.2 PostgreSQL Schema & Endpoints Required
1. `users` & `roles`: User accounts, RBAC permissions, role definitions.
2. `inventory` & `stock_batches`: Multi-warehouse items (Quezon City & Pampanga), batch/lot numbers, expiry dates, serial numbers, FEFO picking logic, on-hand/reserved/available quantities.
3. `costing_history`: Weighted moving average (WMA) cost history log per SKU.
4. `rfqs` & `roi_workbooks`: RFQs, client census data, ROI calculator values (matching `REVISED ROI_ACE PATEROS.xlsx`).
5. `quotations` & `quotation_items`: Sales quotes, pricing tiers, soft/hard stock reservations, client acceptance evidence records.
6. `purchase_orders` & `po_items`: PO requests, open PO same-SKU quantity checks, Accounting review status, GM/DCS approval records.
7. `goods_receipts` & `rr_items`: PO-linked Receiving Reports, quantity/amount validation (hard-block over-receiving), barcode scans.
8. `vendor_invoices` & `three_way_matches`: Vendor invoice entry, 3-way match validation (PO ↔ RR ↔ Invoice).
9. `delivery_receipts` & `sales_invoices`: DR dispatch records, customer sales invoices.
10. `statements_of_account` & `collections`: Client SOA ledgers, payment collections, multi-invoice payment allocation entries.
11. `requests_for_payment`: Non-PO expense vouchers, GL account selection, bank releasing accounts, proof of disbursement uploads.
12. `qbo_sync_queue`: QuickBooks Online export queue, sync status, QBO reference IDs.
13. `audit_logs`: Immutable action trail (user, role, timestamp, action, before/after JSON).

---

## 🔒 PART 3: NON-NEGOTIABLE WORKFLOW & CONTROL RULES

Enforce the following non-negotiable business rules across both backend API and frontend views:

### 3.1 Sales Quote Workflow & ROI
- **ROI Calculator:** Structure matching `REVISED ROI_ACE PATEROS.xlsx` with locked formula outputs (Gross Margin, Payback Period, Net Profit) and editable client parameters.
- **Sales Quote Approval Chain:**
  - Maker: Sales Officer
  - Reviewer: Marketing Reviewer
  - Approver: General Manager (Karen)
  - **CRITICAL:** NO DCS approval stage for Sales Quotes (DCS approval removed per updated handoff).
- **Client Acceptance Evidence:** GM-approved Sales Quote CANNOT proceed to fulfillment until client acceptance evidence (signed PO upload / client confirmation) is recorded.
- **Stock Reservation:** Soft-reserve inventory upon quote creation; hard-reserve upon GM approval; auto-release after 3 days if unapproved/unconverted.

### 3.2 Purchasing Workflow & 3-Way Match
- **PO Creation & Open-PO Control:** Check existing open PO quantities for the target SKU before issuing a new PO to prevent duplicate purchasing.
- **Accounting PO Review:** Accounting role MUST review PO pricing, terms, GL budget, and open PO quantities prior to GM/DCS approval.
- **DCS PO Approval:** Admin-configurable rules (threshold-based or mandatory all POs at launch).
- **Goods Receipt (RR) Sync:** Atomic update of linked PO items and warehouse stock. Over-receiving (qty or amount) is strictly HARD-BLOCKED.
- **Vendor Invoice & 3-Way Match:** Vendor Invoice must be matched against approved PO and Goods Receipt before payable is recognized.

### 3.3 Finance, Billing & Collections
- **SOA & Payment Allocation:** Generate client SOA based on uncollected sales invoices. Support allocating one client payment across multiple invoices with partial payment tracking.
- **RFP Disbursement:** Non-PO payment vouchers require selecting GL account from picklist, bank/fund source, and uploading proof of disbursement.
- **Weighted Moving Average (WMA) Costing:** Recalculate WMA cost automatically upon qualifying goods receipt and append to `costing_history`.

### 3.4 RBAC & Real Work Queues
- Enforce real role queues ("My Actions", "Returned to Me", "My Drafts", "Submitted / History") for each logged-in role.
- Enforce strict Segregation of Duties and NO self-approval.
- Admin self-service console: Manage users, roles, GL accounts, approval thresholds, and startup cutover data imports.
- Manual QBO Export: Provide 1-click export of bills, invoices, payments, and journal entries in QBO-ready CSV/Excel format.

---

## 🚀 PART 4: CONTAINERIZATION, DEPLOYMENT & GIT PROTOCOL

1. **Podman Quadlet Deployment:**
   - Quadlet files: `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`
   - Data & web root: `/home/jk/bridge-ph/accustandard-demo/`
   - Automated build & deploy script: `./scripts/deploy-demo.sh` (`npm run deploy:demo`).
  2. **Git & Remote HTTPS Protocol:**
      - Follow `GITHUB_HTTPS_WORKFLOW.md`. Use official GitHub CLI (`gh`) to
        authenticate/configure Git, then synchronize only through the
        authenticated HTTPS remote
        (`https://github.com/ItsAdventureTime/bridge-accustandard.git`). Never
        use SSH remotes, SSH keys, `gh ssh-key`, or passkeys. Demo VPS transfer
        is a separate user-run SSH/rsync operation.
 3. **Documentation Sync:** Update the applicable source-of-truth document and every affected operational guide whenever code or design changes. Keep historical prompts and transcripts explicitly non-authoritative rather than copying stale instructions into them.

---

## 🛠️ VERIFICATION & ACCEPTANCE CHECKLIST
Before completing execution, verify:
- [ ] `npm run lint` and `npm run build` pass inside disposable Podman; no
      macOS host build is required.
- [ ] Go backend builds (`go build ./...`) and PostgreSQL migrations run cleanly.
- [ ] UI is fully responsive across desktop (1440px), tablet (768px), and mobile (375px).
- [ ] Real user role switching updates actionable queues correctly.
- [ ] Sales Quote flow executes Sales -> Marketing -> GM -> Client Acceptance -> Fulfillment without DCS block.
- [ ] PO workflow enforces Accounting Review, Open-PO same-SKU checks, Goods Receipt atomic updates, and 3-Way Match.
- [ ] SOA payment allocations reconcile across multiple invoices.
- [ ] Automated/manual deployment via `./scripts/deploy-demo.sh` succeeds.
```
