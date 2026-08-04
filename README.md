# Accustandard Medical ERP & Supply Chain Dashboard v4.2

> **Accustandard Medical and Diagnostic Supplies Corporation**  
> Partner Agency: **DelegateOps Business Support Services (DOS)**  
> Production Platform & Interactive Internal Control Simulator

---

## 🌟 Executive Summary & System Overview

The **Accustandard Medical ERP Dashboard** is a COSO control-first, multi-location medical supply chain and financial management system built for **Accustandard Medical and Diagnostic Supplies Corporation**. It enforces strict segregation of duties across warehouse operations (Quezon City & Pampanga), sales quotation routing, receiving report 3-way matching, client aging statement of account (SOA) ledgers, non-PO expense management, and QuickBooks Online (QBO) live synchronization.

---

## 🎨 Light Corporate Medical Design Philosophy

In accordance with modern medical enterprise design standards and 2026 digital ergonomics guidelines, the application enforces a high-contrast **Light Corporate Medical Aesthetic System** (`#F8FAFC` slate canvas, `#FFFFFF` crisp card containers, `#E2E8F0` subtle borders, `#1E3A8A` Deep Royal Navy branding, and `#DC2626` Bright Medical Red accents).

### Core Design System Principles Applied:
- **No Dark Mode Contradictions:** All surfaces, modals, popovers, and navigation drawers use clean off-white card surfaces (`bg-white border border-slate-300 shadow-2xl`) and dark slate text (`text-slate-900`).
- **Streamlined Visual Hierarchy:** Top priority metrics occupy 4 crisp summary tiles (Pending Approvals, Accounts Receivable Balance, Low Stock SKUs, Unverified POs).
- **Progressive Disclosure:** Complex workflows are managed through interactive action buttons, responsive modals, and slide-over drawers.
- **Cognitive Ergonomics for Older Demographics:** Generous font sizes (`text-sm`/`text-base`), high contrast ratios (WCAG AAA), and 48px touch targets for mobile accessibility.
- **Predictable Wayfinding Navigation:** Desktop Sidebar lockup paired with persistent mobile bottom bar and `⌘K` command palette search.

### Official Brand Logo Lockup Specifications
Matching `photo_2026-08-01_23-55-07.jpg`:
- **Brand Title:** `ACCUSTANDARD` in bold Royal Blue (`#1E3A8A`)
- **Rx D Accent:** `R` in Red with italic `x` and Royal Blue `D`
- **Horizontal Bar:** Solid red divider line (`#DC2626`)
- **Tagline Subtext:** `MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION`

---

## 🚀 Key Modules & Interactive Features

### 1. Executive Control & COSO Approval Pipeline
- **4-Layer Approval Pipeline:** Enforces COSO Segregation of Duties (`Maker` &rarr; `Reviewer [Marketing]` &rarr; `GM [Karen]` &rarr; `DCS [Chairman]`).
- **Interactive Role Simulator ("Simulate Role"):** Allows impersonation of 7 user roles (`Admin`, `Chairman DCS`, `General Manager`, `Bookkeeper`, `Warehouse`, `Marketing`, `Sales`) to test authorization workflows.
- **Visual Role Lock Badges:** Unauthorized approval stages render muted lock indicators (`Role Locked`).

### 2. Multi-Location Inventory Control
- Multi-warehouse stock tracking across **Quezon City** and **Pampanga** facilities.
- **Batch FEFO Expiry Management:** Tracks lot numbers and flags near-expiry reagents.
- **Live Camera Barcode Scanner:** Real-time mobile camera stream scanner with audio beep feedback and 1-click test barcodes.
- **Interactive Stock CRUD & SKU Manager:** Full ability to add stock batches (`AddStockModal`) and manage SKU definitions (`BarcodeProductManagerModal`).

### 3. Sales Quotation Generator & 3-Day Stock Reservation
- Replicates official Accustandard Quotation template matching `photo_2026-08-01_23-55-26.jpg` (blue/red dual accent bars, dark blue header `#002060`, terms & conditions, signatory block).
- **3-Day Stock Reservation Rule:** Auto-reserves inventory items upon quotation creation.
- **A4 Document Print Engine:** Generates clean, uncompressed A4 printable PDF documents with `@page { size: A4 portrait; margin: 12mm; }`.

### 4. Statement of Account (SOA) & Client Aging
- Replicates official SOA statements matching `photo_2026-08-01_23-55-13.jpg` with client info, AR aging ledger (0-30 days, 31-60 days, 61-90 days, 90+ days), and prepared-by signature block.
- **Highlighted Balance Bar:** Full-width bright yellow (`#FFFF00`) highlight bar displaying total current balance (`₱32,208.00`).

### 5. Purchasing & 3-Way Match Fraud Control
- **3-Way Match Control:** Enforces strict matching between Purchase Order Quantity = Goods Receipt (RR) = Vendor Invoice. Hard-blocks over-receiving.
- **Receiving Report (RR Entry) Modal:** Goods receipt verification modal (`ReceivingReportModal`).

### 6. Request for Payment (RFP) Non-PO Expense Vouchers
- Non-PO expense disbursement requests classified by GL Chart of Accounts (`CreateRFPModal`).

### 7. User Setup & COSO Audit Trail
- Multi-user RBAC access matrix and real-time searchable audit action stream (`SystemAuditTrail`).

### 8. Command Palette Search (`⌘K`)
- Power-user keyboard shortcut (`⌘K` / `Ctrl+K`) for instant module navigation.

### 9. Automated 30-Minute Demo State Reset
- Every 30 minutes, demo data automatically resets to clean default seed state. Includes live countdown badge and manual reset override.

### 10. Light Mobile Accessibility Architecture
- Persistent light-mode bottom bar (<768px) with active state pill badges.
- Slide-over mobile drawer (`MobileNavDrawer`) with visual role lock indicators.

---

## 🔒 Role-Based Access Control (RBAC) Matrix

| User Role | Permitted Modules | Approval Permissions | Restricted Modules / Actions |
| :--- | :--- | :--- | :--- |
| **Admin (Bridge)** | All 7 Modules | All Stages (Reviewer, GM, DCS) | None (Full Access) |
| **Chairman (DCS)** | All 7 Modules | All Stages (Reviewer, GM, DCS) | None (Full Access) |
| **General Manager** | All 7 Modules | Stage 1 (Reviewer) & Stage 2 (GM) | Stage 3 DCS Chairman Approval |
| **Bookkeeper** | Overview, SOA, Purchasing, RFP | View Only | Inventory, Quotations, Admin, Approvals |
| **Warehouse** | Inventory, Purchasing | RR Entry Only | Overview, Quotations, SOA, RFP, Admin |
| **Marketing** | Overview, Quotations | Stage 1 (Reviewer) Only | Inventory, SOA, Purchasing, RFP, GM/DCS |
| **Sales** | Quotations, Inventory | Create Quotes Only | Overview, SOA, Purchasing, RFP, Admin |

---

## 🛠️ Step-by-Step Manual Deployment Guide for VPS

### Initial Installation & Static Export Build (Containerized Podman)

```bash
# Step 1: Navigate to local project workspace
cd /Users/jk.deguzman/dev/accustanda-bridge-dashboard

# Step 2: Build static export inside isolated disposable Podman container using Node Alpine image
podman run --rm \
  -v "/Users/jk.deguzman/dev/accustanda-bridge-dashboard:/workspace:Z" \
  -v /workspace/.next \
  -v /workspace/node_modules \
  -w /workspace \
  node:current-alpine \
  sh -c "npm ci && npm run build"

# Step 3: Create target web directory on Linux VPS
ssh -p 22 jk@216.75.75.136 "mkdir -p /home/jk/bridge-ph/accustanda-demo"

# Step 4: Sync static export build files to VPS web root
rsync -avz --delete -e "ssh -p 22" \
  /Users/jk.deguzman/dev/accustanda-bridge-dashboard/out/ \
  jk@216.75.75.136:/home/jk/bridge-ph/accustanda-demo/

# Step 5: Format host Caddyfile on VPS & reload Caddy container
ssh -p 22 jk@216.75.75.136 "podman exec caddy caddy fmt /etc/caddy/Caddyfile > /tmp/Caddyfile.tmp && mv /tmp/Caddyfile.tmp /home/jk/caddy/conf/Caddyfile && podman exec caddy caddy reload --config /etc/caddy/Caddyfile"

# Step 6: Purge Bunny CDN Cache
ssh -p 22 jk@216.75.75.136 "bunny-purge"
```

---

## 🛰️ Production VPS Infrastructure Parameters

- **VPS Host:** `jk@216.75.75.136` (Port 22)
- **Web Root Directory:** `/home/jk/bridge-ph/accustanda-demo`
- **Container Caddy Volume:** `Volume=/home/jk/bridge-ph/accustanda-demo:/srv/bridge-ph-accustanda-demo:ro,Z`
- **Caddy Config File:** `/home/jk/caddy/conf/Caddyfile`
- **CDN Purge Utility:** `bunny-purge`
- **GitHub Repository Remote:** `git@github.com:ItsAdventureTime/bridge-accustanda.git` (main branch)

---

© 2026 Accustandard Medical and Diagnostic Supplies Corporation & DelegateOps Business Support Services. All Rights Reserved.
