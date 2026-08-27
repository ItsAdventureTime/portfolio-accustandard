# UX/UI Simplification & Navigation Redesign Plan

## Executive Overview

This file is the authoritative UI/UX scope for the repository. Business rules
and acceptance behavior remain governed by
`AccuStandard_Developer_Correction_and_Acceptance_Test_Handoff.md`; current
runtime facts remain governed by `IMPLEMENTATION_STATUS.md`; operational
workflow and deployment guidance remains in `README.md`, `ARCHITECTURE.md`,
and `CONTRIBUTING.md`.
Feedback indicates that the AccuStandard Medical ERP & Supply Chain Dashboard is currently overwhelming, text-heavy, and confusing to navigate. Users logging in are faced with competing buttons, dense data tables, and cluttered form modals without a clear visual hierarchy or explicit starting point.

This plan details a complete UX overhaul that maintains **100% of existing business workflows, role permissions (Segregation of Duties), COSO controls, and data structures**, while radically simplifying user navigation, form entry, and visual density.

---

## Key Design Principles & Framework (2026 UX Guidelines)

1. **Role-Tailored "Action Center" (Landing Page Clarity)**
   - Upon login/role switch, the dashboard displays a prominent **"Needs Your Attention Today"** Action Center hero widget.
   - Replaces generic data walls with task-oriented work queues tailored to the active role (e.g., General Manager sees pending approvals; Sales sees active RFQs; Warehouse sees expected receiving shipments).

2. **Progressive Disclosure (Form & Table Simplification)**
   - Complex form modals (PO Creation, Sales Quote, RFP, Stock Additions) are restructured into **2-Step / 3-Step Wizard flows** with smart auto-filling.
   - Optional fields are tucked inside expandable **"Advanced Details"** accordions.
   - Table columns are trimmed to 5 core high-signal attributes, pushing extended metadata into expandable row drawers or inspect modals.

3. **Clutter-Free & Task-Oriented Navigation**
   - Main navigation dynamically filters tabs by role and groups secondary actions (Export, Import, Audit Logs, QBO Queue) under a single **"Operations & Tools"** dropdown menu.
   - Workflow Step Indicators (Breadcrumb Steppers) are added to track document lifecycles (RFQ &rarr; Quote &rarr; PO &rarr; RR &rarr; Invoice &rarr; SOA).

4. **Modern & Professional UI Aesthetics**
   - Use the supplied AccuStandard wordmark as the visual anchor with the
     canonical navy (`#17356F`), royal blue (`#2C4296`), sapphire (`#1D4ED8`),
     Rx red (`#B4232F`), and calm canvas/card surfaces.
   - Use a full-width workspace rail, restrained borders, soft shadows, clear
     visual hierarchy, and polished micro-interactions without relying on
     heavy bold text for emphasis.

---

## User Review Required

> [!IMPORTANT]
> - **Zero Breaking Business Logic Changes**: All COSO control rules, 3-way match validation, maker-checker-approver role gates, and Go API endpoints remain completely untouched.
> - **Layout Transformation**: The layout shifts from a tab-only view to an **Action-First Dashboard** with a unified header utility drawer.

---

## Proposed Component Changes

### 1. Navigation & Layout Component Overhaul

#### [MODIFY] [`Header.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/layout/Header.tsx)
- Use a horizontal desktop navigation bar with Dashboard, Inventory, Orders,
  Finance, and Reports. Underline the active destination and filter
  destinations by the active role's permissions.
- Keep the logo, role switcher, quick search, notification affordance, and
  secondary Operations & Tools menu in one restrained header.

#### [MODIFY] [`MobileNavDrawer.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/navigation/MobileNavDrawer.tsx)
- Preserve bottom-sheet navigation and role-specific module filtering on small
  screens; the desktop shell does not render a persistent sidebar.

#### [NEW] [`RoleActionCenter.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/features/overview/RoleActionCenter.tsx)
- Action center positioned at the top of the main dashboard:
  - Displays the **"Needs Your Attention Today"** heading and the
    **"Role Action Center"** subtitle.
  - Provides three role-specific cards in an asymmetric hierarchy for the
    default General Manager view: a primary **Pending PO Approvals** card with
    stacked **Active RFQs** and **Receiving Alerts** cards. Role variants may
    change counts, labels, and destinations while preserving the three-card
    composition.

---

### 2. Feature View & Table Simplification

#### [MODIFY] [`ExecutiveOverview.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/features/overview/ExecutiveOverview.tsx)
- Embed `RoleActionCenter` with the “Needs Your Attention Today” heading and
  the asymmetric three-card action hierarchy in the reference order.
- Follow it with a compact five-column PO table: PO Number, Vendor, Amount,
  Date, and Status. The table is sourced from purchase orders, not a mixed
  approval-record feed. Keep inspection and approval actions accessible inside
  row content without adding a visually dominant action column.

#### [MODIFY] [`QuotationGenerator.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/features/quotations/QuotationGenerator.tsx)
- Add a visual **Workflow Progress Bar** (RFQ Received &rarr; Drafted &rarr; Marketing Review &rarr; GM Approved &rarr; Client Accepted &rarr; PO Linked).
- Simplify quote table columns and move technical JSON metadata into detail inspection drawers.

#### [MODIFY] [`PurchasingReceiving.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/features/purchasing/PurchasingReceiving.tsx)
- Split into 2 clean sub-tabs: **"Purchase Orders"** and **"Receiving Reports (RR)"**.
- Simplify PO creation trigger into a guided modal.

#### [MODIFY] [`InventoryControl.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/features/inventory/InventoryControl.tsx)
- Group items clearly by Stock Category (Class 1 Core, Class 2 Controlled, Class 3 Special).
- Highlight critical low-stock items requiring reorder with an immediate "Create Reorder PO" button.

---

### 3. Progressive Disclosure Form Modals

#### [MODIFY] [`CreateQuotationModal.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/modals/CreateQuotationModal.tsx)
#### [MODIFY] [`CreatePOModal.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/modals/CreatePOModal.tsx)
#### [MODIFY] [`CreateRFPModal.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/modals/CreateRFPModal.tsx)
#### [MODIFY] [`ReceivingReportModal.tsx`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/src/components/modals/ReceivingReportModal.tsx)
- Restructure into **Multi-Step Wizards**:
  - **Step 1**: Header details (Customer/Vendor, Date, Reference).
  - **Step 2**: Line Items & Pricing (with auto-suggest search and automatic subtotal math).
  - **Step 3**: Review & Approval Submit.
- Hide non-essential inputs inside accordion tabs.

---

## Verification Plan

### Automated Verification
Validation is sandbox-only for this repository. Do not require or report a
macOS host Node/npm/Go build. When compilation is needed, run it through the
deterministic Docker Sandbox (`jk-sbx-project exec ...`) and keep generated
`node_modules/`, `.next/`, and `out/` artifacts out of the host checkout. The deployment workflow copies the checkout into a sandbox-private temporary directory, builds there, and copies only the static export and backend image archive into the target release.
The frontend install uses a stable sandbox-user npm cache with bounded
registry retries; npm `ECONNRESET` is a network retry concern, independent of
sandbox CPU/RAM sizing. The cache stays outside the host checkout and is
expanded inside the sandbox, so the host user's home is never interpolated.
`npm run deploy:demo` and `npm run deploy:prod` are bash-executable target workflows; each builds with its target base path and transfers a target-specific release. The demo workflow also bundles the Caddy handler and installs it under `/etc/caddy` when remote privileges allow; production handlers remain in the authoritative imported Caddy configuration.
frontend validation/static export and the target-platform backend image build
inside the Docker Sandbox, then transfers only release artifacts to the VPS.
The target VPS is Fedora CoreOS with rootless Podman user Quadlets
(`systemctl --user` and
  `~/.config/containers/systemd/`); PostgreSQL 17 data is persistent and is
  updated by GORM and the idempotent seed during deployment. A legacy or
  incomplete PostgreSQL data directory (different `PG_VERSION`, or non-empty
  without `PG_VERSION`) is removed for this demo and reinitialized as
  PostgreSQL 17; no backup is retained. The API starts only after the
  PostgreSQL Quadlet healthcheck reports readiness. `Notify=healthy` does not
  guarantee that the Go HTTP listener is ready, so both VPS scripts use curl
  retries for transient startup failures and wait up to 60 seconds for
  `/demo/accustandard/api/v1/readiness`; timeout diagnostics include API
  systemd status and the last 100 journal lines before a nonzero exit. The
  reset-state parser
  consumes line-free tokens (`version:17`, `version:16`, `invalid`, or `empty`),
  preventing command substitution from appending a literal `n` such as `emptyn`;
  rootless `podman unshare` and the PostgreSQL 17 reset policy remain required
  for the current VPS runtime.

  Local Docker image builds use `--pull` with the reviewed pinned images
  `golang:1.26.5-alpine3.24` and `alpine:3.24.1`; version changes require a
  dependency review rather than silently following a mutable tag.

```bash
bash -n scripts/deploy-demo.sh scripts/vps-deploy-accustandard.sh \
  scripts/vps-migrate-to-go.sh
# In the Docker Sandbox only:
jk-sbx-project exec npm run lint
jk-sbx-project exec npm run build
```

### Manual Verification
1. **Role Switch Testing**: The default demo view is General Manager so the
   first render matches the reference composition. Switch between Admin,
   Sales, GM, Bookkeeper, and Warehouse to verify that the Action Center and
   Navigation tabs dynamically adjust and surface the correct pending actions.
2. **Form Wizard Flow**: Open Create PO and Create Quotation modals to verify step-by-step navigation and validation before submission.
3. **Responsive Visual Check**: Verify clean typography, visual hierarchy, and lack of visual clutter on desktop and mobile viewports.

## Framework and accessibility references (2026)

The implementation remains on Next.js 16 App Router with static export,
React 19, Tailwind CSS 4, Lucide, and the existing Radix primitives. Consult
the current [Next.js static export documentation](https://nextjs.org/docs/app/guides/static-exports),
[Next.js Turbopack documentation](https://nextjs.org/docs/app/api-reference/turbopack),
[Tailwind CSS v4 theme variables](https://tailwindcss.com/docs/theme), and
[Tailwind CSS container queries](https://tailwindcss.com/docs/responsive-design#container-queries)
for new styling patterns. Review interactive states against
[WCAG 2.2](https://www.w3.org/TR/WCAG22/) and the existing
[Radix accessibility guidance](https://www.radix-ui.com/primitives/docs/overview/accessibility).
Existing Radix-based components do not require a shadcn migration; current
shadcn guidance supports keeping an existing Radix app when its primitives
already meet the product needs.

The production `build` script uses Next's documented `--webpack` opt-out.
Next.js 16 defaults to Turbopack, but the Webpack path is the currently
verified static-export path in the Docker Sandbox. Revisit this choice after a
deliberate sandbox validation confirms the resource and output contract.

---

# 🤖 ChatGPT Codex Handoff Prompt

Copy and paste the exact prompt below into ChatGPT Codex to execute the implementation step-by-step:

```text
================================================================================
CHATGPT CODEX HANDOFF PROMPT: ACCUSTANDARD DASHBOARD UX/UI OVERHAUL
================================================================================

Role & Context:
You are an expert Senior Frontend Engineer specializing in Next.js (App Router), Tailwind CSS, React, and UX/UI Design Systems for enterprise ERP dashboards.

Your Objective:
Refactor the user interface and user experience of the AccuStandard Medical ERP Dashboard codebase located in `src/`. The current app is overwhelming, cluttered with too many buttons, text fields, and tables, and lacks clear navigation guidance upon login.

Constraints & Non-Negotiables:
1. DO NOT change backend API logic, schema types, or COSO control workflows (Maker-Checker-Approver rules, Segregation of Duties, 3-Way Purchasing Match).
2. Retain all user roles (Admin, Chairman (DCS), General Manager, Bookkeeper, Warehouse, Marketing, Sales) and existing state logic in `src/lib/useDemoStore.ts` and `src/lib/api.ts`.
3. Follow US English, active voice, plain language, and clear action-oriented UI labels throughout the interface and documentation.
4. Strictly execute the UX/UI overhaul in the following 4 sequential phases:

--------------------------------------------------------------------------------
PHASE 1: LANDING PAGE & ROLE ACTION CENTER
--------------------------------------------------------------------------------
1. Create `src/components/features/overview/RoleActionCenter.tsx`:
   - Position this component at the top of `ExecutiveOverview.tsx`.
   - Display the reference layout: "Needs Your Attention Today" with the
     "Role Action Center" subtitle.
   - Surface three role-specific action cards in an asymmetric hierarchy based
     on `viewAsRole`:
     * GM / Chairman: Pending PO approvals, active RFQs, and receiving alerts.
     * Sales: Active RFQs, customer approvals, and receiving alerts.
     * Warehouse: Pending PO receipts, active RFQs, and receiving alerts.
     * Bookkeeper: Approval/collection work, active RFQs, and receiving alerts.
   - Give every card one clear action; do not add a separate hero CTA.

--------------------------------------------------------------------------------
PHASE 2: NAVIGATION & TOOLBAR STREAMLINING
--------------------------------------------------------------------------------
1. Modify `src/components/layout/Header.tsx` and the mobile navigation:
   - Use horizontal desktop navigation grouped by product area and filter out
     irrelevant destinations by user role.
   - Keep pending-count notification feedback in the header notification
     affordance; the reference header does not place badges on every tab.
   - Move secondary operations (Export, Startup Import, QBO Sync Queue, Barcode Manager, Scanner) into a unified "Operations & Tools" dropdown menu in the header instead of cluttering the main screen.
2. Add a visual `WorkflowStepper` component to document detail modals and generator views (RFQ -> Quote -> PO -> RR -> Invoice -> SOA) so users always understand where a transaction sits in the supply chain lifecycle.

--------------------------------------------------------------------------------
PHASE 3: FORM MODAL PROGRESSIVE DISCLOSURE (WIZARD STEPS)
--------------------------------------------------------------------------------
1. Refactor `CreateQuotationModal.tsx`, `CreatePOModal.tsx`, `CreateRFPModal.tsx`, and `ReceivingReportModal.tsx`:
   - Replace long scrolling forms with a clean 3-Step Wizard:
     * Step 1: Document Basics (Vendor/Client, Date, Reference #).
     * Step 2: Line Items & Quantities (with quick item search & automatic tax/total calculation).
     * Step 3: Review & Submit.
   - Wrap non-essential fields (Notes, Custom Terms, Internal Tags) in a collapsible "Advanced Options" accordion.
   - Provide auto-populated default values to minimize required user keystrokes.

--------------------------------------------------------------------------------
PHASE 4: TABLE DECLUTTERING & MODERN PROFESSIONAL STYLING
--------------------------------------------------------------------------------
1. Refactor Data Tables across `QuotationGenerator.tsx`, `PurchasingReceiving.tsx`, `InventoryControl.tsx`, `StatementOfAccount.tsx`, and `RequestForPayment.tsx`:
   - Limit visible table columns to five high-signal fields (ID/QRN, Client/Supplier, Date, Status, and Total Amount) plus one clearly labeled primary action control when the workflow requires it.
   - Move detailed audit logs, JSON metadata, and technical breakdown fields into expandable row drawers or Inspector Modals.
   - Standardize status badges using clean color semantics:
     * Emerald: Approved / Complete / Paid
     * Amber: Pending Review / Awaiting Approval
     * Rose: Rejected / Overdue / Hard-Blocked
   - Apply modern aesthetic styles: Slate background (`bg-slate-50`), crisp white cards (`bg-white border border-slate-200 shadow-sm rounded-xl`), refined typography, consistent padding, and smooth micro-transitions (`hover:-translate-y-0.5 transition-all`).

--------------------------------------------------------------------------------
VERIFICATION & HANDOFF CHECKLIST:
--------------------------------------------------------------------------------
1. Run lint through `jk-sbx-project exec` and fix syntax or accessibility
   errors.
2. Run the static export build through `jk-sbx-project exec`; do not require a
   host build.

### Demo rootless Caddy boundary

The deploy user stages releases, Quadlets, PostgreSQL data, and `web-dist` under `/home/jk/bridge-ph/accustandard-demo`; the Caddy container serves the same content through a read-only bind mount at `/srv/bridge-ph-accustandard-demo`. The deployment workflow never uses sudo or writes host `/srv`; for demo releases it atomically refreshes only its managed Caddy handler and import line in `/home/jk/caddy/conf/Caddyfile`.

Each live demo deployment installs the managed routing block from
`deploy/caddy/Caddyfile.snippet`, imports it before the static handler in
`delegateops.business`, validates Caddy, reloads the rootless user service,
and probes the origin. The block canonicalizes the root URL and routes the API
through `host.containers.internal:8080` because the supplied Caddy Quadlet does
not declare a shared AccuStandard network; `127.0.0.1` would be Caddy's
container loopback.

```sh
podman ps --format '{{.Names}}'
systemctl --user list-units '*caddy*'
# Bind /home/jk/bridge-ph/accustandard-demo/web-dist read-only
# to /srv/bridge-ph-accustandard-demo in the Caddy container.
podman exec <discovered-caddy> getent hosts host.containers.internal
podman exec <discovered-caddy> caddy validate --config /etc/caddy/Caddyfile
systemctl --user reload <discovered-caddy-unit>.service
```

Do not guess the container name or unit; use the discovery commands above.
The deploy script installs and checks the required root redirect and API
handler before transferring a live demo release.
