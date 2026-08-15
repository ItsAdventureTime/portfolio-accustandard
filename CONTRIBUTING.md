# Contributing to Accustandard Medical ERP

> Read `IMPLEMENTATION_STATUS.md` first. The acceptance handoff is the
> contract; UI-only state and seeded statuses are not functional evidence.

Thank you for contributing to the **Accustandard Medical ERP Dashboard**. This
guide outlines development standards, documentation synchronization rules, and
remote GitHub (`gh` / HTTPS) synchronization guidelines. Follow
[`PROJECT_UPDATE_STANDARD.md`](PROJECT_UPDATE_STANDARD.md) as the normal
sequence after every project update.

**Source of truth:** `implementation_plan.md` governs UI/UX scope; the
confirmed acceptance handoff governs business rules; `IMPLEMENTATION_STATUS.md`
governs actual runtime status; `README.md`, `ARCHITECTURE.md`, and this guide
govern operations.

---

## 📌 Core Development & Repository Workflow Rules

### Rule 0: Documentation Synchronization Policy
- Update the applicable source-of-truth document when code, UI components,
  dependencies, build scripts, or design specifications change. Do not copy
  contradictory instructions into historical prompts or transcripts.

### Rule 1: GitHub CLI Remote Protocol
- Follow [`GITHUB_HTTPS_WORKFLOW.md`](GITHUB_HTTPS_WORKFLOW.md). Use `gh` to
  authenticate and publish remote Git objects through the GitHub Git Database
  API over HTTPS. Local staging and commits use local Git because `gh` has no
  local commit command. Never use SSH remotes, SSH keys, `gh ssh-key`, passkeys,
  or direct `git push` for GitHub repository operations. The demo deployment
  separately uses user-run SSH/rsync to transfer source to the VPS.
- Follow the **Conventional Commits** specification:
  - `feat`: New feature or user capability.
  - `fix`: Bug fix or error resolution.
  - `style`: UI/UX, typography, layout, or print styling updates.
  - `docs`: Documentation updates.
  - `refactor`: Code improvements without functionality changes.
  - `chore`: Maintenance or script updates.

```bash
gh auth status --active --hostname github.com
gh config set git_protocol https --host github.com
gh auth setup-git --hostname github.com
git remote set-url origin https://github.com/ItsAdventureTime/bridge-accustandard.git
git remote get-url origin
```

---

## Docker Sandbox validation

Validate lint, type-checking, and the static export inside the deterministic
Docker Sandbox. Do not install or compile on the macOS host, and do not use
local Podman for development validation:

```bash
jk-sbx-project ensure
jk-sbx-project exec npm ci
jk-sbx-project exec npm run lint
jk-sbx-project exec npx tsc --noEmit --incremental false
jk-sbx-project exec npm run build
```

For backend validation, run the bounded Go commands in the same sandbox:

```bash
jk-sbx-project exec sh -lc 'cd backend && go test ./...'
jk-sbx-project exec sh -lc 'cd backend && go vet ./...'
```

The deployment builds the frontend and backend image locally through
`npm run deploy:demo` inside the Docker Sandbox, publishes `out/` plus the
image archive and Quadlets to the VPS, and activates the existing
Podman/Quadlet runtime. The VPS receives no source-build workload; its Podman
use is limited to the current PostgreSQL/API runtime services.

The production script intentionally runs `next build --webpack`. Next.js 16
defaults to Turbopack, but the Webpack static-export path is the currently
verified build contract; revisit it after a deliberate sandbox validation.

---

## 🛰️ Live Demo Target Environment

Deployments currently target **strictly the Demo Environment**:
- **Live URL:** [https://delegateops.business/accustandard/demo](https://delegateops.business/accustandard/demo)
- **Demo Web Root:** `/home/jk/bridge-ph/accustandard-demo/`
- **Demo Quadlet Path:** `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`
- **1-Command Deployment:** `npm run deploy:demo` (or `./scripts/deploy-demo.sh`)

## Workflow Guardrails

When changing workflow code, preserve the single-source API state model,
role-specific queues, no-self-approval rules, Sales Quote GM-only approval,
client acceptance evidence gate, and atomic Goods Receipt quantity checks.
Run frontend and bounded backend checks in the Docker Sandbox; do not treat
demo-only UI paths as production.
