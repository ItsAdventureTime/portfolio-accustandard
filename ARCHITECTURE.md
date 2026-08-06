# Technical Architecture & Internal Control System

This document outlines the technical design, data flows, and containerized deployment architecture for the **Accustandard Medical ERP Dashboard**.

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

## 🐳 Containerized Deployment Architecture

Production deployments use **Podman Quadlets** running systemd-managed rootless containers behind a Caddy reverse proxy:

```
[ Internet Client ]
       |
       v (HTTPS: 443)
[ Caddy Reverse Proxy ]
       |
       +---> /accustandard/demo ---> [ localhost:3001 ] (accustandard-demo-pod)
       |
       +---> /accustandard -------> [ localhost:3000 ] (accustandard-pod)
```

### Quadlet Services (`deploy/quadlets/`)
- **`accustandard-pod.pod`**: Systemd pod unit publishing port 3000.
- **`accustandard-app.container`**: Web app container running static export files.
- **`accustandard-db.container`**: PostgreSQL container storing persistent records.

---

## 📊 Inventory Classification System

Products are managed under 3 distinct stock categories (Blueprint Section 3):
- **Class 1 (Core Fast-Moving):** Automated reorder calculation triggered at critical levels + 10% safety buffer.
- **Class 2 (Controlled Stock):** Reordering requires explicit forecast review by management.
- **Class 3 (Short-Expiry / Special):** Hard-blocked from generating supplier POs without a linked Customer PO.
