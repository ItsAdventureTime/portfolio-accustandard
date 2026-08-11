# AccuStandard implementation status

**Audit date:** 2026-08-12  
**Status:** Demo runtime; not a production acceptance release

This file is the short operational companion to the confirmed developer
handoff and acceptance-test handoff. It records what the repository actually
implements so that a visual demo is not mistaken for a completed ERP.

## Source-of-truth order

1. `AccuStandard_Developer_Correction_and_Acceptance_Test_Handoff.md`
2. `AccuStandard_Developer_Handoff_UPDATED.md`
3. `accustandard-webapp-spec.md` and `accustandard-erp-lite-blueprint.md`
4. Older handoffs, transcripts, prompts, and design-reference material

Where an older document conflicts with the first two, the first two control.

## Runtime boundary

- Frontend: Next.js 16 App Router static export from `src/`, served below
  `/accustandard/demo`.
- Backend: `backend/cmd/server` Go API below
  `/accustandard/demo/api/v1`.
- Database: PostgreSQL through GORM `AutoMigrate` plus the idempotent demo
  seed `backend/migrations/002_seed_data.sql`.
- `backend/main.go`, `src/db/schema.ts`, `001_initial_schema.sql`, and
  `002_seed_demo_data.sql` are legacy artifacts, not the deployed demo
  contract.
- The browser seed is an offline rendering fallback. The reset timer uses
  `localStorage`; business transactions must not use it as persistence.
- The UI uses the Go `/readiness` endpoint to classify the API as connected;
  partial list hydration does not make a degraded API authoritative.

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

## Validation record

- `npm run lint` — passed on 2026-08-12.
- `npm run build` — passed on 2026-08-12 with Next.js 16 static export.
- `/usr/local/go/bin/go test ./...` — passed on 2026-08-12.
- `/usr/local/go/bin/go test -race ./internal/handlers` — passed on 2026-08-12.
- `/usr/local/go/bin/go vet ./...` — passed on 2026-08-12.
- PostgreSQL integration, remote VPS deployment, authentication, and full
  acceptance matrix — unverified.

## Current-framework notes

The repository targets Next.js 16/React 19/Tailwind 4. Next.js 16 requires
Node.js 20.9 or newer and no longer runs lint as part of `next build`; the
repository therefore keeps separate `npm run lint` and `npm run build`
commands. Static export support is intentionally limited to client-side
runtime calls for the external Go API.

The security review uses OWASP Top 10:2025 and ASVS 5.0 as current references.
This is guidance for the next hardening phase, not a claim of compliance.
