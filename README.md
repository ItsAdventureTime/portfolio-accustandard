# Accustandard Medical ERP & Supply Chain Dashboard

Welcome to the **Accustandard Medical ERP Dashboard**, built for **Accustandard Medical and Diagnostic Supplies Corporation** in partnership with **DelegateOps Business Support Services (DOS)**.

This application is a control-first medical supply chain and internal financial platform. It enforces strict segregation of duties across warehouse operations (Quezon City & Pampanga), sales quotations, receiving report 3-way matching, client aging statement of account (SOA) ledgers, non-PO expense management, and live QuickBooks Online (QBO) queue synchronization.

---

## 🌐 Live Demo System URL

- **Live Demo Site:** [https://delegateops.business/accustandard/demo](https://delegateops.business/accustandard/demo)

*(Note: Production builds are put on hold until the Demo site is fully reviewed and approved by leadership.)*

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

Before reloading rootless Podman `caddy.service`, always validate and auto-format the `Caddyfile` using official Caddy CLI commands:

```bash
# Auto-format Caddyfile in place via rootless Podman
podman exec caddy caddy fmt --overwrite /etc/caddy/Caddyfile

# Validate Caddyfile configuration syntax inside container
podman exec caddy caddy validate --config /etc/caddy/Caddyfile
```

---

## 🚀 Git Local & GitHub CLI (`gh`) Remote Standard

To strictly separate local version control from remote GitHub repository management:

1. **Local Commits:** Use **ONLY** local `git` CLI commands (no SSH key requirement).
   ```bash
   git add .
   git commit -m "type(scope): clear description of change"
   ```

2. **Remote Commit & Synchronization:** ALWAYS use official GitHub CLI (`gh`) commands over **HTTPS** (`https://github.com/ItsAdventureTime/bridge-accustandard.git`), authenticated via default `gh auth` credentials (`ItsAdventureTime`). NEVER use `git` commands for remote operations.
   ```bash
   # Synchronize remote repository state via GitHub CLI
   gh repo sync

   # Create Pull Requests or manage remote state
   gh pr create --fill
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

To test static builds safely inside an isolated container:

```bash
podman run --rm \
  -v "$(pwd):/workspace:Z" \
  -v /workspace/.next \
  -v /workspace/node_modules \
  -w /workspace \
  node:24-alpine \
  sh -c "npm ci && npm run build"
```

---

## ⚡ 1-Command Automated Demo Deployment

To build static files in an isolated Podman container, configure Quadlets, auto-format/validate Caddy, and sync static assets to the Demo VPS in **1 single command**:

```bash
# Option A: Run via npm script
npm run deploy:demo

# Option B: Run shell script directly
./scripts/deploy-demo.sh
```

### Infrastructure Path Configuration
- **VPS Host:** `jk@216.75.75.136`
- **Live Demo Site URL:** [https://delegateops.business/accustandard/demo](https://delegateops.business/accustandard/demo)
- **GitHub Remote (HTTPS):** `https://github.com/ItsAdventureTime/bridge-accustandard.git`
- **Demo Web Root Path:** `/home/jk/bridge-ph/accustandard-demo/`
- **Demo Quadlet Systemd Path:** `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`
- **Caddy Service:** `caddy.service` (Rootless Podman Quadlet in `~/.config/containers/systemd/`)

---

## 📄 License & Attribution

Copyright © 2026 **Accustandard Medical and Diagnostic Supplies Corporation** & **DelegateOps Business Support Services**. All rights reserved.
