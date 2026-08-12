# Contributing to Accustandard Medical ERP

> Read `IMPLEMENTATION_STATUS.md` first. The acceptance handoff is the
> contract; UI-only state and seeded statuses are not functional evidence.

Thank you for contributing to the **Accustandard Medical ERP Dashboard**. This
guide outlines development standards, documentation synchronization rules, and
remote GitHub (`gh` / HTTPS) synchronization guidelines.

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
  authenticate and configure Git's credential helper, then synchronize only
  through the HTTPS remote. Never use SSH remotes, SSH keys, `gh ssh-key`, or
  passkeys for GitHub repository operations. The demo deployment separately
  uses user-run SSH/rsync to transfer source to the VPS.
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
git push --set-upstream origin <branch-name>
```

---

## 🐳 Disposable Podman Build Checks

Validate lint and the static export, when needed, only inside an isolated,
disposable Podman container. Do not install or compile on the macOS host. The
anonymous `/workspace` volume keeps dependencies and generated output out of
the repository:

```bash
/opt/homebrew/bin/podman run --rm --userns=keep-id \
  -v "$(pwd):/src:ro,Z" \
  -v /workspace \
  -w /workspace \
docker.io/library/node:lts-alpine \
  sh -lc 'cp -a /src/. /workspace/ && npm ci && npm run lint && npm run build'
```

For backend validation, use the same moving official Go Alpine tag used by
the remote Dockerfile. Do not replace it with a versioned Go tag:

```bash
/opt/homebrew/bin/podman run --rm --userns=keep-id \
  -v "$(pwd)/backend:/src:ro,Z" \
  -v /workspace \
  -w /workspace \
  docker.io/library/golang:alpine \
  sh -c 'cp -a /src/. /workspace/ && go version && go test ./... && go vet ./...'
```

The VPS deployment repeats the build remotely through `npm run deploy:demo`,
publishes `out/`, and removes remote source build artifacts afterward.
On Linux, `podman` may be used instead of the macOS path above.

The production script intentionally runs `next build --webpack`. Next.js 16
defaults to Turbopack, but the demo builder has constrained memory; use the
official Webpack opt-out until a remote Turbopack build is verified on a
sized VPS.

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
Run frontend checks in disposable Podman and backend checks only when the
bounded task requires them; do not treat demo-only UI paths as production.
