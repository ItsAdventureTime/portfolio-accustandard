# Technical Architecture & Internal Control System

This document outlines the technical design, data flows, containerized deployment architecture, and remote version control standards for the **Accustandard Medical ERP Dashboard**.

**Source of truth:** `implementation_plan.md` governs UI/UX scope; the
confirmed acceptance handoff governs business rules; `IMPLEMENTATION_STATUS.md`
governs current runtime status; `README.md`, this document, and
`CONTRIBUTING.md` govern operations.

---

## 🏗️ System Overview

The system is structured as a single-page Next.js App Router application
optimized for static export deployment (`output: 'export'`). It provides an
interactive demo with role switching, UI control validation, and a manual
QuickBooks Online export queue boundary; it is not a live QBO integration.

```
+-----------------------------------------------------------------------+
|                         Next.js App Router (React)                    |
|  +-------------------+  +--------------------+  +------------------+  |
|  | Executive Overview|  | Inventory Control  |  | Quotations & RFQ |  |
|  +-------------------+  +--------------------+  +------------------+  |
|  | SOA & Ledgers     |  | Purchasing Match   |  | RFP & Audit Log  |  |
|  +-------------------+  +--------------------+  +------------------+  |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    Global Store (useDemoStore.ts)                     |
|  - Inventory SKUs (FEFO Expiry, QC & Pampanga Warehouses)             |
|  - Demand Replenishment Planner (Class 1/2/3 Items)                  |
|  - Configurable Approval Pipeline (Sales Quote ends at GM; DCS conditional) |
|  - Manual QBO export/queue boundary (QBO Ref IDs; no live integration) |
|  - Multi-SOA Collection Allocations & Credit Ledger                   |
+-----------------------------------------------------------------------+
```

---

## 🔐 GitHub CLI (`gh`) Remote Synchronization Standard

Follow [`GITHUB_HTTPS_WORKFLOW.md`](GITHUB_HTTPS_WORKFLOW.md) for the canonical
protocol. `gh auth setup-git` configures the authenticated GitHub CLI credential
helper; branch synchronization then uses the HTTPS remote. Never use SSH
remotes, SSH keys, `gh ssh-key`, or passkeys for GitHub repository operations.
VPS deployment transfer is separate and user-run.

---

## 🔒 COSO Internal Control Architecture

### 1. Segregation of Duties
Every operational transaction enforces its configured maker-checker-approver flow. Purchase Orders use Purchasing → Accounting → GM → optional DCS; RFPs use Maker → GM → optional DCS; Sales Quotes use Sales Officer → Marketing Reviewer → GM, then client acceptance evidence before fulfillment:
1. **Maker (Sales / Warehouse / Staff):** Drafts transaction.
2. **Accounting or Marketing Reviewer:** Reviews the document-specific control stage.
3. **General Manager (Karen):** Conducts operational approval.
4. **DCS Chairman:** Issues final corporate sign-off.

A maker cannot approve their own document.

### 2. 3-Way Purchasing Match
When fully implemented, receiving compares:
`Purchase Order Quantity` ↔ `Goods Receipt (RR)` ↔ `Vendor Invoice Amount`

The current demo atomically enforces the PO/RR quantity gate; vendor-invoice
matching remains a separate unimplemented acceptance step.

If receiving quantities exceed the approved PO amount, the transaction is hard-blocked to prevent vendor over-billing.

### 3. QuickBooks Online (QBO) Handoff Engine
Operational users never post directly to accounting ledgers. Completed
transactions pass through internal validation into the manual QBO export/queue
boundary. This runtime does not provide a live QuickBooks Online integration.

---

## 🐳 Containerized Deployment Architecture (Demo Target)

Until leadership approves a production release, all builds are deployed
exclusively to the Demo environment. The deployment is remote-only and builds
the frontend in a disposable Podman container; it removes remote source build
artifacts after publishing while retaining the backend image required by
Quadlet:

```
[ Internet Client ]
       |
       v (HTTPS: 443) -> https://delegateops.business/accustandard/demo
[ Caddy Reverse Proxy (caddy.service) ]
       |
       v /accustandard/demo
[ Demo Pod: accustandard-demo-pod ] (localhost:8080 API + mounted static web root)
```

### Path Specifications
- **Live Demo URL:** [https://delegateops.business/accustandard/demo](https://delegateops.business/accustandard/demo)
- **Demo Web Root Path:** `/home/jk/bridge-ph/accustandard-demo/`
- **Demo Quadlet Systemd Path:** `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`

### Quadlet Services (`deploy/quadlets/demo/`)
- **`accustandard-demo-pod.pod`**: Systemd pod unit publishing port 8080 for the Go API.
- **`accustandard-demo-app.container`**: Go API container serving `/accustandard/demo/api/v1`.
- **`accustandard-demo-db.container`**: PostgreSQL container storing demo state records.

---

## 🎨 UI/UX Design System & Micro-Interaction Architecture

The interface follows modern web ergonomics with physics-based motion, spatial alignment, and high-legibility visual hierarchy:

### 1. Viewport-Optimized Modal Container Sizes
- **Inspector Modals (`max-w-3xl`, 768px wide)**: Document QRN Inspector, SKU Barcode Detail, PO 3-Way Match Audit, RFP Expense Breakdown, and User Access Matrix Editor.
- **Queue Drawers (`max-w-4xl`, 896px wide)**: QuickBooks Online Live Sync Queue and Barcode Product Manager.
- **Interactive Form Modals (`max-w-3xl`, 768px wide)**: Create Sales Quote, Create PO, Warehouse Receiving Report (RR), Create RFP, and Add Stock Batch.

### 2. Micro-Animations & Spatial Alignment Rules
- **Hover Elevation**: Card components enforce `hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-out` with equal-height flex container wrapping (`h-full flex flex-col justify-between`).
- **Primary Nav States**: Horizontal navigation uses an active underline,
  role-filtered destinations, and visible keyboard focus states. Mobile uses a
  drawer/bottom-navigation variant.
- **Pill Tab Switchers**: Tab bars use encapsulated background rails (`bg-slate-200/70 p-1.5 rounded-2xl flex gap-1.5`) with active state scaling (`bg-blue-900 text-white shadow-md`).
- **Glassmorphism 2.0**: Navigation bar headers enforce `bg-white/90 backdrop-blur-xl border-b border-slate-200/80`.

### 3. Standardized Button Pill Badge System
Across all 6 core data tables, interactive primary keys are rendered inside high-contrast button pill badges (`bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-2xs group cursor-pointer`):
- **DOCUMENT QRN / ID**: `FileText` (left) + `QRN Code` + `Eye` (right badge) &rarr; opens Document Inspector Modal.
- **SKU / BARCODE**: `Barcode` (left) + `SKU Code` + `Eye` (right badge) &rarr; opens Stock Barcode Detail Modal.
- **PO NUMBER**: `FileText` (left) + `PO Code` + `Eye` (right badge) &rarr; opens 3-Way Match PO Modal.
- **RFP VOUCHER ID**: `FileText` (left) + `RFP Code` + `Eye` (right badge) &rarr; opens Expense Voucher Inspector Modal.
- **USER NAME**: `User` (left) + `User Name` + `Eye` (right badge) &rarr; opens User Access Matrix Editor Modal.
- **RFQ REF #**: `FileText` (left) + `RFQ Code` + `Eye` (right badge) &rarr; opens Sales RFQ Inspector Modal.

### 4. Smooth Physics Entrance Animations & High-Visibility Notification Dialogs
- **Modal Popups & Drawers:** All modal popups enforce backdrop blur fade-in (`bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200`) and dialog container zoom-in (`animate-in fade-in zoom-in-95 duration-200`).
- **High-Visibility Notification Popups (`SystemAlertModal.tsx`):** Replaces auto-dismissing toast notifications with centered popup window modals featuring explicit user confirmation buttons (`"Acknowledge & Close"`) so alerts and workflow updates cannot be overlooked.

---

## 📊 Inventory Classification System

Products are managed under 3 distinct stock categories:
- **Class 1 (Core Fast-Moving):** Automated reorder calculation triggered at critical levels + 10% safety buffer.
- **Class 2 (Controlled Stock):** Reordering requires explicit forecast review by management.
- **Class 3 (Short-Expiry / Special):** Hard-blocked from generating supplier POs without a linked Customer PO.

## 2026 Control Corrections

- Sales Quote approval ends at GM approval. Client acceptance evidence is a separate gate before fulfillment; no DCS task is generated.
- Purchasing may use DCS approval only when its configured control rule requires it.
- Go receiving updates are transactional and lock the PO row while enforcing the approved quantity ceiling; inventory synchronization remains subject to the deployed API acceptance run.
- Frontend list hydration is backend-first; browser `localStorage` is not used as the business transaction store.

See `IMPLEMENTATION_STATUS.md` for the audited runtime boundary and current
validation record.
