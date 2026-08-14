# ANTIGRAVITY_CURRENT_DESIGN.md

# AccuStandard Medical ERP — Comprehensive UI & UX Design Audit & Layout Reference

> **Document Purpose:** Complete, detailed design system, layout, and UX audit of the current **AccuStandard Medical ERP Dashboard** web application. This document preserves the Phase 1 baseline and records the Phase 2 redesign/review addendum for implementation handoff.
>
> **Audit Date:** 2026-08-14
> **Target Application:** AccuStandard Medical ERP & Supply Chain Dashboard
> **Brand Owner:** AccuStandard Medical and Diagnostic Supplies Corporation (in partnership with DelegateOps Business Support Services - DOS)
> **Repository Context:** `ItsAdventureTime/bridge-accustandard`

---

## 1. Executive Summary & Purpose

The **AccuStandard Medical ERP Dashboard** is a enterprise medical supply chain and financial control platform designed around COSO internal control principles, strict segregation of duties (7 key roles), multi-warehouse FEFO inventory management (Quezon City & Pampanga), sales quotations, purchasing 3-way match controls, client SOA ledgers, non-PO expense vouchers, and QuickBooks Online (QBO) queue exports.

This document records the baseline **UI/UX architecture**, design tokens, layout hierarchy, navigation systems, component patterns, responsive behaviors, and design weaknesses found across the existing project workspace. The implementation outcome and current accessibility rules are recorded in the addendum and `UI_UX_ACCESSIBILITY_GUIDE.md`.

---

## 2. Workspace Documentation Audit Map

The workspace contains primary sources of truth, operational documentation, and design reference prompts:

| File / Document | Purpose & Scope | Status in Audit |
| :--- | :--- | :--- |
| [`README.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/README.md) | Project overview, COSO principles, color tokens, VPS deployment & container execution policy | **Active Source of Truth** |
| [`ARCHITECTURE.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/ARCHITECTURE.md) | Technical system architecture, Go REST API, Next.js frontend, database models | **Active Source of Truth** |
| [`IMPLEMENTATION_STATUS.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/IMPLEMENTATION_STATUS.md) | Audited boundary, Go backend status, verified vs unverified features | **Active Runtime Record** |
| [`AccuStandard_Developer_Handoff_UPDATED.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/AccuStandard_Developer_Handoff_UPDATED.md) | Detailed business requirements, approval chains, ROI workbook rules, RBAC permissions | **Active Business Rule Authority** |
| [`ChatGPT-Codex-UI-UX-Design-Reference-Context.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/ChatGPT-Codex-UI-UX-Design-Reference-Context.md) | Codex generic UI/UX standards, WCAG 2.2 AA guidelines, component design rules | **Active Design Guidance** |
| [`CHATGPT_CODEX_HANDOFF_PROMPT.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/CHATGPT_CODEX_HANDOFF_PROMPT.md) | Full handoff prompt blueprint for ChatGPT Codex execution | **Active Handoff Blueprint** |
| [`accustandard-webapp-spec.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/accustandard-webapp-spec.md) | Core webapp specification, role queues, document formats | **Active Requirement Reference** |
| [`accustandard-erp-lite-blueprint.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/accustandard-erp-lite-blueprint.md) | ERP Lite module definitions and COSO approval steps | **Active Blueprint Reference** |
| [`GO_MIGRATION_PLAN.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/GO_MIGRATION_PLAN.md) | REST API migration plan from localStorage to Go + PostgreSQL 17 | **Active Architecture Reference** |
| [`BACKBLAZE_S3_WORKFLOW.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/BACKBLAZE_S3_WORKFLOW.md) | S3 Object storage guidelines (`bridge-ph` bucket) | **Active Infrastructure Guide** |
| [`DEPLOYMENT_GUIDE.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/DEPLOYMENT_GUIDE.md) | Single-command deployment protocol (`npm run deploy:demo`) | **Active Deployment Guide** |
| [`UI_UX_ACCESSIBILITY_GUIDE.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/UI_UX_ACCESSIBILITY_GUIDE.md) | Current visual, interaction, keyboard, and accessibility rules | **Active UI/UX Guide** |
| [`llm-interface-design-context-prompt.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/llm-interface-design-context-prompt.md) | Legacy LLM context prompt | *Historical / Secondary* |
| [`llm_ui_context_prompt_framework.md`](file:///Users/jk.deguzman/dev/accustandard-bridge-dashboard/llm_ui_context_prompt_framework.md) | Legacy UI prompt framework | *Historical / Secondary* |

---

## 3. Current Design System & Visual Baseline

### 3.1 Color Tokens (`globals.css` & Tailwind v4)
The current UI implements a **Light Corporate Medical Theme**:

```css
:root {
  --surface-canvas: #f4f7fb;      /* Anti-glare slate canvas */
  --surface-card: #ffffff;        /* Data surface */
  --surface-subtle: #eef3f8;      /* Muted section background */
  --surface-hover: #edf5ff;       /* Interactive row hover */
  --stroke-subtle: rgb(203 213 225 / 0.72);
  --stroke-strong: #94a3b8;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;

  --brand-navy: #17356f;          /* High-contrast brand navy */
  --brand-royal: #2c4296;         /* Primary navigation / action accent */
  --brand-sapphire: #1d4ed8;      /* Links and focus ring */
  --brand-red: #b4232f;           /* Signature Rx attention accent */
  --focus-ring: #1d4ed8;

  --shadow-card: 0 1px 2px 0 rgb(15 23 42 / 0.04), 0 4px 12px -6px rgb(15 23 42 / 0.12);
  --shadow-hover: 0 10px 24px -12px rgb(15 23 42 / 0.22);
}
```

### 3.2 Typography & Font Hierarchy
- **Font Family:** `Outfit`, with `Avenir Next`, `Segoe UI Variable`, and system fallbacks.
- **Base Body Text:** `1rem` root sizing, line-height `1.5`, color `#0F172A`.
- **Table Headers:** `0.8125rem` (13px), `font-weight: 600`, sentence case where space allows, color `#334155`.
- **Sub-Headlines & Labels:** Medium-weight kicker text (`font-medium text-xs`) with restrained tracking; avoid forced uppercase for long labels.
- **Headlines:** Semibold slate titles (`text-xl font-semibold text-slate-900`) with weight reserved for hierarchy, not emphasis everywhere.

### 3.3 Semantic Status Badges
Status indicators use rounded badge pills with colored text and subtle 1px borders:
- **Success / Approved / Active:** `badge-green` (`bg-emerald-50 text-emerald-700 border-emerald-200`)
- **Pending / Warning / In Review:** `badge-amber` (`bg-amber-50 text-amber-700 border-amber-200`)
- **Alert / Over-Receipt / Hard-Block:** `badge-red` (`bg-rose-50 text-rose-700 border-rose-200`)
- **Info / Draft / QBO Queue:** `badge-blue` (`bg-blue-50 text-blue-700 border-blue-200`)

### 3.4 Standardized Rx Pill Badge System
A key visual signature of the AccuStandard app is the **Rx Pill Badge** used in table cells for key primary identifiers:
- `DOCUMENT QRN`: FileText icon + QRN Code + Red Rx Accent Dot + Click handler for Inspector Modal.
- `SKU / BARCODE`: Barcode icon + SKU Code + Click handler for Stock Detail Modal.
- `PO NUMBER`: FileText icon + PO Code + Click handler for 3-Way Match Modal.
- `RFP VOUCHER`: CreditCard icon + Voucher ID + Click handler for Expense Voucher Modal.
- `RFQ REF #`: FileText icon + RFQ Code + Click handler for RFQ Preview.
- `USER NAME`: User icon + Name + Click handler for Access Matrix Modal.

### 3.5 Interactive & Form States
- **Form Controls:** Minimum touch height `44px`, `border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600`.
- **Form Validation:** Native CSS pseudo-classes `:user-invalid` (triggers red border `#DC2626` and rose tint `#FFF1F2`) and `:user-valid` (triggers green border `#16A34A`).
- **Focus Rings:** `focus-visible` outline set to `2px solid #2563EB` with `2px` offset.

---

## 4. Current Layout Architecture & Navigation Shell

### 4.1 Header Component (`src/components/layout/Header.tsx`)
- **Structure:** Sticky top bar with glassmorphic backdrop filter (`bg-white/90 backdrop-blur-xl border-b border-slate-200/80`).
- **Left Section:** AccuStandard Medical Logo (`AccustandardLogo.tsx`) and the responsive menu trigger.
- **Center Section:** Role-filtered horizontal navigation and a Quick Command Palette trigger (`CommandPaletteModal.tsx`).
- **Right Section:** Clearly labeled **Demo role simulation**, permission-filtered QBO queue and operations controls, plus search and PWA triggers. No branch badge or authenticated profile menu is rendered in the current shell.
- **Operations menu:** Uses the WAI-ARIA menu-button pattern with stable button/menu IDs, `aria-haspopup`, `aria-expanded`, and `aria-controls`. Enter, Space, Arrow Up/Down, Home, and End manage opening and menuitem focus; Escape and outside pointer input close the menu, and focus returns to the trigger after keyboard close or activation.

### 4.2 Desktop Navigation Strip (`page.tsx`)
- **Desktop Navigation:** The current shell renders filtered horizontal navigation tabs; it does not render a persistent sidebar. `Sidebar.tsx` remains an unmounted legacy component and is not part of the active layout:
  1. **Overview:** System KPI summary, COSO approval pipeline, quick stats.
  2. **Inventory:** Multi-warehouse stock grid, FEFO expiry tracker, barcode scanner trigger, batch management.
  3. **Quotations & RFQ:** Sales RFQ logger, Quotation Generator, Client Census, Marketing ROI Engine.
  4. **Purchasing & 3-Way Match:** Purchase Order builder, Goods Receipt (RR) scanner, 3-Way Match inspection.
  5. **Finance & SOA:** Client SOA ledger, multi-invoice check allocation, non-PO RFP vouchers, GL Chart of Accounts.
  6. **User Access & Admin:** RBAC matrix editor, system configuration, audit logs, startup cutover tools.

### 4.3 Mobile Navigation Shell (`src/components/navigation/BottomNav.tsx` & `MobileNavDrawer.tsx`)
- **Bottom Navigation Rail (`BottomNav.tsx`):** Fixed bottom bar visible below the desktop breakpoint, providing role-permitted primary destinations plus the scanner only when the shared operation permission allows it.
- **Mobile Navigation Drawer (`MobileNavDrawer.tsx`):** Bottom sheet containing the demo role simulation, role-permitted module links, role/action-specific badges, and permission-filtered scanner/PWA actions.

---

## 5. Core Feature Modules Audit

### 5.1 Overview Module (`src/components/features/overview`)
- **KPI Metrics Header:** 4 stat cards displaying Total Inventory Value, Open Quotations Count, Pending COSO Approvals, and Monthly SOA Collections.
- **COSO Approval Queue Table:** 5-column table displaying Document QRN badges, Transaction Type, Requester, Pending Stage (Accounting/GM/Chairman), and Action buttons.
- **Quick Action Bar:** Direct triggers for "Create Quote", "Issue Purchase Order", "Receive Stock", and "Log RFP Voucher".

### 5.2 Multi-Warehouse Inventory & Barcode Inspector (`src/components/features/inventory`)
- **Warehouse Selector:** Toggle tabs for "Quezon City Main Warehouse" and "Pampanga Regional Depot".
- **Stock Grid:** 7-column data grid listing SKU/Barcode Rx badges, Item Description, Category, FEFO Expiry Date, On-Hand Qty, Reserved Qty, Available Qty, and WMA Unit Cost.
- **Modals:**
  - `AddStockModal.tsx`: Form for adding new SKUs or adjusting stock levels.
  - `BarcodeProductManagerModal.tsx`: GS1 barcode preview, lot assignment, and printing controls.
  - Camera Barcode Scanner: Integrated scanner using ZXing/HTML5 QR code library.

### 5.3 Sales RFQ, Quotation Generator & ROI Engine (`src/components/features/quotations`, `rfq`, `roi`)
- **Client Census & RFQ Form:** Input fields for hospital/lab census, reagent usage, and equipment requirements.
- **Quotation Generator (`CreateQuotationModal.tsx`):** Dynamic line-item table, multi-tier pricing, discount toggles, 3-day soft reservation warning, and GM approval trigger.
- **Marketing ROI Engine:** Financial calculator replicating `REVISED ROI_ACE PATEROS.xlsx`, providing real-time calculations for Gross Margin, Payback Period, and Net Return.

### 5.4 Purchasing & 3-Way Match Control (`src/components/features/purchasing`)
- **PO Builder (`CreatePOModal.tsx`):** Multi-item PO creator with Open-PO same-SKU quantity warning banner to prevent duplicate purchasing.
- **Receiving Report Modal (`ReceivingReportModal.tsx`):** PO-linked goods receipt entry. Hard-blocks over-receiving beyond approved PO quantities.
- **3-Way Match Inspector:** Visual comparison panel comparing PO vs Goods Receipt vs Vendor Invoice quantities and amounts.

### 5.5 Finance, Client SOA & Payment Allocation (`src/components/features/soa`, `finance`)
- **SOA Generator:** Renders official Statement of Account matching company templates for clients like Gatchalian Medical Lab, ACE Medical Center, and Pampanga Regional Hospital.
- **Multi-SOA Check Allocation:** Matrix tool allowing allocation of a single customer check across multiple outstanding sales invoices with partial payment tracking.
- **Non-PO RFP Vouchers (`CreateRFPModal.tsx`):** Request for Payment voucher generator with GL Chart of Accounts picklist and bank disbursement releasing details (BDO / Metrobank / BPI).

### 5.6 User Access Matrix & Admin Console (`src/components/features/admin`)
- **Role Permissions Grid:** Interactive matrix displaying permissions across 7 user roles (Admin, Chairman, GM, Bookkeeper, Warehouse, Marketing, Sales).
- **Local demo editor:** The user/module editor is local preview state. It does not create authenticated user sessions or secure API actions.

### 5.7 QuickBooks Online (QBO) Export Queue & System Modals
- **Shared modal shell (`AccessibleModal.tsx`):** Radix-backed center, bottom-sheet,
  and full-screen variants own modality, focus restoration, Escape handling,
  safe-area spacing, internal scrolling, and the branded panel tokens.
- **QBO Sync Queue (`QBOSyncQueueModal.tsx`):** Shared-shell queue panel holding
  validated staging transactions for QBO export.
- **Document Print Modal (`DocumentPrintModal.tsx`):** Full-screen shared-shell
  A4 print layout wrapper with `@media print` CSS overrides.

### 5.8 Shared permission and authentication boundary
- `src/lib/permissions.ts` is the typed client-side source for role tabs,
  operation helpers, approval selectors, reviewable PO targets, and mobile
  action counts. Header, navigation, and overview surfaces consume that same
  model.
- The role selector is a demo simulation. Client-side visibility and action
  checks improve the preview experience but do not secure Go API endpoints.
  Backend authentication, session identity, and server-enforced authorization
  remain unresolved before production use.

---

## 6. Responsive & Ergonomic Audit

| Breakpoint Range | Device Class | Navigation Strategy | Layout & Component Adaptation |
| :--- | :--- | :--- | :--- |
| **>= 1280px** | Desktop / Laptop | Sticky header + filtered horizontal navigation | Full-width workspace rail (up to `1680px`), 5-7 column data grids, right slide-over drawers (`max-w-4xl`), 768px modals (`max-w-3xl`) |
| **768px - 1279px**| Tablet / compact laptop | Header + mobile drawer | Responsive module layouts, stacked controls, and horizontal table containment where a table must remain tabular |
| **< 768px (375px)**| Mobile phone | Header + bottom navigation rail | Stacked card layouts, full-width touch targets (44px min), mobile bottom sheets (`mobile-modal-container`) |

---

## 7. Baseline Design Weaknesses & Audit Findings

Following the **Redesign Audit Framework** (`/redesign-existing-projects`), the
pre-redesign baseline exhibited the following key weaknesses:

### 7.1 Typography Weaknesses
- **Generic Font Stack:** System font fallback (`Segoe UI`, `sans-serif`) lacks visual authority for a premium enterprise ERP.
- **Lack of Numeric Alignment:** Pricing, stock quantities, and financial totals use proportional fonts instead of tabular figures (`font-variant-numeric: tabular-nums`).
- **Heavy Line-Heights:** Form titles and table subheaders lack tight letter-spacing (tracking).

### 7.2 Surface & Visual Hierarchy Weaknesses
- **Flat Card Surfaces:** Containers rely on simple `1px solid #E2E8F0` borders without subtle background tinting, depth layering, or micro-textures.
- **High-Saturation Badges:** Status badges use vivid background fills (`#fee2e2`, `#dcfce7`) that compete with data for visual attention.
- **Lack of Spotlights / Inner Refractions:** Modals and slide-overs rely on simple backdrop blur without subtle inner border highlighting.

### 7.3 Layout & Spacing Weaknesses
- **Equal Card Grids:** Dashboard KPI cards are uniform 4-column blocks rather than asymmetric, decision-focused hero containers.
- **Flexbox Percentage Math:** Some modal layout forms rely on custom flex width classes instead of CSS Grid.
- **Dense Mobile Tables:** On mobile screens under 640px, tables require heavy horizontal scrolling rather than reflowing into structured mobile cards.

### 7.4 Interactivity & Micro-Motion Weaknesses
- **Instant Transitions:** Modal opens, tab changes, and hover states lack spring physics or smooth 200ms cubic-bezier easing.
- **Static Loading States:** Loading states use generic circular spinners instead of skeleton loaders matching exact container shapes.
- **Lack of Active Button Compression:** Buttons lack tactile press states (`active:scale-[0.98]`).

---

## 8. ChatGPT Codex Handoff Requirements

The Phase 2 implementation must preserve these conditions:
1. **Preserve Business Logic & API Contracts:** All Go backend endpoints (`/accustandard/demo/api/v1/*`), COSO approval rules, and role constraints must remain 100% intact.
2. **Refactor In-Place:** Maintain Next.js App Router structure in `src/app` and reusable components in `src/components`.
3. **Execute Design Upgrades:** Implement modern typography (`Outfit` / `Geist` / `Satoshi`), the existing primitive layer, Tailwind v4 design tokens, smooth micro-interactions, responsive mobile bottom sheets, and WCAG 2.2 AA-aligned accessibility.

---

## 9. 2026-08-14 Phase 2 implementation and review addendum

The redesign pass applied the high-value shell and overview improvements without
changing backend contracts or the role permission model:

- The provided logo asset is now the canonical shell mark.
- `Header.tsx` uses branded navy/royal navigation, Rx red accents, active-state
  semantics, and 44px-class touch targets.
- `RoleActionCenter.tsx` presents role-specific, data-backed priorities in an
  asymmetric decision layout. Approval actions remain gated by role and real
  approval identity.
- `ExecutiveOverview.tsx` formats PHP amounts safely, labels the activity table,
  and provides a keyboard-managed document inspector with Escape close, focus
  containment, and focus restoration.
- `page.tsx` exposes connected/offline API state and uses a bounded hydration
  fallback so the UI cannot remain indefinitely in a “Connecting” state.
- `globals.css` centralizes the current brand tokens, visible focus rings,
  reduced-motion handling, skeleton states, responsive navigation, and table
  ergonomics.
- The shell uses a responsive full-width rail capped at `1680px`, a lighter
  role selector, a tablet-safe mobile-drawer breakpoint, and a single elevated
  scanner action in the mobile bottom navigation.
- Shared typography now tones down `font-bold`/`font-extrabold` utility use in
  the workspace so emphasis comes from hierarchy, spacing, and color rather
  than stacked heavy text weights.
- `next.config.ts` allows `127.0.0.1` to request development-only chunks for
  local browser QA. This option is development-only and does not grant a
  production origin or change API permissions.

Review resolutions and the release checklist live in
[`UI_UX_ACCESSIBILITY_GUIDE.md`](UI_UX_ACCESSIBILITY_GUIDE.md). This addendum is
an implementation record, not a claim of full WCAG conformance or production
acceptance.
