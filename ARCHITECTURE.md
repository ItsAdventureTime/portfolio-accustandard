# Technical Architecture & Internal Control System

This document outlines the technical design, data flows, containerized deployment architecture, and remote version control standards for the **Accustandard Medical ERP Dashboard**.

---

## 🏗️ System Overview

The system is structured as a single-page Next.js App Router application optimized for static export deployment (`output: 'export'`). It provides an interactive simulation of an enterprise ERP system with full role switching, real-time internal control validation, and QuickBooks Online integration queues.

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
|  - 4-Layer Approval Pipeline (Maker -> Reviewer -> GM -> Chairman)    |
|  - QuickBooks Online Live Sync Queue (QBO Ref IDs)                   |
|  - Multi-SOA Collection Allocations & Credit Ledger                   |
+-----------------------------------------------------------------------+
```

---

## 🔐 Strict Git & GitHub CLI (`gh`) Version Control Standard

To ensure auditability and consistent remote synchronization:
- **Local Commits:** Use **ONLY** local `git` CLI commands (`git commit -m "..."`). SSH key signing is not required.
- **Remote Operations:** ALWAYS use official GitHub CLI (`gh`) commands over **HTTPS** (`https://github.com/ItsAdventureTime/bridge-accustandard.git`), authenticated via default `gh auth` credentials. NEVER use `git` commands for remote operations.

---

## 🔒 COSO Internal Control Architecture

### 1. Segregation of Duties
Every operational transaction (Purchase Orders, Sales Quotations, RFP Expense Requests, Inventory Adjustments) enforces a 4-tier maker-checker-approver flow:
1. **Maker (Sales / Warehouse / Staff):** Drafts transaction.
2. **Reviewer (Marketing Manager):** Audits margins, specifications, and terms.
3. **General Manager (Karen):** Conducts operational approval.
4. **DCS Chairman:** Issues final corporate sign-off.

A maker cannot approve their own document.

### 2. 3-Way Purchasing Match
When receiving inventory from vendors, the system compares:
`Purchase Order Quantity` ↔ `Goods Receipt (RR)` ↔ `Vendor Invoice Amount`

If receiving quantities exceed the approved PO amount, the transaction is hard-blocked to prevent vendor over-billing.

### 3. QuickBooks Online (QBO) Handoff Engine
Operational users never post directly to accounting ledgers. Completed transactions pass through internal validation into the `QBO Live Sync Queue`. Approved items receive a unique QBO reference ID upon synchronization.

---

## 🐳 Containerized Deployment Architecture (Demo Target)

Until leadership approves the demo site, all builds are deployed exclusively to the Demo environment:

```
[ Internet Client ]
       |
       v (HTTPS: 443) -> https://delegateops.business/accustandard/demo
[ Caddy Reverse Proxy (caddy.service) ]
       |
       v /accustandard/demo
[ Demo Pod: accustandard-demo-pod ] (localhost:3001)
```

### Path Specifications
- **Live Demo URL:** [https://delegateops.business/accustandard/demo](https://delegateops.business/accustandard/demo)
- **Demo Web Root Path:** `/home/jk/bridge-ph/accustandard-demo/`
- **Demo Quadlet Systemd Path:** `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`

### Quadlet Services (`deploy/quadlets/demo/`)
- **`accustandard-demo-pod.pod`**: Systemd pod unit publishing port 3001.
- **`accustandard-demo-app.container`**: Web app container running demo static export files.
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
- **Sidebar Nav Translations**: Navigation links execute rightward micro-translation on hover (`hover:translate-x-1 transition-all duration-200`).
- **Pill Tab Switchers**: Tab bars use encapsulated background rails (`bg-slate-200/70 p-1.5 rounded-2xl flex gap-1.5`) with active state scaling (`bg-blue-900 text-white shadow-md`).
- **Glassmorphism 2.0**: Navigation bar headers enforce `bg-white/90 backdrop-blur-xl border-b border-slate-200/80`.

---

## 📊 Inventory Classification System

Products are managed under 3 distinct stock categories:
- **Class 1 (Core Fast-Moving):** Automated reorder calculation triggered at critical levels + 10% safety buffer.
- **Class 2 (Controlled Stock):** Reordering requires explicit forecast review by management.
- **Class 3 (Short-Expiry / Special):** Hard-blocked from generating supplier POs without a linked Customer PO.
