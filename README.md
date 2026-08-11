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
Enforces a 4-tier approval sequence: `Maker` &rarr; `Reviewer (Marketing)` &rarr; `General Manager (Karen)` &rarr; `DCS Chairman`. Clickable **Document QRN / ID** button badges (`bg-blue-50`, `hover:bg-blue-900`, `FileText` icon) open an expanded **Document Inspector Modal** (`max-w-3xl`, 768px wide) with step-by-step COSO approval timeline tracking.

### 2. Multi-Location Inventory & Barcode Inspection
Tracks inventory across Quezon City and Pampanga warehouses. Clickable **SKU / Barcode** button badges open an expanded **Stock Detail Modal** (`max-w-3xl`, 768px wide) with large GS1 barcode previews, batch FEFO expiry badges, and location metrics.
- **Class 1 (Core Stock):** Reorders stock automatically when levels hit critical thresholds + 10% safety buffer.
- **Class 2 (Controlled Stock):** Slower-moving stock requiring a forecast review before ordering.
- **Class 3 (Short-Expiry / Special):** Blocks supplier PO generation unless directly linked to an approved Customer PO.

### 3. Sales RFQ, Quotation Generator & Marketing ROI Engine
Allows sales officers to log client census data and launch modal quotes (`max-w-3xl`). Submitting quotes soft-reserves stock for 3 days and immediately updates the live **Official Sales Quotation Document Preview**, the quotation selector dropdown, the COSO approval pipeline, and the **Official RFQ Form** (`RFQ Form.pdf` template). Features a Marketing Manager ROI Financial Engine popup where clicking "Apply Calculation to Active Quote" updates unit prices and contract margins in real-time, with an interactive item deletion tool (🗑️) to remove rows and recalculate proposal values live.

### 4. Statement of Account (SOA) & Multi-SOA Check Allocation
Renders official SOA statements matching company templates without `NaN` errors. Includes an interactive multi-SOA check allocation modal tool to dynamically deduct allocated payments from invoice balances, recompute running balances, track unapplied credit, and queue QBO collections.

### 5. Purchasing & 3-Way Match Fraud Control
PO numbers open an expanded **3-Way Match Inspection Modal** (`max-w-3xl`) displaying approved PO quantity vs. Goods Receipt (RR) vs. Vendor Invoice. Hard-blocks over-receiving fraud beyond approved PO limits.

### 6. Non-PO Request for Payment (RFP) Vouchers & Bank Releasing
RFP Voucher IDs open an expanded **Expense Voucher Inspector Modal** (`max-w-3xl`) displaying GL Chart of Accounts picklists and Admin Bank Fund Releasing modal (BDO/Metrobank/BPI).

### 7. User Access Matrix & Dynamic Role Permissions Editor
In User & Audit Logs, user rows open an expanded **User Access Profile & Role Permissions Modal** (`max-w-3xl`). Active **Admin** and **DCS Chairman** roles can edit system roles and toggle module view checkboxes dynamically (enforces read-only restrictions for non-admin roles).

### 8. QuickBooks Online (QBO) Live Sync Queue & Go REST API
Dedicated sync queue drawer (`max-w-4xl`) holding validated transactions (Sales Invoices, Bills, Collections) backed by Go 1.22 REST controllers and PostgreSQL 16 database.

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

## 📌 Repository & Development Workflow Policy

0. **Documentation Synchronization Policy:** Every time code, components, dependencies, scripts, or design specs are changed, all project documentation (`README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `accustandard-developer-handoff.md`, `AGENT_PROMPT.md`, `GO_MIGRATION_PLAN.md`) MUST be updated immediately.
1. **Local Git Commit Protocol:** Local commits must be executed via standard `git` CLI (`git add . && git commit --no-gpg-sign -m "..."`) without triggering SSH keys, passkeys, or GPG signing.
2. **GitHub Remote HTTPS Synchronization Policy:** Local commits must always be kept in 100% continuous synchronization with remote GitHub (`https://github.com/ItsAdventureTime/bridge-accustandard.git`) using `git push origin main` or `gh` CLI over `https` authentication. SSH keys and passkeys are strictly avoided.

---

## 📄 License & Attribution

Copyright © 2026 **Accustandard Medical and Diagnostic Supplies Corporation** & **DelegateOps Business Support Services**. All rights reserved.
