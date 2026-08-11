# Go Migration Technical Specification & Architecture Guide

> **2026-08-12 runtime reconciliation:** This is a target architecture, not a
> completion claim. The deployed demo currently uses `backend/cmd/server`,
> GORM `AutoMigrate`, and `backend/migrations/002_seed_data.sql`; see
> `IMPLEMENTATION_STATUS.md` for verified coverage and remaining gaps.

This document provides the technical blueprint for migrating the **Accustandard Medical ERP Dashboard** from a client-side store into a **Go REST API Backend + Next.js Static Frontend** stack.

---

## 🏛️ System Architecture

```
[ Client Web Browser ]
       |
       +---> HTTPS: https://delegateops.business/accustandard/demo
                               |
                               v
               [ Rootless Caddy Proxy (caddy.service) ]
                               |
            +------------------+------------------+
            |                                     |
            v /accustandard/demo/*                v /accustandard/demo/api/*
[ Static UI Files (/web-dist) ]          [ Go Backend Service (Port 8080) ]
(Next.js React SPA)                      (go-chi/v5 + REST Controllers)
                                                  |
                                                  v
                                         [ PostgreSQL 16 DB ]
                                         (accustandard_demo_db)
```

---

## 🛠️ Technology Stack Specification

1. **Frontend**: Next.js App Router (React), Tailwind CSS, Lucide Icons, Radix UI.
   - Build Mode: Static Export (`output: 'export'` in `next.config.ts`).
   - Base Path: `/accustandard/demo`.
2. **Backend**: Go 1.22+ (`go-chi/chi/v5` router, PostgreSQL driver `pgx/v5` or `gorm`).
   - REST API Base Path: `/accustandard/demo/api/v1`.
3. **Database**: PostgreSQL 16 (`accustandard_demo_db`).
4. **Containerization**: Podman Quadlet (`~/.config/containers/systemd/bridge-ph/accustandard-demo/`).

---

## 📂 Target Directory & Infrastructure Paths

- **VPS Host**: `jk@216.75.75.136`
- **Live Demo Site URL**: `https://delegateops.business/accustandard/demo`
- **Demo Web Root & Data Path**: `/home/jk/bridge-ph/accustandard-demo/`
  - `/home/jk/bridge-ph/accustandard-demo/web-dist/` (Static UI files)
  - `/home/jk/bridge-ph/accustandard-demo/postgres-data/` (PostgreSQL data volume)
  - `/home/jk/bridge-ph/accustandard-demo/config/` (App environment configuration)
- **Demo Quadlet Systemd Path**: `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`

---

## ⚡ 1-Command Deployment Workflow

Remote-only single command deployment: **`./scripts/deploy-demo.sh`** (or
`npm run deploy:demo`). The local machine performs only SSH/rsync operations.

```bash
#!/usr/bin/env bash
set -euo pipefail

# 1. Sync source to the VPS; no local build occurs.
rsync -az --delete --exclude node_modules --exclude .next --exclude out/ \
  ./ jk@216.75.75.136:/home/jk/bridge-ph/accustandard-demo/source/

# 2. Build remotely in podman run --rm, build the persistent Go image,
#    publish out/, and restart only the demo API Quadlet.
ssh -p 22 jk@216.75.75.136 'bash -s' < scripts/vps-deploy-accustandard.sh
```

---

## 🔐 Version Control Protocol

- **Remote Operations**: Use only official GitHub CLI (`gh`) over authenticated
  HTTPS (`https://github.com/ItsAdventureTime/bridge-accustandard.git`). Do not
  use `git push`, SSH remotes, SSH keys, or passkeys.

## 2026 Backend Enforcement Baseline

- `ReceiveInventory` runs inside a row-locked transaction and hard-blocks non-positive or over-quantity receipts.
- A complete receipt transitions to `AWAITING_VENDOR_INVOICE`, not `VERIFIED_3WAY`; payable recognition still requires PO + RR + vendor invoice.
- `ApproveDocument` enforces stage ordering, role eligibility, no self-approval, and rejects DCS approval for Sales Quotes.
- `CreatePurchaseOrder` decodes one payload, enforces Class 3 linked-customer-PO control, and rejects duplicate open-SKU coverage.
- `CreatePurchaseOrder` permits only the uncovered shortage quantity when a
  non-empty exception reason is supplied.
- RFP release is approval-gated, row-locked, repeat-safe, and audit-recorded;
  server authentication and configurable PO DCS rules remain open work.

## Remote-only demo deployment procedure

The preferred demo deployment performs no local build or execution. The
deployment client only uses SSH/rsync to synchronize source into
`/home/jk/bridge-ph/accustandard-demo/source/`. The VPS then runs the
disposable frontend build, builds the persistent Go image, publishes `out/`
to `web-dist/`, installs the demo Quadlets into
`/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`, and
restarts only `accustandard-demo-app.service`.

The database service is not restarted during a frontend/API update, and broad
legacy-container cleanup is intentionally excluded from the deployment path.

## 2026 Repository Audit Status

The Go migration is partially implemented. The demo runtime uses the GORM
models and handlers under `backend/cmd/server`; the root `backend/main.go`
server is legacy and must not be used for deployment. The frontend still has
local-only callbacks for several handoff workflows, so it is not yet a fully
authoritative server-backed ERP.

The migration directory currently contains two incompatible seed/schema
families (`001_initial_schema.sql`/`002_seed_demo_data.sql` and the GORM-shaped
`002_seed_data.sql`). Until a single versioned migration chain is selected,
these files are not evidence of a clean PostgreSQL cutover. Do not run them
against production as an acceptance step. Canonical migration design,
idempotency keys, authenticated RBAC, complete document endpoints, and
integration tests remain release-blocking work.
