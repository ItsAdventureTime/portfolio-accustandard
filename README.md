# Accustandard Medical ERP & Supply Chain Dashboard

Welcome to the **Accustandard Medical ERP Dashboard**, built for **Accustandard Medical and Diagnostic Supplies Corporation** in partnership with **DelegateOps Business Support Services (DOS)**.

This application is a control-first medical supply chain and internal financial platform. It enforces strict segregation of duties across warehouse operations (Quezon City & Pampanga), sales quotations, receiving report 3-way matching, client aging statement of account (SOA) ledgers, non-PO expense management, and live QuickBooks Online (QBO) queue synchronization.

---

## 💡 Why This Platform Was Built

Medical supply chain operations handle high-value equipment, sensitive diagnostic reagents, and FEFO expiry constraints. Generic off-the-shelf software often lacks strict internal controls. Accustandard ERP solves this by embedding COSO internal control principles directly into everyday workflows:

- **No Self-Approvals:** A user who creates a quote, purchase order, or expense request cannot approve it.
- **3-Way Matching:** Receiving reports automatically verify Purchase Order quantities against Vendor Invoices to block over-receiving.
- **3-Day Soft Inventory Reservations:** Quotations reserve physical stock for 3 days before automatically releasing it if unconfirmed.
- **Audit Logging:** Every approval, override, and state change records a permanent audit trail.

---

## 🎨 Design & User Experience

The dashboard uses a **Light Corporate Medical System**:
- **Canvas:** Crisp `#F8FAFC` slate background
- **Cards:** Clean `#FFFFFF` container cards with `#E2E8F0` borders
- **Primary Brand Color:** Deep Royal Navy (`#1E3A8A`)
- **Accent Color:** Bright Medical Red (`#DC2626`)
- **Ergonomics:** Responsive on mobile devices with touch-friendly barcode scanning and clear role lock indicators.

---

## 🛠️ Main Features & Modules

### 1. Executive Control & COSO Approval Pipeline
Enforces a 4-tier approval sequence: `Maker` &rarr; `Reviewer (Marketing)` &rarr; `General Manager (Karen)` &rarr; `DCS Chairman`.

### 2. Demand & Replenishment Planner
Tracks inventory across Quezon City and Pampanga warehouses based on 3 distinct product classes:
- **Class 1 (Core Stock):** Reorders stock automatically when levels hit critical thresholds + 10% safety buffer.
- **Class 2 (Controlled Stock):** Slower-moving stock requiring a forecast review before ordering.
- **Class 3 (Short-Expiry / Special):** Blocks supplier PO generation unless directly linked to an approved Customer PO.

### 3. Sales RFQ & Marketing ROI Engine
Allows sales officers to log client census data and LIS connectivity needs, while providing Marketing Managers with a side-by-side ROI calculator to evaluate landed costs, overheads, and contract margins.

### 4. Statement of Account (SOA) & Payment Allocation
Renders official SOA statements matching company templates and includes a multi-SOA check allocation tool to distribute single check payments across multiple open invoices.

### 5. QuickBooks Online (QBO) Live Sync Queue
A dedicated sync queue drawer that holds control-validated transactions (Sales Invoices, Bills, Collections, COGS) until pushed to QuickBooks Online.

---

## 👥 Role-Based Access Control (RBAC)

The app supports 7 distinct user roles, each with specific navigation and approval permissions:

| User Role | Permitted Modules | Approval Level | Restricted Actions |
| :--- | :--- | :--- | :--- |
| **Admin (Bridge)** | All 7 Modules | All Stages | None (Full Access) |
| **Chairman (DCS)** | All 7 Modules | All Stages | None (Full Access) |
| **General Manager** | All 7 Modules | Stage 1 & Stage 2 (GM) | Stage 3 DCS Chairman Approval |
| **Bookkeeper** | Overview, SOA, Purchasing, RFP | View Only | Modifying Inventory & Quotations |
| **Warehouse** | Inventory, Purchasing | RR Entry Only | Overview, Quotations, SOA, RFP |
| **Marketing** | Overview, Quotations | Stage 1 (Reviewer) & ROI | Inventory, SOA, Purchasing, RFP |
| **Sales** | Quotations, Inventory | Create RFQ / Quotes Only | Overview, SOA, Purchasing, RFP |

---

## 🔒 Caddyfile Formatting & Validation Protocol

Before reloading Caddy reverse proxy configurations, always validate and auto-format the `Caddyfile` using official Caddy CLI commands:

```bash
# Auto-format Caddyfile in place (fixes indentation and syntax formatting)
caddy fmt --overwrite Caddyfile

# Validate Caddyfile configuration syntax without launching server
caddy validate --config Caddyfile
```

---

## 🚀 Git & Repository Workflow Standard

To maintain consistent commit history and security across local and remote environments:

1. **Local Commits:** Always use local `git` CLI with SSH commit signing enabled.
   ```bash
   git add .
   git commit -S -m "feat(module): describe your clear change"
   ```

2. **Remote Commits & Synchronization:** Always use the official GitHub CLI (`gh`) over **HTTPS** (default authenticated user `ItsAdventureTime`).
   ```bash
   # HTTPS Remote Repository URL
   https://github.com/ItsAdventureTime/bridge-accustandard.git

   # Push changes via GitHub CLI / HTTPS protocol
   git push origin main
   ```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or 20+
- npm 9+
- GitHub CLI (`gh`) authenticated via HTTPS

### Setup Commands
```bash
# 1. Clone the repository over HTTPS using GitHub CLI
gh repo clone ItsAdventureTime/bridge-accustandard
cd bridge-accustandard

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to test the interactive dashboard.

---

## 🐳 Building with Podman (Disposable Container)

To test production static builds safely inside an isolated container:

```bash
podman run --rm \
  -v "$(pwd):/workspace:Z" \
  -v /workspace/.next \
  -v /workspace/node_modules \
  -w /workspace \
  node:current-alpine \
  sh -c "npm ci && npm run build"
```

---

## 🛰️ Production & Demo VPS Deployment

### Infrastructure Configuration
- **VPS Host:** `jk@216.75.75.136`
- **Local Workspace:** `/Users/jk.deguzman/dev/accustandard-bridge-dashboard`
- **GitHub Repository Remote (HTTPS):** `https://github.com/ItsAdventureTime/bridge-accustandard.git`
- **Production Path:** `/home/jk/bridge-ph/accustandard`
- **Demo Path:** `/home/jk/bridge-ph/accustandard-demo`

### Deploying Updates to VPS
```bash
# Step 1: Run static export inside Podman container
podman run --rm \
  -v "$(pwd):/workspace:Z" \
  -v /workspace/.next \
  -v /workspace/node_modules \
  -w /workspace \
  node:current-alpine \
  sh -c "npm ci && npm run build"

# Step 2: Run VPS migration, formatting, and validation script
ssh -p 22 jk@216.75.75.136 'bash -s' < scripts/vps-rename-accustandard.sh

# Step 3: Deploy static export files to Demo site
rsync -avz --delete -e "ssh -p 22" \
  out/ \
  jk@216.75.75.136:/home/jk/bridge-ph/accustandard-demo/

# Step 4: Deploy static export files to Production site
rsync -avz --delete -e "ssh -p 22" \
  out/ \
  jk@216.75.75.136:/home/jk/bridge-ph/accustandard/
```

---

## 📄 License & Attribution

Copyright © 2026 **Accustandard Medical and Diagnostic Supplies Corporation** & **DelegateOps Business Support Services**. All rights reserved.
