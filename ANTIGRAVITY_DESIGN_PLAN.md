# ANTIGRAVITY_DESIGN_PLAN.md

# AccuStandard Medical ERP — Comprehensive UI/UX Redesign Plan & Implementation Blueprint

> **Document Purpose:** Complete, step-by-step UI/UX redesign specification and implementation blueprint for upgrading the **AccuStandard Medical ERP Dashboard** to 2026 enterprise design standards.
>
> **Execution Ready For:** ChatGPT Codex / Senior Frontend Engineer Handoff
> **Skill Guidelines Applied:** `/redesign-existing-projects` + Modern Web Guidance (`Base UI` / `Radix UI`, Tailwind CSS v4, WCAG 2.2 AA)
> **Date:** 2026-08-14
> **Target Repository:** `ItsAdventureTime/bridge-accustandard`
>
> **Delivery note:** The shell and overview redesign baseline is implemented.
> See `IMPLEMENTATION_STATUS.md` and `UI_UX_ACCESSIBILITY_GUIDE.md` for the
> verified current state and the remaining feature-module roadmap.

> **Current implementation boundary (2026-08-14):** The active shell uses a
> full-width horizontal desktop rail, a responsive mobile drawer/bottom rail,
> and the supplied logo. `Sidebar.tsx` is retained only as an unmounted legacy
> component. `src/lib/permissions.ts` is the shared client-side model for
> role-filtered tabs, operations, approval selectors, and navigation counts.
> The role selector is an explicitly labeled demo simulation; the Go API still
> requires authentication, session identity, and server-enforced authorization
> before production use. This blueprint's future-state requirements must not be
> read as evidence that those controls already exist.

---

## 1. Redesign Philosophy & Core Objectives

The goal of this redesign is to elevate the **AccuStandard Medical ERP Dashboard** from a functional prototype to a **state-of-the-art, calm enterprise web application**. The design principles follow the 2026 enterprise guidelines:

1. **Quiet Chrome & Calm Design:** Eliminate oversaturated gradients, heavy borders, and unnecessary visual noise. Focus on high readability, clear visual hierarchy, and precise typography.
2. **Decision-Driven Action Dashboards:** Reframe dashboard screens as flow-first decision hubs ("Needs Your Attention Today") tailored to each logged-in role.
3. **High-Density Table Ergonomics:** Power users scan, filter, and execute actions via table-first data grids with sticky headers, tabular figures, and contextual right slide-over drawers (`max-w-4xl`).
4. **Touch-First Mobile PWA:** Maintain fluid mobile responsiveness below 1024px with bottom navigation rails, full mobile bottom sheets, and integrated camera barcode scanning.
5. **Zero AI Cliché Tropes:** No arbitrary purple/violet dark gradients, no glowing border accents, no icon-stuffed bento boxes, no headline biscuit pills, and no lorem ipsum placeholders.

---

## 2. Updated Design Tokens & Style System

### 2.1 CSS Custom Properties (`src/app/globals.css`)
Update `globals.css` with clean CSS custom properties and modern token definitions:

```css
@import "tailwindcss";

@layer base {
  :root {
    /* Canvas & Surface Tokens */
    --surface-canvas: #f4f7fb;        /* Anti-glare slate canvas */
    --surface-card: #ffffff;          /* Off-white container card */
    --surface-subtle: #eef3f8;        /* Light slate secondary container */
    --surface-hover: #edf5ff;         /* Interactive row hover background */

    /* Border & Stroke Tokens */
    --stroke-subtle: rgb(203 213 225 / 0.72);
    --stroke-strong: #94a3b8;
    --stroke-active: #1d4ed8;

    /* Text & Typography Tokens */
    --text-primary: #0f172a;          /* Slate 900 primary text */
    --text-secondary: #475569;        /* Slate 600 body text */
    --text-muted: #64748b;            /* Slate 500 helper text */

    /* Brand & Accent Tokens */
    --brand-navy: #17356f;            /* High-contrast brand navy */
    --brand-royal: #2c4296;           /* Primary navigation / action accent */
    --brand-sapphire: #1d4ed8;        /* Electric Sapphire / focus ring */
    --brand-red: #b4232f;             /* Signature Medical Rx Red */

    /* Elevated Shadows & Refractions */
    --shadow-card: 0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04);
    --shadow-hover: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
    --shadow-drawer: -4px 0 24px 0 rgba(15, 23, 42, 0.12);
  }
}

/* Base Body Styling */
body {
  background-color: var(--surface-canvas);
  color: var(--text-primary);
  font-family: 'Outfit', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100dvh;
}

/* Numeric & Data Formatting */
.tabular-data {
  font-variant-numeric: tabular-nums;
  font-family: 'Geist Mono', 'JetBrains Mono', monospace;
}
```

### 2.2 Typography Scale & Rules
- **Font Stack:** Primary sans-serif: `Outfit` (or `Geist` / `Satoshi`). Monospace for financial data and codes: `Geist Mono`.
- **Headlines:** Tight tracking (`tracking-tight`), semibold weight (`font-semibold`), and `text-wrap: balance`; reserve heavier weights for high-priority status only.
- **Financial & Quantity Figures:** Always apply `font-variant-numeric: tabular-nums` or `tabular-data` class to prevent column shifting during live recalculations.
- **Labels & Subheaders:** Upper-case small caps (`font-semibold text-xs tracking-wider uppercase text-slate-500`).

### 2.3 Refined Status & Rx Badge Tokens
Replace high-saturation fills with quiet, muted status pills:

```css
/* Quiet Status Pills */
.badge-status-approved {
  background-color: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
}

.badge-status-pending {
  background-color: #fffbeb;
  color: #b45309;
  border: 1px solid #fef3c7;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
}

.badge-status-rejected {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
}

/* Standardized Rx Pill Identifier Badge */
.rx-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
  padding: 0.25rem 0.625rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
}

.rx-pill-badge:hover {
  background-color: #17356f;
  color: #ffffff;
  border-color: #17356f;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(23, 53, 111, 0.15);
}
```

---

## 3. Structural Redesign Blueprints

### 3.1 Header & Global Navigation Shell (`Header.tsx` & `Sidebar.tsx`)
- **Current baseline:** `Header.tsx` is the active shell. It renders a filtered
  horizontal rail at desktop widths and the mobile drawer trigger below the
  desktop breakpoint. `Sidebar.tsx` is not mounted by the active page and is
  retained for legacy reference only.
- **Visual Style:** Ultra-thin glassmorphic top header bar (`bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40`).
- **Brand Element:** Official logo preview + stylized Rx red accent bar.
- **Search Bar:** Elevated trigger button showing `Search transactions, SKUs, or documents... (Cmd + K)`.
- **Role Switcher & Action Center:** Sleek pill-segmented control displaying active role with permission tooltips.
- **QBO Export Drawer Button:** Dynamic badge indicator displaying queued transaction count with glowing blue pulse dot when items are pending.

### 3.2 Decision-First Executive Overview Dashboard (`src/components/features/overview`)
- **"Needs Your Attention Today" Hero Panel:** Asymmetric 2-column layout:
  - **Left Column (Action Cards):** Role-specific priority tasks (e.g., "3 POs Pending Accounting Review", "2 RFQs Awaiting GM Approval", "1 Reagent Lot Nearing Expiry").
  - **Right Column (COSO Approval Stream):** Compact live activity log showing approval timestamps, step history, and direct inspection links.
- **KPI Metrics Strip:** 4 clean metric cards with subtle sparkline trends and numeric tabular formatting (`tabular-nums font-semibold`).

### 3.3 High-Density Inventory & Barcode Inspector (`src/components/features/inventory`)
- **Warehouse Tabs:** Soft pill tabs ("Quezon City Main HQ", "Pampanga Depot").
- **Table Data Grid:** 8-column high-density layout:
  - SKU Barcode Rx Badge | Description & Category | FEFO Expiry Badge | On-Hand Qty | Reserved Qty | Available Qty | WMA Unit Cost | Quick Actions.
- **Stock Detail Slide-Over Drawer (`max-w-4xl`):** Replaces standard dialog popups with a right slide-over panel featuring:
  - GS1 Barcode preview canvas with download/print SVG buttons.
  - Interactive Lot / Serial breakdown table.
  - Historical WMA cost recalculation chart.

### 3.4 Sales RFQ, Quotation Generator & ROI Engine (`src/components/features/quotations`, `rfq`, `roi`)
- **RFQ Logger:** Streamlined 2-step wizard for recording hospital census data, reagent usage, and target equipment.
- **Quotation Generator Drawer:**
  - Dynamic line item editor with auto-calculating subtotal, tax, and discount fields.
  - Soft-reservation countdown timer badge (3-day reservation rule).
  - Explicit GM approval trigger button (no DCS approval step).
- **Marketing ROI Engine:** Financial calculator directly mirroring `REVISED ROI_ACE PATEROS.xlsx`:
  - Input parameters: Monthly census, test pricing, reagent kit yield.
  - Output metrics: Gross profit margin %, payback period (months), net return. Rendered with tabular font formatting.

### 3.5 Purchasing & 3-Way Match Control (`src/components/features/purchasing`)
- **PO Builder Modal:** Includes real-time Open-PO same-SKU checker. If an open PO exists for the same item, display a prominent warning banner with existing PO quantity before proceeding.
- **Goods Receipt (RR) Modal:** Barcode-assisted scanner view. Enforces atomic inventory updates and hard-blocks over-receiving beyond approved PO limits.
- **3-Way Match Inspection Drawer:** 3-column side-by-side verification view comparing:
  - Column 1: Approved Purchase Order details & quantities.
  - Column 2: Received Goods (RR) quantities & batch codes.
  - Column 3: Vendor Invoice totals & tax calculations. Match indicator badge shows `3-WAY MATCH VERIFIED` in green or `QUANTITY MISMATCH` in red.

### 3.6 Finance, Client SOA & Check Allocation (`src/components/features/soa`, `finance`)
- **Client SOA Ledger View:** Official Statement of Account layout matching company templates. Includes dynamic client selection (Gatchalian Medical Lab, ACE Medical Center, Pampanga Regional Hospital, Quezon City Diagnostic Center).
- **Multi-Invoice Check Allocation Matrix:** Interactive allocation table allowing users to input a total customer check amount and split payments across multiple invoices with real-time balance remaining indicators.
- **Non-PO RFP Vouchers:** Expense request builder featuring GL Chart of Accounts picklist, disbursement bank selection (BDO / Metrobank / BPI), and file upload dropzone for proof of payment.

### 3.7 Admin Console & User Permissions Matrix (`src/components/features/admin`)
- **Matrix View:** 7-column grid displaying all system permissions across Admin, Chairman, GM, Bookkeeper, Warehouse, Marketing, and Sales roles.
- **User Profile Modal:** Self-service console for Admin/Chairman roles to toggle granular module privileges and audit user login sessions.

---

## 4. Mobile Ergonomics & PWA Specifications

- **Target Breakpoint:** Mobile view under `1024px` (optimized for 375px - 430px smartphone viewports).
- **Bottom Navigation Rail (`BottomNav.tsx`):** Fixed bottom bar containing 4 primary touch destinations + central camera scanner button (`min-height: 56px`, touch targets `>= 44px`).
- **Mobile Bottom Sheets (`mobile-modal-container`):** All dialogs and modal forms transition into smooth bottom sheets sliding up from the screen bottom on viewports `< 640px`.
- **Camera Barcode Scanner:** Fullscreen camera viewfinder interface with flash toggle, barcode bounding box overlay, and audio feedback beep on scan.

---

## 5. Micro-Animations, Feedback & States

- **Spring Physics & Transitions:** Use standard CSS transitions (`transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1)`).
- **Button Tactile Feedback:** All primary buttons feature active press compression (`active:scale-[0.98] active:translate-y-px`).
- **Skeleton Loading States:** Replace generic spinners with animated pulse skeletons matching exact card and table row dimensions.
- **Form Feedback:** Dynamic form feedback using `:user-invalid` (rose border `#DC2626` + warning text) and `:user-valid` (green border `#16A34A`).

---

## 6. Accessibility & Compliance (WCAG 2.2 AA)

- **Keyboard Navigation:** Complete tab navigation and focus trapping in all modals and slide-overs, using the existing primitive layer or explicit native focus management.
- **Focus Ring Indicator:** High-visibility focus ring (`focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`).
- **Contrast Ratios:** Primary body text `#0F172A` on `#FFFFFF` background achieves a 15.3:1 contrast ratio (exceeds AAA requirement).
- **Screen Reader Semantics:** Use landmarks, labels, table captions/scopes, status live regions, and `aria-describedby` only for concise dialog descriptions; do not add ARIA where native HTML already provides the correct semantics.

---

## 7. Implementation Roadmap

The following sequence records the completed baseline and the remaining
feature-module roadmap:

- **Completed baseline:** global tokens, branded header/navigation, role action
  center, approval activity table, document inspector focus management, API
  status treatment, responsive navigation, and reduced-motion support.

1. **Phase 2.1: CSS & Tokens Setup (`src/app/globals.css`) — complete**
   - CSS custom properties, quiet badge utilities, focus styles, responsive
     shell tokens, and the licensed local Outfit variable font are implemented
     through `next/font/local`.

2. **Phase 2.2: Shell & Navigation Refactor — complete**
   - `Header.tsx`, `BottomNav.tsx`, and `MobileNavDrawer.tsx` use the branded
     responsive shell, shared role permissions, and accessible operations-menu
     behavior. `Sidebar.tsx` remains unmounted legacy code.

3. **Phase 2.3: Reusable Component Polish**
   - Enhance Rx Pill badges, status pills, data table wrappers (`table-responsive-wrapper`), and bottom sheet modal containers (`mobile-modal-container`).

4. **Phase 2.4: Core Feature Modules Refactor**
   - Upgrade Overview (`src/components/features/overview`), Inventory (`src/components/features/inventory`), Quotations (`src/components/features/quotations`), Purchasing (`src/components/features/purchasing`), Finance/SOA (`src/components/features/soa`), and Admin (`src/components/features/admin`).

5. **Phase 2.5: Verification & Quality Assurance — current pass**
   - `npm run lint`, `npx tsc --noEmit`, and `npm run build` run in the pinned
     `node:24.18-alpine3.24` Podman environment. The release font contract also
     requires a network-disabled frontend build after dependencies and the
     image have been obtained; it must not request Google Fonts. npm registry,
     container-image, and other module/image downloads still require deployment
     network access. Backend authorization, authenticated deployment, and full
     accessibility assistive-technology testing remain release prerequisites.
   - The 2026-08-14 repair verified that contract with `--network=none`:
     lint, TypeScript, and the Webpack static export passed using the vendored
     Outfit asset. `npm run deploy:demo` remains an operator-run remote step.
