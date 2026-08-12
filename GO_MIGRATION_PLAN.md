# Go Migration Technical Specification & Architecture Guide

> **2026-08-12 runtime reconciliation:** This is a target architecture, not a
> completion claim. The deployed demo currently uses `backend/cmd/server`,
> GORM `AutoMigrate`, and `backend/migrations/002_seed_data.sql`; see
> `IMPLEMENTATION_STATUS.md` for verified coverage and remaining gaps.

This document provides the technical blueprint for migrating the **Accustandard Medical ERP Dashboard** from a client-side store into a **Go REST API Backend + Next.js Static Frontend** stack.

UI/UX scope is governed by `implementation_plan.md`; business rules by the
confirmed acceptance handoff; runtime status by `IMPLEMENTATION_STATUS.md`;
operations by `README.md`, `ARCHITECTURE.md`, and `CONTRIBUTING.md`.

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
 [ PostgreSQL 17 DB ]
                                         (accustandard_demo_db)
```

---

## 🛠️ Technology Stack Specification

1. **Frontend**: Next.js App Router (React), Tailwind CSS, Lucide Icons, Radix UI.
   - Build Mode: Static Export (`output: 'export'` in `next.config.ts`).
   - Base Path: `/accustandard/demo`.
2. **Backend**: Go from the moving official
   `docker.io/library/golang:alpine` build image (`go-chi/chi/v5` router,
   PostgreSQL driver `pgx/v5` or `gorm`). Do not replace the floating build
   image with a version-pinned Go image.
   - REST API Base Path: `/accustandard/demo/api/v1`.
3. **Database**: PostgreSQL 17 (`accustandard_demo_db`).
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
#    publish out/, start/wait for PostgreSQL, restart the demo API Quadlet,
#    and retry its HTTP readiness endpoint during listener startup.
ssh -p 22 jk@216.75.75.136 'bash -s' < scripts/vps-deploy-accustandard.sh
```

---

## 🔐 Version Control Protocol

- **GitHub repository operations**: Follow `GITHUB_HTTPS_WORKFLOW.md`. Use
  official GitHub CLI (`gh`) to authenticate/configure Git, then synchronize
  only through the authenticated HTTPS remote
  (`https://github.com/ItsAdventureTime/bridge-accustandard.git`). Never use
  SSH remotes, SSH keys, `gh ssh-key`, or passkeys. Demo VPS transfer remains a
  separate user-run SSH/rsync operation.

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
`/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`, starts the
database if needed, waits for `pg_isready`, restarts
`accustandard-demo-app.service`, and waits up to 60 seconds for the API
readiness endpoint with curl retries. Backend image builds use
`--pull=always` so the repository's floating `golang:alpine` and `alpine`
base images are refreshed on each remote run.

The database data directory persists across normal frontend and API updates.
For this disposable demo only, a data directory whose `PG_VERSION` is not 17,
or a non-empty directory with no `PG_VERSION`, is removed and reinitialized as
PostgreSQL 17; no recoverable backup is kept. The PostgreSQL Quadlet healthcheck
must report healthy before the API service starts. API startup then removes the
obsolete prototype table family, runs GORM `AutoMigrate`, and applies the
idempotent demo seed. The reset helper uses `podman unshare` to inspect and
remove rootless-container-owned files instead of recursively rewriting volume
ownership with `:U`. `Notify=healthy` gates the database/container service but
does not guarantee that the Go HTTP listener is accepting requests, so the
deployment retries transient curl startup failures, including connection
resets. On timeout it prints the API unit status and the last 100 journal lines
before exiting nonzero. The reset-state parser uses line-free tokens
(`version:17`, `version:16`, `invalid`, or `empty`) so command substitution
cannot append a literal `n` to the marker; the PostgreSQL 17 reset policy
remains unchanged.

## 2026 Repository Audit Status

The Go migration is partially implemented. The demo runtime uses the GORM
models and handlers under `backend/cmd/server`; obsolete prototype runtime
files have been removed. The frontend still has
local-only callbacks for several handoff workflows, so it is not yet a fully
authoritative server-backed ERP.

The migration directory contains the GORM-shaped idempotent demo seed
`002_seed_data.sql`; it is not a production migration chain. Do not run it
against production as an acceptance step. Canonical migration design,
idempotency keys, authenticated RBAC, complete document endpoints, and
integration tests remain release-blocking work.
