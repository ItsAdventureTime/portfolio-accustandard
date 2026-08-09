# Go Migration Technical Specification & Architecture Guide

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

Local single command execution script: **`./scripts/deploy-demo.sh`** (or `npm run deploy:demo`).

```bash
#!/usr/bin/env bash
set -euo pipefail

# 1. Start Podman Machine locally if stopped
if command -v podman &>/dev/null && podman machine list 2>/dev/null | grep -q "stopped"; then
  echo "==> Starting local Podman machine..."
  podman machine start || true
fi

# 2. Local Disposable Podman Static UI Build
podman run --rm \
  -v "$(pwd):/workspace:Z" \
  -v /workspace/.next \
  -v /workspace/node_modules \
  -w /workspace \
  node:24-alpine \
  sh -c "npm ci && npm run build"

# 3. Remote VPS Quadlet Setup & Caddy Repair
ssh -p 22 jk@216.75.75.136 'bash -s' < scripts/vps-deploy-accustandard.sh

# 4. RSync Static Build Files to Demo Web Root
rsync -avz --delete -e "ssh -p 22" \
  out/ \
  jk@216.75.75.136:/home/jk/bridge-ph/accustandard-demo/web-dist/
```

---

## 🔐 Version Control Protocol

- **Local Commits**: Use standard local `git` CLI (`git commit -m "..."`). SSH key signing is not required.
- **Remote Operations**: ALWAYS use official GitHub CLI (`gh`) over **HTTPS** (`https://github.com/ItsAdventureTime/bridge-accustandard.git`), authenticated via default `gh auth` credentials (`ItsAdventureTime`).
