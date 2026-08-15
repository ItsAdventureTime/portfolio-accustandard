# AccuStandard Phase 3 review and implementation record

**Date:** 2026-08-14
**Scope:** `ANTIGRAVITY_CURRENT_DESIGN.md` + `ANTIGRAVITY_DESIGN_PLAN.md`
**Guardrail:** preserve ERP business logic, RBAC behavior, and API contracts.

## Review context

The design briefs describe a calm, decision-first enterprise workspace with
high-density data tables, role-aware navigation, mobile bottom navigation, and
accessible sheets/drawers. The current repository is a Next.js App Router
application using React 19, Tailwind CSS v4, and Radix packages already present
in `package.json`.

The implementation keeps that stack. It does not add a new component library,
replace the data model, or move business logic between the client and Go API.

## Current guidance mapped to the briefs

### Typography and data density

The current-design audit calls out the generic system stack and proportional
numbers. The plan asks for Outfit/Geist Mono, tighter display type, and tabular
figures. Tailwind v4's current guidance treats `@theme` variables as the
CSS-first source for utility-generating tokens, while ordinary `:root`
variables remain appropriate for semantic values that do not need utilities.

Implementation:

- `src/app/globals.css` defines an `@theme` font/token layer plus semantic
  aliases used by existing modules.
- `tabular-data`, `data-number`, and `font-mono` now opt into tabular figures.
- `text-wrap: balance` and `text-wrap: pretty` reduce awkward headings and
  paragraph endings.
- The font stack uses the vendored Outfit variable font through
  `next/font/local`, keeps Geist Mono for code/data, and retains local system
  fallbacks without a new network font dependency.

### Frontend font build contract

The production frontend build no longer depends on Google Fonts. Outfit's
license and provenance are tracked beside the vendored WOFF2 in
`src/app/fonts/`. Dependency installation, npm registry access, pinned image
pulls, and other module/image downloads still require deployment network
access; after those prerequisites are obtained, the frontend build must also
pass with network access disabled.

Reference: [Tailwind theme variables](https://tailwindcss.com/docs/theme).

### Surfaces, status, and hierarchy

The briefs ask for quiet chrome, muted status fills, tinted shadows, and a
single considered brand accent. The implementation uses slate-blue neutrals,
quiet status tokens, a restrained sapphire action color, and a shared
`wayfinding-card` elevation primitive. Existing feature classes continue to
work through backward-compatible token aliases.

### Layout and responsive behavior

The plan asks for a decision-first overview, stable max-width containers, CSS
Grid, mobile cards, and `dvh`-safe bottom sheets. The application shell now uses
a responsive rail up to `1680px`, the overview action center uses an asymmetric
grid, and mobile navigation/sheets use `85dvh`-bounded content with safe-area
spacing.

MDN documents `dvh` as the viewport unit that responds to dynamic browser
chrome, while noting that it can resize during scrolling. The sheet uses it for
bounded overlays rather than a permanent full-screen page section.

Reference: [MDN viewport-percentage lengths](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length).

### Interaction, motion, and states

The briefs request hover/pressed feedback, smooth transitions, skeletons, and
reduced motion. Shared buttons now have a short transform/color transition and
pressed-state compression; focus-visible styling is global; `sheet-enter`,
`fade-enter`, and `skeleton` primitives are available to feature modules; and
the reduced-motion media query disables non-essential animation and smooth
scrolling.

Reference: [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

### Accessibility and modal behavior

WCAG 2.2 adds Target Size (Minimum), Focus Not Obscured (Minimum), and other
criteria relevant to this touch-first ERP shell. The plan's 44px touch-target
goal is intentionally stricter than the 24px minimum for most controls. The
global focus ring is visible and offset, and the layout adds a skip link.

The mobile navigation drawer now uses the existing Radix Dialog dependency.
That gives the sheet an accessible title/description, modal semantics, Escape
handling, focus containment, and focus restoration behavior. WAI-ARIA APG is
used as interaction guidance; it is not itself a normative conformance
standard.

References: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), and [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog).

### Metadata and production quality

Next.js's current production guidance recommends the Metadata API, production
build verification, Lighthouse/Core Web Vitals checks, and accessible error
fallbacks. The existing metadata remains in the App Router layout and now has
an application name and clearer description. No claim is made here that field
performance has been measured: the relevant good thresholds are LCP ≤ 2.5s,
INP ≤ 200ms, and CLS ≤ 0.1 at the 75th percentile.

Reference: [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist) and [web.dev Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds).

## Implemented files

- `src/app/globals.css` — tokens, surfaces, data ergonomics, focus, motion,
  reduced-motion, sheets, skeletons, and print layering.
- `src/app/layout.tsx` — metadata refinement and skip-to-content link.
- `src/app/page.tsx` — stable `100dvh` shell and `main-content` landmark.
- `src/components/layout/Header.tsx` — quiet header/search/role switcher and
  clearer QBO queue semantics.
- `src/components/layout/Sidebar.tsx` — semantic navigation state attributes.
- `src/components/navigation/BottomNav.tsx` — mobile nav landmark, current
  page state, and scanner label.
- `src/components/navigation/MobileNavDrawer.tsx` — Radix modal sheet with
  accessible labeling and focus management; role access now matches the
  page/header source of truth.
- `src/components/navigation/CommandPaletteModal.tsx` — Radix command dialog
  with working Cmd/Ctrl+K open/close behavior and Arrow/Enter navigation.
- `src/app/manifest.json` + `src/app/icon.svg` — App Router PWA metadata and a
  basePath-safe branded icon without restoring the user's pre-existing deleted
  `public/` files.
- `src/components/features/overview/RoleActionCenter.tsx` — asymmetric,
  quieter attention cards and sentence-case hierarchy.
- `src/components/features/overview/ExecutiveOverview.tsx` — quiet status
  badges and shared data-table surface.
- `src/components/features/inventory/InventoryControl.tsx` — semantic tabs,
  filter labeling, and the shared inventory surface.
- `src/components/features/quotations/QuotationGenerator.tsx`,
  `src/components/features/purchasing/PurchasingReceiving.tsx`,
  `src/components/features/soa/StatementOfAccount.tsx`,
  `src/components/features/rfp/RequestForPayment.tsx`, and
  `src/components/features/admin/SystemAuditTrail.tsx` — shared feature-module
  headings, wayfinding cards, responsive table wrappers, and sentence-case
  hierarchy across the remaining primary workspaces.

## Validation protocol

Run the project toolchain inside the initialized Docker Sandbox:

Obtain dependencies and the pinned builder image while networked, then repeat
the frontend lint, type-check, and build with network access disabled. The
offline build is the release-blocking font check; it must not request Google
Fonts or use `next/font/google`.

```bash
jk-sbx-project ensure
jk-sbx-project exec npm ci --no-audit --no-fund
jk-sbx-project exec npm run lint
jk-sbx-project exec npx tsc --noEmit --incremental false
jk-sbx-project exec npm run build
```

The 2026-08-14 Podman result is retained as historical evidence only. Current
release validation uses the Docker Sandbox, and the backend image is built
there for the VPS target platform.

Then run the local-build demo release path only after reviewing `git status`:

```bash
npm run deploy:demo
```

The deployment script builds the frontend and backend image locally, transfers
the release artifacts, and activates the existing VPS runtime. It does not
transfer source or perform compilation on the VPS.

## GitHub synchronization

Remote repository synchronization follows
[`GITHUB_HTTPS_WORKFLOW.md`](GITHUB_HTTPS_WORKFLOW.md): the active GitHub CLI
account is authenticated on `github.com`, the Git protocol is `https`, and the
origin is `https://github.com/ItsAdventureTime/bridge-accustandard.git`. GitHub
CLI has no separate `gh push` command. Local commits use local Git because
GitHub CLI has no local commit command; remote Git objects and the `main` ref
are published with authenticated `gh api` Git Database calls over HTTPS.

## Remaining follow-up

The active desktop shell intentionally remains the horizontal Header navigation:
`IMPLEMENTATION_STATUS.md` documents that as the current runtime behavior, and
`Sidebar.tsx` is not mounted by `page.tsx`. The Sidebar received semantic state
updates but should not be mounted without a product decision because doing so
would create two desktop navigation sources of truth.

The modal consistency pass migrated the remaining hand-rolled feature dialogs
to the shared Radix `AccessibleModal` shell. Module content and workflow
callbacks remain local, while the shell now owns modality, focus containment
and restoration, Escape handling, safe-area spacing, scroll containment, and
the branded visual surface.

## Focused action and mobile operations contract

The current shell uses shared primary/supporting/quiet/attention action styles
and native `More actions` disclosures for low-frequency controls. Desktop
operations remain an APG menu button labeled `More tools`; the mobile Radix
drawer exposes one permission-filtered `Operations & tools` disclosure using
the existing `canUseOperation` checks and page callbacks for export, startup
import, QBO queue, barcode manager, scanner, and PWA installation.

The 2026-08-14 screenshot follow-up also softened visible table and workflow
copy: sentence case is preferred, regular/medium text carries most information,
and heavier weights are reserved for headings, active controls, and critical
status values. This keeps the branded navy/royal/red hierarchy legible without
turning every label into an alarm.

## Luna audit hardening pass

The follow-up review found that several visual affordances were attached to
synthetic or non-persisted financial states. The implementation now:

- makes the API's demo boundary explicit with `APP_ENV=demo` and a
  request-context `X-Demo-Role`; non-demo protected routes fail closed;
- removes the forced 3-way-match evidence path and labels local invoice,
  acceptance, import, and approval flows as previews until a backend commit
  exists;
- separates live empty SOA data from offline seed rows and keeps collection
  allocation targets inside the active rows;
- exposes RFP release only for backend-eligible statuses and shows a blocking
  reason for pending or rejected vouchers;
- derives admin user permissions from the canonical role matrix and limits
  edits to Admin and Chairman (DCS), while keeping read-only visibility clear;
- filters mobile operations to permitted actions, adds Create new parity, and
  uses real keyboard-reachable table actions and semantic headers;
- adds null-safe inventory search, lot-number matching, no-result states, and
  a shared Radix-based modal shell for focus containment, Escape handling, and
  focus restoration across the high-impact dialogs.

SmoothUI remains a selective reference rather than a wholesale component or
framework migration. The current app uses CSS transitions plus its existing
`prefers-reduced-motion` contract. If Motion is added, follow the official
[accessibility guidance](https://motion.dev/docs/react-accessibility) and
[`MotionConfig reducedMotion="user"`](https://motion.dev/docs/react-motion-config).

## Modal consistency pass

The 2026-08-14 modal audit found mixed hand-built and Radix-backed overlays.
The implementation now uses one shared shell for center dialogs, bottom sheets,
full-screen print previews, inspectors, form wizards, scanners, QBO queue,
PWA installation, command search, and mobile navigation. Shared modal tokens
provide a single overlay, panel elevation, close target, mobile safe-area
behavior, and reduced-motion transition contract. Feature-specific panels keep
their existing data and approval behavior but no longer own fixed z-index
wrappers.

The migration follows the [WAI-ARIA Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/),
[WAI-ARIA Alert and Message Dialogs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/),
[Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog),
and SmoothUI's [responsive and accessible component reference](https://github.com/educlopez/smoothui).

## Notification consistency pass

The generic action feedback path now uses a shared Radix Toast center rather
than a blocking modal for every success, role change, preview, scan, access, or
API result. Notifications carry explicit severity; routine user-action results
use foreground announcements, low-urgency informational updates use
background announcements, and offline state stays in the persistent page
status region. Inline validation uses assertive alert semantics adjacent to the
affected controls. `SystemAlertModal` is reserved for an intentional
workflow-interrupting `alertdialog` and no longer dismisses from a global Enter
handler.

The implementation follows the [WAI-ARIA alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/),
[alertdialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/),
and [Radix Toast guidance](https://www.radix-ui.com/primitives/docs/components/toast).
