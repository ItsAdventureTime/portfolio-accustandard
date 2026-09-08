# AccuStandard implementation status

**Audit date:** 2026-08-14
**Status:** Demo runtime; not a production acceptance release

### 2026-09-08 manual Compose deployment validation

- Docker Sandbox contract check passed with
  `jk-sbx-project exec bash scripts/check-demo-deployment-contract.sh`.
- Docker Sandbox shell syntax check passed for
  `scripts/check-demo-deployment-contract.sh` and `scripts/deploy-demo.sh`.
- `git diff --check` passed.
- No application image build, running-stack test, or public deployment was
  performed in this validation pass.

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

- Frontend: Next.js 16 App Router static export from `src/`, served at the
  demo root by the image-only Compose frontend.
- Backend: `backend/cmd/server` Go API at `/api/v1` behind the frontend
  reverse proxy.
- Database: PostgreSQL through the floating `postgres:alpine` image, with the
  current migration baseline tested against PostgreSQL 17, through legacy cleanup,
  `backend/migrations/004_reconcile_runtime_columns.sql`, GORM `AutoMigrate`,
  and idempotent demo seed `backend/migrations/002_seed_data.sql`.
- Database startup order is PostgreSQL health → legacy cleanup → legacy-column
  reconciliation → GORM `AutoMigrate` → seed SQL. Reconciliation preserves
  pre-fix `d_csstatus`/`s_idate` values as canonical `dcs_status`/`si_date`
  columns. Seed `INSERT` targets must use each model’s default pluralized
  snake_case GORM table name; focused backend tests check these contracts
  without requiring SSH or a live database.
- The obsolete prototype server, Drizzle schema/configuration, and incompatible
  prototype SQL files were removed. They are not part of the deployed demo.
- The browser seed is an offline rendering fallback. The reset timer uses
  `localStorage`; business transactions must not use it as persistence.
- The UI uses the Go `/readiness` endpoint to classify the API as connected;
  partial list hydration does not make a degraded API authoritative.

## UI delivery status

- The dashboard now opens in the General Manager demo view with “Needs Your
  Attention Today,” a role-tailored asymmetric action center, and a compact PO
  table. Desktop navigation is horizontal and filtered to the active role's
  allowed modules; mobile retains the drawer and bottom navigation. Counts
  remain sourced from the seeded/API data rather than being fabricated to match
  a design mockup.
- The supplied AccuStandard logo is used in the shell. Brand tokens are
  centralized in `src/app/globals.css`, with navy/royal navigation, Rx red
  attention states, visible keyboard focus, and reduced-motion support.
- The dashboard exposes an explicit live/offline status region. When the Go API
  is unavailable, the UI labels itself as an offline demo and does not imply
  persistence.
- `src/lib/permissions.ts` is the shared typed client-side permission model for
  allowed tabs, create/export/import/QBO/barcode/scanner/PWA/admin operation
  helpers, approval selectors, reviewable PO targets, and role/action-specific
  navigation counts. These UI checks do not secure backend APIs.
- Header secondary operations are grouped under `Operations & tools`; the
  menu uses stable WAI-ARIA menu-button semantics, keyboard open/navigation
  (Enter, Space, Arrow Up/Down, Home, End), Escape/outside-pointer close, and
  focus return. The role selector is labeled as a demo simulation.
- Outfit is vendored at `src/app/fonts/Outfit-Variable.woff2` under the SIL Open
  Font License 1.1, with the license and retrieval record beside the asset. It
  is loaded through `next/font/local` and remains exposed to the existing
  `--font-outfit`/`font-sans` token without adding a runtime dependency.
- The frontend build no longer needs Google Fonts CSS or font data. npm registry,
  container-image, and other application/module downloads still require
  deployment network access. The offline-build contract installs dependencies
  and pulls the current floating image tags first, then runs the frontend build with network
  access disabled and verifies that no `next/font/google` import remains.
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
- Protected demo API routes require `APP_ENV=demo` and a valid `X-Demo-Role`
  request-context value; this is a forgeable demo boundary and must not handle
  real company data.
- Approval handlers derive the simulated actor from request context instead of
  accepting a caller-controlled JSON role. Non-demo protected routes fail
  closed. Trusted production authentication, session identity, and
  server-enforced authorization remain unresolved requirements; client-side
  role simulation and the demo header are not substitutes for those controls.
- QBO behavior in this runtime is a queue/demo stub, not a live QuickBooks
  Online integration.
- **Historical deployment record (inactive):** Caddy and the former remote
  deployment script agreed on the static export root
  `/home/jk/bridge-ph/accustandard-demo/web-dist/`.
- **Historical deployment record (inactive):** The former remote demo deploy
  explicitly started the PostgreSQL Quadlet, waited for
  `pg_isready`, restarts the API Quadlet, verifies both user services, and
  waits up to 60 seconds for `/demo/accustandard/api/v1/readiness` with curl
  retries for transient listener startup failures. `Notify=healthy` gates the
  database/container service, not necessarily the Go HTTP listener. A timeout
  prints API systemd status and the last 100 journal lines before the script
  exits nonzero. Frontend dependencies/build output remain disposable; the
  backend runtime image is retained by design.
- **Historical deployment record (inactive):** The VPS target was Fedora
  CoreOS with rootless user Quadlets. Deployment stopped
  active demo services before reloading units, removes a PostgreSQL data
  directory whose major version is not 17 (or an incomplete non-empty
  directory with no `PG_VERSION`), and initializes the approved PostgreSQL 17
demo data. The database Quadlet reports healthy through `pg_isready` before
the API service starts. Rootless data reset uses `podman unshare` so
subordinate-UID-owned files remain manageable without recursive ownership
rewrites. No legacy database backup is retained. The reset helper emits
line-free state tokens (`version:17`, `version:16`, `invalid`, or `empty`),
fixing the parser ambiguity that produced values such as `emptyn` while
preserving the rootless `podman unshare` and PostgreSQL 17 reset policy.
- **Historical deployment record (inactive):** The former Compose and
  Dockerfile paths used floating official Alpine
  tags: Node `node:alpine`, Go `golang:alpine`, Alpine `alpine:latest`, Nginx
  `nginx:alpine`, and PostgreSQL `17-alpine`. Local Docker builds use `--pull`
  to retrieve current upstream images. Floating tags improve patch freshness
  but do not provide reproducible builds; record resolved digests when an
  auditable release is required. The legacy VPS Quadlets remain versioned for
  traceability.
- The active demo uses the manual image workflow in
  [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md): Docker Sandbox builds and
  exports `accustandard-demo-api:latest` and
  `accustandard-demo-frontend:latest`, and OrbStack runs them with PostgreSQL
  on the internal `accustandard-network`. No service publishes a host port;
  only the frontend joins the external `cloudflared-network` with the unique
  `accustandard-demo-frontend` alias.
- Active Compose and Dockerfile base images use floating official Alpine tags:
  Node `node:lts-alpine`, Go `golang:alpine`, Alpine `alpine:latest`, Nginx
  `nginx:alpine`, and PostgreSQL `postgres:alpine`. Builds use `--pull`;
  record resolved image digests when a repeatable demo snapshot is required.

## Historical validation record

### 2026-08-22 documentation, framework, and remote audit

- Reviewed the active architecture, deployment, implementation, accessibility,
  contribution, security, and GitHub HTTPS guides against the checked-in
  configuration. The frontend remains a Next.js 16 static export with an
  explicit Webpack build path; the backend module declares Go 1.22.
- Fetched `origin/main` and confirmed the tracked documentation content matched
  the remote before this audit record was added. The authenticated `gh` session
  and `origin` both use HTTPS; repository publication must not require SSH
  transport or an SSH key.
- Checked current official guidance: Next.js 16 defaults builds to Turbopack,
  while the existing `build` script intentionally selects Webpack. Node 20 is
  end-of-life, so use the current Node 24 LTS line for development even though
  the package compatibility floor remains `>=20.9` until a separately tested
  runtime upgrade changes that contract.
- References: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports),
  [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16),
  and [Node.js releases](https://nodejs.org/en/about/previous-releases).

Frontend validation for this UI pass must run in the initialized Docker Sandbox;
macOS host builds are not required. The VPS receives release artifacts and
activates its existing rootless Podman runtime; it does not compile or build
source. PostgreSQL integration, authentication, and the full acceptance matrix
remain unverified unless a dated run is recorded here. This status file must not
claim a production acceptance release from a lint/build result alone.

### 2026-08-14 deployment incident repair

- The attached deployment transcript's SQLSTATE `42703` was reproduced:
  GORM generated `d_csstatus` while seed SQL required `dcs_status`; the
  latent `s_idate`/`si_date` mismatch was repaired in the same pass.
- Canonical GORM column tags, the idempotent compatibility migration, and
  transactional runtime SQL execution are implemented. The compatibility
  migration copies legacy values before removing old aliases with incompatible
  `NOT NULL` constraints.
- Disposable PostgreSQL 17 Podman integration passed from an empty database:
  API readiness returned `{"db":"connected","status":"ready"}` and seed
  data loaded.
- Legacy-schema integration passed with pre-fix `d_csstatus`/`s_idate` columns:
  values were preserved in `dcs_status`/`si_date`, old aliases were removed,
  and readiness succeeded.
- Restarting the API against the reconciled database passed without changing
  seeded row counts. Backend `go test ./...` and `go vet ./...` passed in
  disposable Podman.
- The invalid non-hex seed UUID literals found after the first repair were
  corrected and are covered by the seed validation contract.
- Pinned `node:24.18-alpine3.24` passed `npm ci`, `npm run lint`,
  `npx tsc --noEmit`, and `npm run build` before the local-font remediation;
  that pass did not cover a network-disabled build. The remediation and its
  focused offline-build result are recorded in the dated entry below.
- The remote VPS deployment was not run in this audit; operator verification
  remains required after publishing.

### 2026-08-12 UI/documentation pass

- `git diff --check`: passed.
- `bash -n scripts/deploy-demo.sh scripts/vps-deploy-accustandard.sh scripts/vps-migrate-to-go.sh`: passed.
- Disposable `docker.io/library/node:lts-alpine` Podman: `npm run lint`: passed.
- Disposable `docker.io/library/node:lts-alpine` Podman: `npm run build`: passed with Next.js 16 Webpack
  static export (`/` and `/_not-found` prerendered).
- The default Next.js 16 Turbopack build was killed by the available local
  Podman VM memory; this is why the package build uses the documented
  `--webpack` opt-out. No host build artifacts were retained.
- `npm ci` reported 8 audit findings (4 moderate, 3 high, 1 critical); no
  automatic audit fix was applied because it could change the lockfile or
  introduce breaking upgrades.

### 2026-08-14 full-shell UI/UX redesign pass

- The shared shell now uses a responsive `1680px` content rail, calmer
  typography weights, the supplied AccuStandard wordmark, navy/royal/red brand
  tokens, and a tablet-safe header breakpoint.
- The overview action center uses one primary priority card with two stacked
  secondary cards; counts, destinations, approval identity, and role gates are
  unchanged.
- Mobile bottom navigation keeps the barcode scanner as the single elevated
  action. The mobile drawer uses lighter controls and preserves locked-module
  feedback for restricted roles.
- `git diff --check`: passed before final validation; repeat after any further
  edits.
- Disposable pinned `node:24.18-alpine3.24` Podman validation passed for
  `npm ci --ignore-scripts`, `npm run lint`, `npx tsc --noEmit`, and
  `npm run build`; no host dependencies or build artifacts were retained.
- Browser visual review covered 1536px desktop, 1280px desktop, 1024px tablet,
  and 390px mobile. The mobile drawer opened successfully after enabling the
  development-only `allowedDevOrigins` entry for `127.0.0.1`; role selection
  remained permission-aware. This is a visual/UI smoke check, not production
  acceptance or a full WCAG conformance result.

### 2026-08-14 role, accuracy, and keyboard hardening pass

- Added `src/lib/permissions.ts` as the shared typed client-side source for
  role tabs, operation visibility, approval-stage rules, reviewable PO targets,
  and role-scoped dashboard/mobile counts.
- Header tools, QBO visibility, the mobile drawer, and the bottom scanner
  action now consume the shared operation permissions. These checks improve
  the demo UI only; they are not backend authorization.
- Removed the overview's arbitrary first-eight PO slice. Review counts,
  review targets, and mobile badges now use the same role-scoped selectors.
- Implemented WAI-ARIA menu-button behavior for the desktop operations menu,
  including keyboard opening/navigation, Escape and outside-pointer close, and
  focus return.
- Replaced the Google-hosted Outfit loader with the licensed local variable
  WOFF2, preserved the `--font-outfit` class/variable contract, and aligned the
  active design and deployment guides with the offline-build requirement.
- `eslint-config-next@16.3.0` is available and peer-compatible, but the lock-only
  resolution would upgrade unrelated transitive packages. The existing
  `eslint-config-next` 15.5.22 resolution is preserved; align it in a separate
  reviewed dependency refresh.
- Podman validation passed after follow-up fixes: `npm ci
  --ignore-scripts --no-audit --no-fund`, `npm run lint`, `npx tsc --noEmit`,
  and `npm run build` using `node:24.18-alpine3.24`.
- Backend authentication, session identity, server-enforced authorization,
  and full assistive-technology testing remain release prerequisites. The
  production dependency audit is clean after updating transitive `nanoid` to
  3.3.18; development-only Capacitor CLI `tar` findings remain and require a
  breaking major upgrade, so no force upgrade was applied.

### 2026-08-14 release-blocking font build remediation

- The production font path now uses `next/font/local` and the vendored Outfit
  variable WOFF2; it does not request Google Fonts during `next build`.
- The asset is tracked with its SIL OFL 1.1 license, upstream URLs, retrieval
  date, size, and SHA-256 in `src/app/fonts/`.
- Focused validation must run dependency installation and image pulls with
  network access, then run lint/type-check/build with network access disabled.
  npm registry, container-image, and other module/image downloads remain
  deployment-network prerequisites.
- On 2026-08-14, a disposable `node:24.18-alpine3.24` container with
  `--network=none` passed `npm run lint`, `npx tsc --noEmit --incremental
  false`, and `npm run build`; the static export prerendered `/`,
  `/_not-found`, `/icon.svg`, and `/manifest.json`.
- `bash -n` for the deployment scripts, `git diff --check`, and the source
  audit for runtime `next/font/google`/Google Fonts references also passed.
- `npm run deploy:demo` was not run during this repair; remote VPS deployment
  and post-deploy site/API verification remain operator steps.

### 2026-08-14 modal nested-surface consistency retry

- Re-audited every blocking dialog, document preview, scanner, drawer, and
  command surface after the first shared-shell pass. Legacy nested roots that
  still carried bespoke `rounded-2xl`/`rounded-3xl`, `shadow-2xl`, and
  `animate-in` treatment now use the shared `modal-panel` contract.
- Added explicit modal size tokens for compact, form, inspector, ROI, and
  document workflows. The shared panel now owns overflow, tinted elevation,
  calmer modal typography, and responsive spacing instead of each feature
  recreating its own card shell.
- Removed the RFQ preview's conditional pre-hook return so its state hooks
  remain stable while `AccessibleModal` owns open/close rendering.
- Source audit confirms no remaining `animate-in` modal wrappers or bespoke
  `fixed inset-0` overlays in `src/components`. Feature cards and the
  operations menu remain intentionally non-modal surfaces.
- This follow-up requires the same disposable Podman lint, type-check, build,
  and diff validation before publication.

### 2026-08-15 API readiness log cleanup

- The automated VPS readiness probes in `vps-deploy-accustandard.sh` and
  `vps-migrate-to-go.sh` now use curl's quiet mode without `--show-error`.
  Transient listener resets no longer print noisy `curl: (56)` lines for each
  retry while the Go API binds its port.
- `--fail`, retry limits, connection/read timeouts, and the explicit API unit
  status/journal diagnostics remain unchanged. Exhausting the 60-second probe
  still exits nonzero.
- Manual post-deployment verification commands retain `--show-error` so an
  operator-requested check still reports its own curl failure details.

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

For current interaction guidance, use the [Next.js accessibility
guide](https://nextjs.org/docs/architecture/accessibility), [Next.js
authentication guide](https://nextjs.org/docs/app/guides/authentication),
[Next.js font optimization guide](https://nextjs.org/docs/app/getting-started/fonts),
and the WAI-ARIA [menu button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/).

`next.config.ts` includes `allowedDevOrigins: ['127.0.0.1']` for local browser
verification of development-only chunks. Next.js applies this setting only in
development; it does not expand the production static export or API origin
policy.

The current macOS Compose/Dockerfile path follows floating official Alpine
tags so rebuilds can receive upstream maintenance releases. Rebuild with
`--pull`, then rerun the disposable build and database integration checks when
upstream images change. The legacy VPS Quadlet path continues to use reviewed
versioned images.
The release references are [Node's supported releases](https://nodejs.org/en/about/previous-releases),
[Go's release history](https://go.dev/doc/devel/release), and
[PostgreSQL 17.10 release notes](https://www.postgresql.org/docs/17/release-17-10.html).

The security review uses OWASP Top 10:2025 and ASVS 5.0 as current references.
This is guidance for the next hardening phase, not a claim of compliance.

### 2026-08-14 focused action hierarchy pass

- Shared action styles now distinguish one filled primary action from restrained supporting, quiet, attention, and native disclosure controls. Enabled controls retain pointer, focus-visible, and pressed feedback while disabled semantics remain unchanged.
- Desktop `More tools` keeps the existing menu-button keyboard behavior and exposes the operations label. Mobile navigation exposes one role-filtered `Operations & tools` disclosure wired to the existing export, import, QBO, barcode, scanner, and PWA callbacks.
- Inventory, quotation/RFQ, SOA, and admin screens reduce competing filled actions and loud uppercase emphasis. Rare actions remain reachable through visible `More actions` disclosures.
- The screenshot follow-up adds visible navigation hover surfaces and keeps most
  feature copy at regular/medium weight; stronger emphasis is reserved for
  headings, selected controls, and critical statuses.

### 2026-08-14 Luna audit hardening pass

- Reviewed the follow-up against the `redesign-existing-projects` audit
  checklist and SmoothUI's selective interaction patterns. No framework or
  animation dependency was added; the existing Radix primitives, CSS
  transitions, and reduced-motion contract remain the integration boundary.
- Added the explicit `APP_ENV=demo`/`X-Demo-Role` API boundary, request-context
  approval actor, fail-closed non-demo behavior, and a focused backend test.
- Removed forced 3-way-match evidence, separated live empty data from offline
  seed rows, gated RFP release UI to backend-eligible statuses, and labeled
  non-persisted financial/import/acceptance actions as previews.
- Added a shared Radix modal shell for focus containment, Escape handling,
  accessible naming, and focus restoration across high-impact dialogs. Table
  headers/captions, keyboard actions, inventory filtering, and mobile operation
  visibility now follow the same interaction contract.
- Podman validation passed after the final edits: `npm run lint`,
  `npx tsc --noEmit --incremental false`, `npm run build` with Next.js Webpack,
  `gofmt -d`, and `go test -p=1 ./...` in the pinned containers. The build
  prerendered `/`, `/_not-found`, `/icon.svg`, and `/manifest.json`.
- Browser visual QA and remote VPS deployment were not run in this pass. The
  production identity provider, persistent preview workflows, and full
  assistive-technology acceptance matrix remain release prerequisites.

### 2026-08-14 notification consistency pass

- Replaced the generic blocking notification popup with a shared Radix
  `NotificationCenter` that uses explicit severity, deduplication, bounded
  queuing, dismiss controls, predictable durations, and mobile safe-area
  placement above bottom navigation.
- Routine feedback now preserves workspace focus. User-action results use
  foreground toast announcements; low-urgency informational updates use
  background announcements. Offline state remains in the persistent page
  status region.
- Retained `SystemAlertModal` only as a real `alertdialog` contract with a
  visible title/description, focus containment/restoration, and explicit
  close/cancel actions. Form validation errors now use alert semantics and
  connect affected fields with `aria-describedby`/`aria-invalid`.
- Final notification validation is recorded after the Podman lint, TypeScript,
  and static build checks below; browser/device visual QA remains an operator
  follow-up.

### 2026-08-14 modal consistency pass

- Migrated legacy hand-built fixed overlays to the shared Radix
  `AccessibleModal` shell across inventory, purchasing, receiving, quotations,
  SOA, executive inspection, print preview, PWA installation, QBO export, the
  command palette, and mobile navigation.
- Added typed `center`, `sheet`, and `fullscreen` variants with shared size
  tokens, branded overlay/panel surfaces, safe-area padding, scroll containment,
  focus restoration, Escape handling, visible close targets, and reduced-motion
  safe transitions.
- Normalized modal headers, secondary actions, document preview controls, and
  mobile navigation surfaces so dialogs use the same sentence-case hierarchy,
  calm navy/royal palette, restrained borders, and touch-target contract.
- Removed the last bespoke `fixed ... z-50` modal wrappers from feature code;
  `SystemAlertModal` remains a dedicated Radix `alertdialog` for intentional
  workflow interruptions only.
- Podman validation passed after this pass: `npm run lint`,
  `npx tsc --noEmit --incremental false`, `npm run build`, and
  `go test -p=1 ./...`. Browser/device visual QA remains an operator follow-up.

### 2026-08-15 readable typography and motion pass

- Added a shared readable type contract: 16px body baseline, 15px `text-sm`,
  13px `text-xs`, and 12px legacy 10–11px labels on screen. Non-heading heavy
  utility weights resolve to medium so hierarchy is not communicated by
  shouting text. Print output remains outside the screen-only overrides.
- Added `AttentionBox` for info, success, warning, and error emphasis. The API
  status and inventory replenishment rules now use a colored surface and a
  restrained text hierarchy instead of bold-only emphasis.
- Added Anime.js 4.5.0 and the client-only `AnimeReveal` primitive. It animates
  only opacity and transform, skips when `prefers-reduced-motion` is active,
  and is not used for tables, totals, approvals, or audit-sensitive changes.
  SmoothUI remains a selective pattern reference; Radix continues to own modal
  semantics and focus behavior.
- Disposable Podman validation completed after the final edits: `npm run lint`,
  `npx tsc --noEmit --incremental false`, and `npm run build` with Next.js
  Webpack and network disabled after dependency installation. The build
  prerendered `/`, `/_not-found`, `/icon.svg`, and `/manifest.json`.
  Browser/device visual QA and full assistive-technology acceptance remain
  operator follow-ups; this entry is not a claim of full WCAG conformance.

### 2026-08-16 project update standard

- Added `PROJECT_UPDATE_STANDARD.md` as the recurring repository workflow for
  research-before-execution, source-of-truth documentation synchronization,
  Docker Sandbox validation, local commit boundaries, and authenticated
  GitHub HTTPS publication through `gh api`.
- Reconciled active README, contributing, deployment, architecture, security,
  implementation-plan, UI/accessibility, and GitHub transport guidance with the
  current Docker Sandbox execution plane. Historical Podman validation entries
  remain unchanged as historical evidence; remote VPS deployment still uses
  rootless Podman.
- Ran `jk-sbx-project ensure` to initialize the project sandbox. This was a
  documentation-only update; no application build or runtime acceptance claim
  is made from this entry.

### 2026-08-16 local-build release workflow

- Updated `scripts/deploy-demo.sh` to run frontend dependency installation,
  lint, TypeScript validation, static export, and target-platform backend image
  creation inside the Docker Sandbox. It now transfers only the static export,
  backend image archive, and demo Quadlets.
- Updated `scripts/vps-deploy-accustandard.sh` so the VPS activation path
  loads the prebuilt image, publishes `web-dist/`, installs the transferred
  Quadlets, and starts the existing runtime services without source compilation
  or image builds. Rootless Podman remains a VPS runtime dependency until a
  separate PostgreSQL/systemd migration is approved.
- Docker Sandbox validation completed after the release-script migration:
  `npm ci --no-audit --no-fund` (successful retry after one transient
  `ECONNRESET`), `npm run lint`, `npx tsc --noEmit --incremental false`,
  `npm run build`, `cd backend && go test ./...`, and
  `cd backend && go vet ./...`.
- The backend image built and exported successfully with Docker for
  `linux/amd64`; `docker image inspect` confirmed `linux/amd64`, and the
  release archive was written to the temporary staging directory.
- `git diff --check` and `bash -n scripts/deploy-demo.sh
  scripts/vps-deploy-accustandard.sh scripts/vps-migrate-to-go.sh` passed.
- `ACCUSTANDARD_DEPLOY_DRY_RUN=true npm run deploy:demo` completed local
  release staging and cleaned its temporary release directory without contacting
  the VPS.
- Remote VPS deployment was not run in this pass. VPS service readiness,
  PostgreSQL integration after artifact activation, browser/device QA, and the
  full acceptance matrix remain operator follow-ups.
