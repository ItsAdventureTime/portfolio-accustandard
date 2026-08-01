# Accustanda Rx D Enterprise ERP & Supply Chain Dashboard v4.0

> **Accustanda Medical and Diagnostic Supplies Corporation**  
> Partner Agency: **DelegateOps Business Support Services (DOS)**  
> Production Platform & Interactive Internal Control Simulator

---

## 🌟 Executive Summary & Overview

The **Accustanda Rx D Enterprise ERP Dashboard** is a COSO control-first, multi-location medical supply chain and financial management system. Designed for **Accustanda Medical and Diagnostic Supplies Corporation**, this dashboard enforces strict segregation of duties across warehouse operations (Quezon City & Pampanga), sales quotation routing, receiving report 3-way matching, client aging statement of account (SOA) ledgers, non-PO expense management, and QuickBooks Online (QBO) live synchronization.

---

## 🎨 2026 Anti-Glare Soft Slate Design System

In accordance with 2026 enterprise digital ergonomics guidelines, the application features an **Anti-Glare Soft Slate Middle-Ground Palette** (`#e2e8f0` canvas, `#ffffff` card containers, `#cbd5e1` borders, and `#1e293b` dark slate charcoal text). This design absorbs screen glare, reduces eye strain during long operational shifts, and keeps high-contrast visual hierarchy for desktop and mobile devices.

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

### 7. Mobile Radical Reachability Architecture
- **Persistent Mobile Bottom Bar:** Optimized for single-thumb mobile operation (`<768px`).
- **Slide-Over Navigation Drawer:** Full menu access on mobile screens.
- **Mobile Table-to-Card View:** Data tables automatically transform into spacious mobile cards on phone viewports.
- **Pixel-Perfect Mobile PDF Preview:** Fixed A4 canvas width prevents text squishing or address column wrapping on mobile screens.

---

## 🛠️ Local Development & Demo Deployment

```bash
# 1. Install Dependencies
npm install

# 2. Run Next.js Development Server
npm run dev

# 3. Build Production Static Export (out/)
npm run build

# 4. Launch Sandboxed Static Server (http://127.0.0.1:3000)
node server.js
```

---

## 🛰️ Subpath Deployment URLs

- **Demo Server:** `https://delegateops.business/accustanda/demo`
- **Production Server:** `https://delegateops.business/accustanda`
- **Git Repository:** `git@github.com:ItsAdventureTime/bridge-accustanda.git` (main branch)

---

© 2026 Accustanda Medical and Diagnostic Supplies Corporation & DelegateOps Business Support Services. All Rights Reserved.
