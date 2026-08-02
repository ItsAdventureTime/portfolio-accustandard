# Accustanda Rx D Enterprise ERP & Supply Chain Dashboard v4.0

> **Accustanda Medical and Diagnostic Supplies Corporation**  
> Partner Agency: **DelegateOps Business Support Services (DOS)**  
> Production Platform & Interactive Internal Control Simulator

---

## 🌟 Executive Summary & Overview

The **Accustanda Rx D Enterprise ERP Dashboard** is a COSO control-first, multi-location medical supply chain and financial management system. Designed for **Accustanda Medical and Diagnostic Supplies Corporation**, this dashboard enforces strict segregation of duties across warehouse operations (Quezon City & Pampanga), sales quotation routing, receiving report 3-way matching, client aging statement of account (SOA) ledgers, non-PO expense management, and QuickBooks Online (QBO) live synchronization.

---

## 🎨 2026 Anti-Glare Soft Slate & IBM Carbon v11 Decluttered Design System

In accordance with **IBM Carbon Design System (v11)** and 2026 enterprise digital ergonomics guidelines, the application features an **Anti-Glare Soft Slate Palette** (`#e2e8f0` canvas, `#ffffff` card containers, `#cbd5e1` borders, and `#1e293b` dark slate text).

### Core IBM Carbon Decluttering Principles Applied:
- **Streamlined Visual Hierarchy:** Top priority metrics occupy the top 4 crisp IBM Carbon tiles (Managed Inventory, Pending Approvals, SOA Balance, QBO Live Sync).
- **Progressive Disclosure:** Non-essential background noise is hidden behind clean interactive actions and modal drawers.
- **Cognitive Load Reduction:** Purposeful white space and subtle border strokes prevent visual overwhelm during long operational shifts.
- **Predictable Wayfinding Navigation:** Single-tier header lockup paired with contextual breadcrumbs and `⌘K` command palette search.

### Brand Lockup Specifications
Matching `photo_2026-08-01_23-55-07.jpg`:
- **Brand Title:** `ACCUSTANDA` in bold Royal Blue (`#1E3A8A`)
- **Rx D Accent:** `R` in Red with italic `x` and Royal Blue `D`
- **Horizontal Bar:** Solid red divider line
- **Tagline Subtext:** `MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION`

---

## 🚀 Key Modules & Interactive Features

### 1. Executive Overview & COSO Approval Queue
- **4-Layer Approval Pipeline:** Enforces COSO Segregation of Duties (`Layer 1: Maker` → `Layer 2: Reviewer (Marketing)` → `Layer 3: GM (Karen)` → `Layer 4: DCS (Chairman)`).
- **Interactive Role Simulator ("View As"):** Allows impersonation of 7 roles (`Admin`, `Chairman`, `GM`, `Bookkeeper`, `Warehouse`, `Marketing`, `Sales`) to test authorization workflows.
- **KPI Metrics & SVG Sparklines:** Real-time stock volume, pending approval counts, and gross margin tracking.

### 2. Multi-Location Inventory Control
- Multi-warehouse stock tracking across **Quezon City** and **Pampanga** facilities.
- **Batch FEFO Expiry Management:** Tracks lot numbers and flags near-expiry reagents (e.g. 2026-09-15).
- **Mobile Barcode Scanner Integration:** High-speed barcode scanning via device camera.
- **Interactive Stock CRUD:** Ability to add new stock batches and remove items with live metric recalculations.

### 3. Sales Quotation Generator & 3-Day Stock Reservation
- Generates official Sales Quotations matching `photo_2026-08-01_23-55-26.jpg`.
- **3-Day Stock Reservation Rule:** Auto-reserves inventory items upon quotation creation.
- **Print / PDF Export:** Generates clean, uncompressed A4 printable PDF documents.

### 4. Statement of Account (SOA) & Client Aging
- Renders client SOA statements matching `photo_2026-08-01_23-55-13.jpg`.
- Tracks Delivery Receipt (DR #) numbers, Sales Invoice (SI #) numbers, payment terms, and aging buckets (0-30 days, 31-60 days, 61-90 days, 90+ days).
- **Interactive Invoice Line Adder:** Dynamic addition and deletion of invoice rows with auto-calculated running balances.

### 5. Purchasing & 3-Way Match Fraud Control
- **PO Over-Receiving Hard-Block Rule:** Receiving is hard-blocked beyond approved Purchase Order quantities to prevent vendor over-billing fraud.

### 6. Command Palette Navigation (`⌘K`)
- **Power-User Navigation (`⌘K` / `Ctrl+K`):** Search any module, SKU, or document to jump instantly.

### 7. 30-Minute Automated Demo State Reset System
- **Automated Demo Reset:** Every 30 minutes, demo data automatically resets to clean default seed state.
- **Live Countdown Header Badge:** Visual countdown timer in top shell header with instant "Reset Data" manual override.

### 8. Mobile Radical Reachability Architecture
- **Persistent Mobile Bottom Bar:** Optimized for single-thumb mobile operation (`<768px`).
- **Slide-Over Navigation Drawer:** Full menu access on mobile screens.
- **Mobile Table-to-Card View:** Data tables automatically transform into spacious mobile cards on phone viewports.
- **Pixel-Perfect Mobile PDF Preview:** Fixed A4 canvas width prevents text squishing or address column wrapping on mobile screens.

---

## 🛠️ Podman Ephemeral Container Build & VPS Deployment

Deploying to target VPS (`jk@216.75.75.136:22` at `/var/www/accustanda-bridge`) with Bunny CDN cache purging:

```bash
# 1. Install Dependencies locally
npm install

# 2. Ephemeral Podman Container Build & Initial Remote VPS Installation
npm run deploy:install
# (Runs Podman container build with --rm self-destruction, creates remote directories, syncs via rsync SSH, and triggers bunny-purge)

# 3. Ephemeral Podman Container Build & Fast Remote Update
npm run deploy:update
# (Re-builds static export inside container, syncs delta via rsync, and purges Bunny CDN cache)
```

---

## 🛰️ Subpath Deployment URLs

- **VPS Server Host:** `jk@216.75.75.136` (Port 22)
- **Deployment Directory:** `/var/www/accustanda-bridge`
- **CDN Purge Utility:** `bunny-purge`
- **Git Remote:** `git@github.com:ItsAdventureTime/bridge-accustanda.git` (main branch)

---

© 2026 Accustanda Medical and Diagnostic Supplies Corporation & DelegateOps Business Support Services. All Rights Reserved.
