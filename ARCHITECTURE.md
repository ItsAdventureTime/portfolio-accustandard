# Technical Architecture & Internal Control System

This document outlines the technical design, data flows, containerized deployment architecture, and remote version control standards for the **Accustandard Medical ERP Dashboard**.

**Source of truth:** `implementation_plan.md` governs UI/UX scope; the
confirmed acceptance handoff governs business rules; `IMPLEMENTATION_STATUS.md`
governs current runtime status; `README.md`, this document, and
`CONTRIBUTING.md` govern operations.

When object storage is needed, use the existing Backblaze B2 bucket
`bridge-ph`: `accustandard/demo/` for demo and `accustandard/` for production.
These are key prefixes; credentials remain server-side. The primary operator
path uses Backblaze's native `b2` CLI; optional S3 interoperability is
documented in [`BACKBLAZE_S3_WORKFLOW.md`](BACKBLAZE_S3_WORKFLOW.md).

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

Follow [`PROJECT_UPDATE_STANDARD.md`](PROJECT_UPDATE_STANDARD.md) and
[`GITHUB_HTTPS_WORKFLOW.md`](GITHUB_HTTPS_WORKFLOW.md) for the canonical
protocol. Local commits use local Git because `gh` has no local commit command;
remote Git objects and the `main` ref are published through authenticated
`gh api` calls over HTTPS. Never use SSH remotes, SSH keys, `gh ssh-key`,
passkeys, or direct `git push` for GitHub repository operations. VPS deployment
transfer is separate and user-run.

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

## Containerized Demo Deployment

The only active demo target is [https://accustandard.delegateops.business](https://accustandard.delegateops.business). A user manually builds and exports the API and frontend images in the Docker Sandbox, then manually loads them into OrbStack and starts `~/docker/portfolio/accustandard/compose.yaml`. The platform target follows the operator machine: use `linux/arm64` on Apple silicon (`uname -m` returns `arm64`/`aarch64`) and `linux/amd64` on Intel (`x86_64`/`amd64`).

```
Internet → Cloudflare Tunnel → frontend:80
                              ├─ cloudflared-network (external)
                              └─ api → PostgreSQL
                                 accustandard-network (internal)
```

Only the frontend joins the external tunnel network. The API and database remain internal and no service publishes a host port. The Compose runtime has no build instructions. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for the step-by-step procedure and secret handling.

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

### 4. Shared Feedback and Dialog Primitives
- **Modal Popups & Drawers:** `src/components/common/AccessibleModal.tsx` is the shared Radix Dialog shell for center dialogs, bottom sheets, and full-screen document previews. It owns the `modal-overlay`, `modal-viewport`, `modal-panel`, safe-area padding, scroll containment, focus restoration, Escape handling, and reduced-motion-safe entrance states. Feature modules own only their workflow content and callbacks; hand-built `fixed ... z-50` modal wrappers are not permitted.
- **Modal visual contract:** Modal surfaces use the AccuStandard canvas/card tokens, restrained borders, tinted navy shadows, sentence-case hierarchy, 44px close targets, and one clear primary action. `modal-body` provides the scroll region for long forms and mobile viewports; `modal-footer` keeps actions aligned and safe-area aware. `sheet` and `fullscreen` variants are used only when the task benefits from a bottom-sheet or document workspace.
- **Notifications (`NotificationCenter.tsx`):** Routine workflow feedback uses the existing Radix Toast primitive with an explicit `info`, `success`, `warning`, or `error` severity. Toasts are dismissible, deduplicated, queued with a four-item visible limit, paused by Radix on hover/focus/window blur, and placed above mobile bottom navigation and the device safe area. Offline status remains in the persistent page status region rather than a popup.
- **Interruptive alerts:** `SystemAlertModal.tsx` is reserved for a deliberate workflow interruption. When used, it is a Radix-backed `alertdialog` with a visible title, description, close/cancel action, focus trapping/restoration, and no global Enter dismissal.

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

The active demo deployment is the image-only Compose workflow documented in
[`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md). Historical VPS, Caddy, and
Quadlet files remain in the repository for traceability and are not part of the
current runtime boundary.
