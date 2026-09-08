# Accustandard Medical ERP & Supply Chain Dashboard

Welcome to the **Accustandard Medical ERP Dashboard**, built for **Accustandard Medical and Diagnostic Supplies Corporation** in partnership with **DelegateOps Business Support Services (DOS)**.

This application is a control-first medical supply chain and internal financial platform. It is designed around strict segregation of duties across warehouse operations (Quezon City & Pampanga), sales quotations, receiving report controls, client aging statement of account (SOA) ledgers, non-PO expense management, and a QuickBooks Online (QBO) export queue.

**Runtime qualification:** This repository is an incremental demo migration,
not an accepted production ERP. The Go API currently provides a limited
server-backed surface; several workflow screens remain local preview paths.
QBO behavior is a queue/demo stub, not a live QuickBooks Online connection.
There is no real login or server-side user session in this demo. Protected
API routes accept a valid `X-Demo-Role` only while `APP_ENV=demo`; this is a
forgeable demo boundary, not user identity. The role selector is a clearly
labeled UI-only simulation; shared client-side permissions filter navigation,
operations, queues, and badges, but they do not secure backend APIs. Trusted
production authentication and server-enforced authorization remain unresolved
requirements, and non-demo protected routes fail closed.
See [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) for the audited
boundary and validation record.

**Source of truth:** [`implementation_plan.md`](implementation_plan.md) governs
UI/UX scope; the confirmed acceptance handoff governs business rules;
[`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) governs actual runtime
status; this README plus `ARCHITECTURE.md` and `CONTRIBUTING.md` govern
operations. The visual and accessibility rules are maintained in
[`UI_UX_ACCESSIBILITY_GUIDE.md`](UI_UX_ACCESSIBILITY_GUIDE.md).

---

## 🌐 Live Demo System URL

- **Live Demo Site:** [https://accustandard.delegateops.business/](https://accustandard.delegateops.business/)

This URL is a demo environment only. It is not a production release or proof
that incomplete backend controls are complete.

---

## 💡 Why This Platform Was Built

Medical supply chain operations handle high-value equipment, sensitive diagnostic reagents, and FEFO expiry constraints. Generic off-the-shelf software often lacks strict internal controls. Accustandard ERP solves this by embedding COSO internal control principles directly into everyday workflows:

- **No Self-Approvals:** A user who creates a quote, purchase order, or expense request cannot approve it.
- **3-Way Match target:** The design verifies Purchase Order quantities against receiving and vendor-invoice evidence; the current Go demo hard-blocks over-receipt, while vendor-invoice matching remains an identified implementation gap.
- **3-Day Reservation target:** The quotation UI models a 3-day soft reservation; server-side reservation expiry remains an implementation gap.
- **Audit Logging:** Server-backed mutations expose audit records where implemented; acceptance-grade completeness remains unverified.

---

## 🎨 Design & User Experience

The dashboard uses a **Light Corporate Medical System** anchored to the
provided AccuStandard wordmark at
`public/photo_2026-08-01_23-55-07.jpg`:
- **Canvas:** Anti-glare `#F4F7FB` with white data surfaces
- **Primary Brand Color:** AccuStandard navy (`#17356F`) and royal (`#2C4296`)
- **Signature Accent:** Rx red (`#B4232F`) for attention states and brand cues
- **Ergonomics:** Role-tailored action cards, 44px-class touch targets, visible
  keyboard focus, readable 16px screen text, colored attention surfaces,
  reduced-motion support, and responsive mobile navigation.
- **Status:** API connectivity is always explicit; offline demo behavior is
  labeled and is never presented as persisted business data.

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
Allows sales officers to log client census data and launch modal quotes (`max-w-3xl`). The current runtime persists the RFQ through the Go API when connected; quotation approval, reservation expiry, client acceptance, and invoice generation remain UI preview paths pending server implementation. The UI includes the official quotation/RFQ previews, dynamic SKU selections, custom row tools, and Marketing ROI calculations.

### 4. Statement of Account (SOA) & Multi-SOA Check Allocation
Renders official SOA statements matching company templates without `NaN` errors. Includes a dynamic client selector (`Gatchalian Medical Lab`, `ACE Medical Center`, `Pampanga Regional Hospital`, `Quezon City Diagnostic Center`), local preview tools for invoice add/edit/delete, live recalculation of balances, and a server-backed multi-SOA check allocation endpoint when the Go API is connected. QBO collection posting remains a queue/demo stub.

### 5. Purchasing & 3-Way Match Fraud Control
PO numbers open an expanded **3-Way Match Inspection Modal** (`max-w-3xl`) displaying approved PO quantity vs. Goods Receipt (RR) vs. Vendor Invoice. Hard-blocks over-receiving fraud beyond approved PO limits.

### 6. Non-PO Request for Payment (RFP) Vouchers & Bank Releasing
RFP Voucher IDs open an expanded **Expense Voucher Inspector Modal** (`max-w-3xl`) displaying GL Chart of Accounts picklists and Admin Bank Fund Releasing modal (BDO/Metrobank/BPI).

### 7. User Setup & Audit Trail
User & Audit Logs provides the current demo's local user/module matrix and
audit stream. Its role and module controls are preview behavior only; they do
not create authenticated sessions or enforce backend authorization.

### 8. QuickBooks Online (QBO) Export Queue & Go REST API
Dedicated queue drawer (`max-w-4xl`) holding validated demo transactions
backed by Go REST controllers and PostgreSQL 17. Direct QBO API integration
remains future scope.

---

## 👥 Role-Based Access Control (RBAC)

The app supports 7 distinct user roles, each with specific navigation and approval permissions:

The role selector is a demo simulation. `src/lib/permissions.ts` is the shared
typed client-side model for allowed tabs, operation helpers (create, export,
import, QBO, barcode, scanner, PWA, and admin), approval queues, and
role-scoped badges. These UI checks are not an API security boundary.

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

## 🚀 Demo deployment

The only active deployment path is the manual image workflow in
[`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md): build and export the API and
frontend images in the Docker Sandbox, load them into OrbStack, and run the
image-only Compose project behind the existing Cloudflare Tunnel at
`https://accustandard.delegateops.business`.

There are no automated builds or deployments. Do not use the historical VPS,
Caddy, Podman Quadlet, SSH, or `npm run deploy:demo` procedures for the active
demo. The guide documents the required `orbstack` context, file-based Compose
secret, internal network boundary, and rollback steps.

---

## 🚀 GitHub CLI (`gh`) Remote Standard

Follow [`PROJECT_UPDATE_STANDARD.md`](PROJECT_UPDATE_STANDARD.md) for the
recurring update sequence and [`GITHUB_HTTPS_WORKFLOW.md`](GITHUB_HTTPS_WORKFLOW.md)
for the canonical remote protocol. Local staging and commits use local Git
because `gh` has no local commit command; remote GitHub publication uses the
authenticated `gh api` Git Database endpoints over HTTPS. There is no separate
`gh push` command. Never use SSH remotes, SSH keys, `gh ssh-key`, passkeys, or
direct `git push` for GitHub repository operations. VPS deployment transfer is a
separate historical workflow; current demo deployment is documented in
[`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md).

```bash
gh auth status --active --hostname github.com
gh config set git_protocol https --host github.com
gh auth setup-git --hostname github.com
git remote set-url origin https://github.com/ItsAdventureTime/portfolio-accustandard.git
git remote get-url origin
```

---

## 🐳 Build and runtime boundary

Use [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) for the complete manual
procedure and [`ARCHITECTURE.md`](ARCHITECTURE.md) for the current network
boundary. The Docker Sandbox builds the two images; OrbStack runs those images
with PostgreSQL on the internal network. No service publishes a host port, and
the frontend is the only service attached to `cloudflared-network`.

### Frontend font and network contract

Outfit is vendored at `src/app/fonts/Outfit-Variable.woff2` under the SIL Open
Font License 1.1, with its license and provenance record beside the asset.
`next/font/local` preserves the existing `--font-outfit` variable, so the
frontend build no longer needs Google Fonts CSS or font data.

The local sandbox needs network access for `npm ci` and Docker image pulls. The
release build must not request Google Fonts or rely on a `next/font/google`
import because Outfit is vendored and loaded with `next/font/local`.

```bash
jk-sbx-project ensure
jk-sbx-project exec npm ci --no-audit --no-fund
jk-sbx-project exec npm run lint
jk-sbx-project exec npx tsc --noEmit --incremental false
jk-sbx-project exec npm run build
```

The `build` script uses Next's official `--webpack` opt-out. Next.js 16 uses
Turbopack by default, but the current Docker Sandbox resource profile has the
Webpack path as the verified static-export contract. Revisit this fallback
after a deliberate sandbox validation confirms the resource and output
contract.

The Compose and Dockerfile paths intentionally use floating official Alpine
tags: `golang:alpine`, `alpine:latest`, `node:lts-alpine`, `nginx:alpine`, and
`postgres:alpine`. Rebuild with `--pull` to receive upstream patches. Floating
tags improve update freshness but do not provide reproducible builds; record
resolved image digests when a repeatable demo snapshot matters.

npm 11 install-script policy is explicit in `package.json`: only the reviewed
`unrs-resolver` install script is allowed. Do not replace this with
`dangerously-allow-all-scripts`.

Historical VPS, Caddy, and Quadlet material remains in the repository for
traceability and is labeled as historical in the status record. It is not part
of the active demo workflow.

---

## 📌 Repository & Development Workflow Policy

0. **Documentation Synchronization Policy:** Follow
   [`PROJECT_UPDATE_STANDARD.md`](PROJECT_UPDATE_STANDARD.md) and update
   `IMPLEMENTATION_STATUS.md`
   and every affected source-of-truth document when code, components,
   dependencies, scripts, or design specs change. Do not copy an acceptance
   PASS claim without current evidence.
1. **GitHub repository synchronization:** Follow
   [`GITHUB_HTTPS_WORKFLOW.md`](GITHUB_HTTPS_WORKFLOW.md). Authenticate and
   publish remote Git through `gh api` over HTTPS; local commits necessarily
   use local Git because `gh` has no local commit command. Never use SSH
   remotes, SSH keys, `gh ssh-key`, passkeys, or direct `git push`.

---

## 📄 License & Attribution

Copyright © 2026 **Accustandard Medical and Diagnostic Supplies Corporation** & **DelegateOps Business Support Services**. All rights reserved.

## 2026 Implementation Baseline

- The browser hydrates operational lists from `/api/v1` and keeps deterministic seed data only as an offline rendering fallback.
- Sales Quotes route Sales Officer → Marketing Reviewer → General Manager; DCS is not a Sales Quote approval stage.
- Goods Receipt over-receiving is hard-blocked, and a fully received PO remains `AWAITING_VENDOR_INVOICE` until the vendor invoice is matched.
- Desktop navigation uses filtered horizontal links through the full-width shell;
  mobile navigation remains thumb-zone oriented below 1280px.

## 2026 Repository Audit Status

Object storage, when needed, uses the existing Backblaze bucket `bridge-ph`.
Demo objects use the `accustandard/demo/` prefix and production objects use
`accustandard/`; these are object-key prefixes, not additional buckets. See
[`BACKBLAZE_S3_WORKFLOW.md`](BACKBLAZE_S3_WORKFLOW.md) for endpoint, key
security, and naming rules.

The repository is in an incremental migration, not yet a complete acceptance
release. The deployed runtime is the Go API in `backend/cmd/server` plus the
Next.js static export; obsolete prototype server/schema artifacts have been
removed and are not part of the demo runtime.

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

### Action hierarchy and mobile operations

Feature modules use one filled primary action, restrained supporting/attention
actions, quiet secondary controls, and visible native `More actions`
disclosures for infrequent work. Desktop operations are labeled `More tools`;
the mobile drawer exposes one role-filtered `Operations & tools` disclosure
for export, startup import, QBO queue, barcode manager, scanner, and PWA
installation, while search remains directly reachable. These client-side
checks preserve role-safe demo navigation but are not backend authorization.

### Demo API boundary and interaction references

Protected demo API routes require `APP_ENV=demo` and a valid `X-Demo-Role`
header; approval handlers no longer accept a client-supplied JSON role. This is
only a simulated actor boundary. Non-demo deployments fail closed until a
trusted authentication provider supplies the server-side identity. Financial
evidence, imports, and approval transitions that remain local are labeled
`Preview` and must not be treated as persisted records.

The latest UX pass uses [SmoothUI](https://github.com/educlopez/smoothui) as a
selective React/Tailwind pattern reference while retaining Radix for modal
semantics. `AttentionBox` applies the calm responsive surface pattern to
high-signal status and workflow guidance. [Anime.js](https://animejs.com/)
4.5.0 is bundled locally through `AnimeReveal` for one non-essential
opacity/transform entrance cue, with an explicit reduced-motion guard. Follow
the [Anime.js v4 animation API](https://animejs.com/documentation/animation/)
when extending it; do not animate audit-sensitive values.

Readable UI text follows the WCAG 2.2 resize-text and reflow expectations:
screen body text starts at 16px, small utility text is raised, and emphasis is
carried by a colored surface before heavier type.

### Modal behavior

All blocking popups use the shared Radix-backed
[`AccessibleModal`](src/components/common/AccessibleModal.tsx) shell. It
supports centered dialogs, mobile bottom sheets, and full-screen document
previews while providing focus containment/restoration, Escape handling,
safe-area spacing, scroll-safe content, visible close targets, and
reduced-motion-safe transitions. Feature modules keep their existing workflow
logic inside the shell; new `fixed ... z-50` modal wrappers should not be added.
Use the current [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
and [Radix Dialog guidance](https://www.radix-ui.com/primitives/docs/components/dialog)
when extending a popup.

### Notification behavior

Routine feedback uses a shared, dismissible Radix Toast center with explicit
severity and restrained AccuStandard surfaces. User-action results use
foreground announcements; low-urgency informational updates use background
announcements. Validation errors stay beside the affected control, offline
status stays persistent in the workspace banner, and interruptive dialogs are
reserved for responses that require acknowledgment. See the
[`UI_UX_ACCESSIBILITY_GUIDE.md`](UI_UX_ACCESSIBILITY_GUIDE.md) notification

Deployment details, including the image archive handoff, external tunnel
network, file-based secret, and public readiness checks, live in
[`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md).
