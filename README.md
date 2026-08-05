# Accustandard Medical ERP & Supply Chain Dashboard v4.3

> **Accustandard Medical and Diagnostic Supplies Corporation**  
> Partner Agency: **DelegateOps Business Support Services (DOS)**  
> Production Platform & Interactive Internal Control Simulator

---

## 🌟 Executive Summary & System Overview

The **Accustandard Medical ERP Dashboard** is a COSO control-first, multi-location medical supply chain and financial management system built for **Accustandard Medical and Diagnostic Supplies Corporation**. It enforces strict segregation of duties across warehouse operations (Quezon City & Pampanga), sales quotation routing, receiving report 3-way matching, client aging statement of account (SOA) ledgers, non-PO expense management, and QuickBooks Online (QBO) live synchronization.

---

## 🎨 Light Corporate Medical Design Philosophy

In accordance with modern medical enterprise design standards and 2026 digital ergonomics guidelines, the application enforces a high-contrast **Light Corporate Medical Aesthetic System** (`#F8FAFC` slate canvas, `#FFFFFF` crisp card containers, `#E2E8F0` subtle borders, `#1E3A8A` Deep Royal Navy branding, and `#DC2626` Bright Medical Red accents).

---

## 🚀 Key Modules & Interactive Features

### 1. Executive Control & COSO Approval Pipeline
- **4-Layer Approval Pipeline:** Enforces COSO Segregation of Duties (`Maker` &rarr; `Reviewer [Marketing]` &rarr; `GM [Karen]` &rarr; `DCS [Chairman]`).
- **QuickBooks Online (QBO) Sync Queue Drawer:** Live QBO queue modal displaying validated transactions (Sales Invoices, Vendor Bills, Customer Collections, COGS entries) with QBO reference IDs and status (`QBOSyncQueueModal`).

### 2. Multi-Location Inventory & Replenishment Planner
- Multi-warehouse stock tracking across **Quezon City** and **Pampanga** facilities with FEFO expiry tracking.
- **Demand & Replenishment Planner (Blueprint Section 3):**
  - **Class 1 (Core Stock):** Fast-moving stock reordering at critical level + 10% safety buffer.
  - **Class 2 (Controlled):** Slower-moving stock requiring demand forecast review.
  - **Class 3 (Short-Expiry / Special):** Hard-blocked without linked Customer PO to prevent over-stocking.

### 3. Sales Quotation, RFQ & Marketing ROI Engine
- **Sales Demand Request (RFQ):** Input form for Sales Agents to record customer daily census, LIS connectivity needs, and expected contract terms.
- **Marketing Manager ROI Calculator:** Side-by-side cost vs. selling price calculator displaying landed cost, LIS connectivity, account overhead, net profit/unit, and contract margin percentage.
- **Official Sales Quotation Document:** Replicates official Accustandard Quotation template matching `photo_2026-08-01_23-55-26.jpg`.

### 4. Statement of Account (SOA) & Multi-SOA Collection Allocation
- Replicates official SOA statements matching `photo_2026-08-01_23-55-13.jpg` with full-width bright yellow balance bar (`₱32,208.00`).
- **Multi-SOA Collection Payment Allocation:** Multi-SOA collection modal allowing a single payment check to be allocated across multiple open client invoices with unapplied customer credit tracking.

### 5. Purchasing & 3-Way Match Fraud Control
- Enforces strict 3-way matching between Purchase Order Quantity = Goods Receipt (RR) = Vendor Invoice. Hard-blocks over-receiving.

---

## 🔒 Role-Based Access Control (RBAC) Matrix

| User Role | Permitted Modules | Approval Permissions | Restricted Modules / Actions |
| :--- | :--- | :--- | :--- |
| **Admin (Bridge)** | All 7 Modules | All Stages (Reviewer, GM, DCS) | None (Full Access) |
| **Chairman (DCS)** | All 7 Modules | All Stages (Reviewer, GM, DCS) | None (Full Access) |
| **General Manager** | All 7 Modules | Stage 1 (Reviewer) & Stage 2 (GM) | Stage 3 DCS Chairman Approval |
| **Bookkeeper** | Overview, SOA, Purchasing, RFP | View Only | Inventory, Quotations, Admin, Approvals |
| **Warehouse** | Inventory, Purchasing | RR Entry Only | Overview, Quotations, SOA, RFP, Admin |
| **Marketing** | Overview, Quotations | Stage 1 (Reviewer) & ROI Only | Inventory, SOA, Purchasing, RFP, GM/DCS |
| **Sales** | Quotations, Inventory | Create RFQ / Quotes Only | Overview, SOA, Purchasing, RFP, Admin |

---

## 🛠️ Step-by-Step Manual Deployment Guide for VPS

```bash
# Step 1: Navigate to project workspace
cd /Users/jk.deguzman/dev/accustanda-bridge-dashboard

# Step 2: Build static export inside isolated disposable Podman container
podman run --rm \
  -v "/Users/jk.deguzman/dev/accustanda-bridge-dashboard:/workspace:Z" \
  -v /workspace/.next \
  -v /workspace/node_modules \
  -w /workspace \
  node:current-alpine \
  sh -c "npm ci && npm run build"

# Step 3: Sync static export build files to VPS web root
rsync -avz --delete -e "ssh -p 22" \
  /Users/jk.deguzman/dev/accustanda-bridge-dashboard/out/ \
  jk@216.75.75.136:/home/jk/bridge-ph/accustanda-demo/

# Step 4: Format host Caddyfile on VPS & reload Caddy container
ssh -p 22 jk@216.75.75.136 "podman exec caddy caddy fmt /etc/caddy/Caddyfile > /tmp/Caddyfile.tmp && mv /tmp/Caddyfile.tmp /home/jk/caddy/conf/Caddyfile && podman exec caddy caddy reload --config /etc/caddy/Caddyfile"

# Step 5: Purge Bunny CDN Cache
ssh -p 22 jk@216.75.75.136 "bunny-purge"
```

---

© 2026 Accustandard Medical and Diagnostic Supplies Corporation & DelegateOps Business Support Services. All Rights Reserved.
