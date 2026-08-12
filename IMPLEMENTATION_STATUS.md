# AccuStandard implementation status

**Audit date:** 2026-08-12  
**Status:** Demo runtime; not a production acceptance release

This file is the short operational companion to the confirmed developer
handoff and acceptance-test handoff. It records what the repository actually
implements so that a visual demo is not mistaken for a completed ERP.

## Source-of-truth order

1. `implementation_plan.md` for UI/UX scope
2. `AccuStandard_Developer_Correction_and_Acceptance_Test_Handoff.md` for business rules and acceptance behavior
3. `IMPLEMENTATION_STATUS.md` for actual current runtime status
4. `README.md`, `ARCHITECTURE.md`, and `CONTRIBUTING.md` for operations
5. `AccuStandard_Developer_Handoff_UPDATED.md`, the web spec, and blueprint for supporting requirements
6. Older handoffs, transcripts, prompts, and design-reference material

Where an older document conflicts with the first four, the first four control.

## Runtime boundary

- Frontend: Next.js 16 App Router static export from `src/`, served below
  `/accustandard/demo`.
- Backend: `backend/cmd/server` Go API below
  `/accustandard/demo/api/v1`.
- Database: PostgreSQL 17 through the legacy-cleanup migration,
  GORM `AutoMigrate`, and idempotent demo seed
  `backend/migrations/002_seed_data.sql`.
- The obsolete prototype server, Drizzle schema/configuration, and incompatible
  prototype SQL files were removed. They are not part of the deployed demo.
- The browser seed is an offline rendering fallback. The reset timer uses
  `localStorage`; business transactions must not use it as persistence.
- The UI uses the Go `/readiness` endpoint to classify the API as connected;
  partial list hydration does not make a degraded API authoritative.

## UI delivery status

- The dashboard now opens in the General Manager demo view with “Needs Your
  Attention Today,” three equal action cards in the reference order, and a
  compact PO table. Desktop navigation is horizontal and filtered to the
  active role's allowed modules; mobile retains the drawer and bottom
  navigation. Counts remain sourced from the seeded/API data rather than being
  fabricated to match a design mockup.
- Header secondary operations are grouped under `Operations & tools`; the
  primary `Create new` trigger opens the existing command palette without
  changing workflow permissions.
- Purchasing separates Purchase Orders from Receiving Reports, and Inventory
  exposes Class 1/2/3 stock filters plus a critical-stock reorder entry point.
- Quotation, PO, RFP, and Receiving Report entry use three-step progressive
  disclosure wizards; workflow steppers and inspector actions remain UI-only
  where the corresponding backend record is not implemented.
- The manager demo data includes a real pending GM approval and dated PO rows;
  `Review Approvals` opens the relevant inspector/review path instead of
  silently approving a record.

## Implemented API surface

The deployed API currently provides reads and limited mutations for inventory
receiving, replenishment, RFQs, approval records, SOA allocation, purchase
orders, RFPs, the QBO queue, and audit-log reads. Receiving and collection
allocation are transactional and validate state/amount constraints. The UI
still contains local preview behavior for quote approval/acceptance/fulfillment,
stock/product masters, vendor invoices and 3-way match, startup imports,
exports, attachments, and some cross-module queue side effects.

Those preview paths must be described as demo-only until they have a
server-backed record, authorization, audit event, and refresh-safe test.

## Confirmed control rules

- Sales Quote approval ends at GM; no DCS Sales Quote task is valid.
- Procurement/RFP DCS approval is conditional on configured rules.
- Goods Receipt rejects non-positive and over-PO quantities atomically.
- A fully received PO remains `AWAITING_VENDOR_INVOICE` until a separate
  vendor-invoice/3-way-match implementation exists.
- Class 3 supplier POs require a linked customer PO.
- RFP creation creates a server approval record; RFP release requires completed
  approval, is row-locked/idempotent, and writes an audit event.
- PO creation creates a server approval record and supports Accounting → GM →
  optional DCS transitions using `DCS_PO_THRESHOLD`; Admin-managed rule
  persistence is still not implemented.
- Open-PO shortage requests may create only the uncovered quantity when a
  non-empty shortage exception reason is supplied.
- RFP DCS routing is conditional on the optional `DCS_RFP_THRESHOLD` runtime
  setting; Admin-managed rule persistence and conditional PO DCS routing remain
  pre-acceptance gaps.
- The demo API is unauthenticated and must not handle real company data.
- QBO behavior in this runtime is a queue/demo stub, not a live QuickBooks
  Online integration.
- Caddy and the remote deployment script now agree on the static export root:
  `/home/jk/bridge-ph/accustandard-demo/web-dist/`.
- The remote demo deploy explicitly starts the PostgreSQL Quadlet, waits for
  `pg_isready`, restarts the API Quadlet, verifies both user services, and
  checks `/accustandard/demo/api/v1/readiness`. Frontend dependencies/build
  output remain disposable; the backend runtime image is retained by design.
- The VPS target is Fedora CoreOS with rootless user Quadlets. Deployment stops
  active demo services before reloading units, removes a PostgreSQL data
  directory whose major version is not 17 (or an incomplete non-empty
  directory with no `PG_VERSION`), and initializes the approved PostgreSQL 17
  demo data. The database Quadlet reports healthy through `pg_isready` before
  the API service starts. No legacy database backup is retained.

## Validation record

Frontend validation for this UI pass must run in disposable Podman only;
local host builds are not required. Remote VPS deployment, PostgreSQL
integration, authentication, and the full acceptance matrix remain unverified
unless a dated run is recorded here. This status file must not claim a
production acceptance release from a lint/build result alone.

### 2026-08-12 UI/documentation pass

- `git diff --check`: passed.
- `bash -n scripts/deploy-demo.sh scripts/vps-deploy-accustandard.sh`: passed.
- Disposable `node:lts-alpine` Podman: `npm run lint`: passed.
- Disposable `node:lts-alpine` Podman: `npm run build`: passed with Next.js 16 Webpack
  static export (`/` and `/_not-found` prerendered).
- The default Next.js 16 Turbopack build was killed by the available local
  Podman VM memory; this is why the package build uses the documented
  `--webpack` opt-out. No host build artifacts were retained.
- `npm ci` reported 8 audit findings (4 moderate, 3 high, 1 critical); no
  automatic audit fix was applied because it could change the lockfile or
  introduce breaking upgrades.

## Current-framework notes

The repository targets Next.js 16/React 19/Tailwind 4. Next.js 16 requires
Node.js 20.9 or newer and no longer runs lint as part of `next build`; the
repository therefore keeps separate `npm run lint` and `npm run build`
commands. The build script uses the official `--webpack` opt-out for the
resource-constrained demo VPS; Next.js 16's default Turbopack path remains a
future capacity-gated option. Static export support is intentionally limited to
client-side runtime calls for the external Go API. Refer to the [Next.js static
export guide](https://nextjs.org/docs/app/guides/static-exports),
[Turbopack documentation](https://nextjs.org/docs/app/api-reference/turbopack),
[Tailwind v4 theme variables](https://tailwindcss.com/docs/theme),
[Tailwind container queries](https://tailwindcss.com/docs/responsive-design#container-queries),
[WCAG 2.2](https://www.w3.org/TR/WCAG22/), and
[Radix accessibility guidance](https://www.radix-ui.com/primitives/docs/overview/accessibility).
Existing Radix components do not require a shadcn migration.

The security review uses OWASP Top 10:2025 and ASVS 5.0 as current references.
This is guidance for the next hardening phase, not a claim of compliance.
