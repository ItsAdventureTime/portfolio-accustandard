# Accustandard Medical ERP & Supply Chain Dashboard

Welcome to the **Accustandard Medical ERP Dashboard**, built for **Accustandard Medical and Diagnostic Supplies Corporation** in partnership with **DelegateOps Business Support Services (DOS)**.

This application is a control-first medical supply chain and internal financial platform. It is designed around strict segregation of duties across warehouse operations (Quezon City & Pampanga), sales quotations, receiving report controls, client aging statement of account (SOA) ledgers, non-PO expense management, and a QuickBooks Online (QBO) export queue.

**Runtime qualification:** This repository is an incremental demo migration,
not an accepted production ERP. The Go API currently provides a limited
server-backed surface; several workflow screens remain local preview paths.
QBO behavior is a queue/demo stub, not a live QuickBooks Online connection.
See [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) for the audited
boundary and validation record.

## Documentation authority

Read documents in this order when requirements conflict:

1. `STYLE_GUIDE.md` for current writing and terminology standards.
2. `IMPLEMENTATION_STATUS.md` for the verified runtime boundary.
3. `AccuStandard_Developer_Correction_and_Acceptance_Test_Handoff.md` for the acceptance contract.
4. `AccuStandard_Developer_Handoff_UPDATED.md` for the product handoff.
5. `accustandard-webapp-spec.md`, `accustandard-erp-lite-blueprint.md`, and `GO_MIGRATION_PLAN.md` for supporting specification and target architecture.

Historical prompts, generic LLM references, the prior handoff, meeting
transcript, and dated feedback are kept in `to-review-and-delete/` for manual
retention or deletion review; they are not active instructions.

---

## 🌐 Live Demo System URL

- **Live Demo Site:** [https://delegateops.business/accustandard/demo](https://delegateops.business/accustandard/demo)

*(Note: Production builds are put on hold until the Demo site is fully reviewed and approved by leadership.)*

---

## 💡 Why This Platform Was Built

Medical supply chain operations handle high-value equipment, sensitive diagnostic reagents, and FEFO expiry constraints. Generic off-the-shelf software often lacks strict internal controls. Accustandard ERP solves this by embedding COSO internal control principles directly into everyday workflows:

- **No Self-Approvals:** A user who creates a quote, purchase order, or expense request cannot approve it.
- **3-Way Match target:** The design verifies Purchase Order quantities against receiving and vendor-invoice evidence; the current Go demo hard-blocks over-receipt, while vendor-invoice matching remains an identified implementation gap.
- **3-Day Reservation target:** The quotation UI models a 3-day soft reservation; server-side reservation expiry remains an implementation gap.
- **Audit Logging:** Server-backed mutations expose audit records where implemented; acceptance-grade completeness remains unverified.

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
Enforces the configured maker-checker approval sequence. Purchase Orders use `Purchasing` &rarr; `Accounting` &rarr; `General Manager` &rarr; optional rule-triggered `DCS Chairman`; RFPs use `Maker` &rarr; `General Manager` &rarr; optional rule-triggered `DCS Chairman`; Sales Quotes stop at GM, then require client acceptance evidence before fulfillment. Clickable **Document QRN / ID** button badges (`bg-blue-50`, `hover:bg-blue-900`, `FileText` icon) open an expanded **Document Inspector Modal** (`max-w-3xl`, 768px wide) with step-by-step COSO approval timeline tracking.

### 2. Multi-Location Inventory & Barcode Inspection
Tracks inventory across Quezon City and Pampanga warehouses. Clickable **SKU / Barcode** button badges open an expanded **Stock Detail Modal** (`max-w-3xl`, 768px wide) with large GS1 barcode previews, batch FEFO expiry badges, and location metrics.
- **Class 1 (Core Stock):** Reorders stock automatically when levels hit critical thresholds + 10% safety buffer.
- **Class 2 (Controlled Stock):** Slower-moving stock requiring a forecast review before ordering.
- **Class 3 (Short-Expiry / Special):** Blocks supplier PO generation unless directly linked to an approved Customer PO.

### 3. Sales RFQ, Quotation Generator & Marketing ROI Engine
Allows sales officers to log client census data and launch modal quotes (`max-w-3xl`). The current runtime persists the RFQ through the Go API when connected; quotation approval, reservation expiry, client acceptance, and invoice generation remain UI preview paths pending server implementation. The UI includes the official quotation/RFQ previews, interactive SKU selection, custom row tools, and Marketing ROI calculations.

### 4. Statement of Account (SOA) & Multi-SOA Check Allocation
Renders official SOA statements matching company templates without `NaN` errors. Includes a client selector (`Gatchalian Medical Lab`, `ACE Medical Center`, `Pampanga Regional Hospital`, `Quezon City Diagnostic Center`), local preview tools for invoice add/edit/delete, live balance recalculation, and a server-backed multi-SOA check allocation endpoint when the Go API is connected. QBO collection posting remains a queue/demo stub.

### 5. Purchasing & 3-Way Match Fraud Control
PO numbers open an expanded **3-Way Match Inspection Modal** (`max-w-3xl`) displaying approved PO quantity vs. Goods Receipt (RR) vs. Vendor Invoice. Hard-blocks over-receiving fraud beyond approved PO limits.

### 6. Non-PO Request for Payment (RFP) Vouchers & Bank Releasing
RFP Voucher IDs open an expanded **Expense Voucher Inspector Modal** (`max-w-3xl`) displaying GL Chart of Accounts picklists and Admin Bank Fund Releasing modal (BDO/Metrobank/BPI).

### 7. User Access Matrix & Role Permissions Editor
In User & Audit Logs, user rows open an expanded **User Access Profile & Role Permissions Modal** (`max-w-3xl`). Active **Admin** and **DCS Chairman** roles can edit system roles and toggle module-view checkboxes; non-admin roles remain read-only.

### 8. QuickBooks Online (QBO) Export Queue & Go REST API
Dedicated queue drawer (`max-w-4xl`) holding validated demo transactions
backed by Go REST controllers and PostgreSQL 16. Direct QBO API integration
remains future scope.

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

## 🚀 GitHub CLI (`gh`) Remote Standard

Remote synchronization uses only the official GitHub CLI (`gh`) over
authenticated HTTPS. Do not use `git push`, SSH remotes, passkeys, or SSH
keys for remote work.
   ```bash
   gh auth status
   gh repo view ItsAdventureTime/bridge-accustandard

   gh repo sync ItsAdventureTime/bridge-accustandard
   gh pr create --fill
   ```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20.9+ (Node.js 24 is used by the remote build container)
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

## 🐳 Remote VPS Build Policy

The deployment procedure performs no local build, compilation, or application
execution. Source is synchronized to the VPS, where the frontend is built in a
disposable container and the backend image is built for the existing Quadlet:

```bash
podman run --rm --userns=keep-id \
  -v "/home/jk/bridge-ph/accustandard-demo/source:/workspace:Z" \
  -v /workspace/node_modules \
  -v /workspace/.next \
  -w /workspace \
  node:24-alpine \
  sh -lc "npm ci && npm run build"
```

`--rm` removes the temporary frontend build container after it exits. The Go
runtime image is intentionally retained because the Quadlet references it as
`localhost/accustandard-bridge-backend:demo`.

---

## ⚡ 1-Command Automated Demo Deployment

To synchronize source, build remotely, publish the static export, install the
demo Quadlets, and restart only the demo API in **1 single command**:

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
- **Remote Build Source:** `/home/jk/bridge-ph/accustandard-demo/source/`
- **Static Export Root:** `/home/jk/bridge-ph/accustandard-demo/web-dist/`
- **Demo Quadlet Systemd Path:** `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`
- **Caddy Service:** `caddy.service` (Rootless Podman Quadlet in `~/.config/containers/systemd/`)

---

## 📌 Repository & Development Workflow Policy

0. **Documentation Synchronization Policy:** Update `IMPLEMENTATION_STATUS.md`
   and every affected source-of-truth document when code, components,
   dependencies, scripts, or design specs change. Do not copy an acceptance
   PASS claim without current evidence.
1. **Remote synchronization:** Use only `gh` over authenticated HTTPS. Do not
   use `git push`, SSH remotes, passkeys, or SSH keys for remote work.

---

## 📄 License & Attribution

Copyright © 2026 **Accustandard Medical and Diagnostic Supplies Corporation** & **DelegateOps Business Support Services**. All rights reserved.

## 2026 Implementation Baseline

- The browser hydrates operational lists from `/accustandard/demo/api/v1` and keeps deterministic seed data only as an offline rendering fallback.
- Sales Quotes route Sales Officer → Marketing Reviewer → General Manager; DCS is not a Sales Quote approval stage.
- Goods Receipt over-receiving is hard-blocked, and a fully received PO remains `AWAITING_VENDOR_INVOICE` until the vendor invoice is matched.
- Desktop navigation supports a collapsed icon rail; mobile navigation remains thumb-zone oriented below 1024px.

## 2026 Repository Audit Status

The repository is in an incremental migration, not yet a complete acceptance
release. The deployed runtime is the Go API in `backend/cmd/server` plus the
Next.js static export; the older `backend/main.go` server and Drizzle schema
remain legacy artifacts and are not the demo runtime source of truth.

The current API covers inventory reads/receiving, RFQs, approval records, SOA
allocation, purchase orders, RFPs, QBO queue records, and audit-log reads. The
independent quotation, client-acceptance, ROI, vendor-invoice/3-way-match,
delivery/invoice, admin-master, export, attachment, idempotency, and full
server-side role-queue workflows required by the handoff still need backend
implementation and acceptance tests. UI-only state or deterministic fallback
data must not be reported as authoritative persistence.

See [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) for the concise
runtime boundary and validation record.

The acceptance matrix in
`AccuStandard_Developer_Correction_and_Acceptance_Test_Handoff.md` is retained
as a historical contract and explicitly marked **UNVERIFIED** pending a
deployed Go/PostgreSQL test run.
