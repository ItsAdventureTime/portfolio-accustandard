# Contributing to Accustandard Medical ERP

> Read `STYLE_GUIDE.md` and `IMPLEMENTATION_STATUS.md` first. The acceptance handoff is the
> contract; UI-only state and seeded statuses are not functional evidence.

Thank you for contributing to the **Accustandard Medical ERP Dashboard**. This guide outlines development standards, documentation synchronization rules, and remote GitHub (`gh` / HTTPS) synchronization guidelines.

---

## 📌 Core Development & Repository Workflow Rules

### Rule 0: Documentation Synchronization Policy
- Every time code, UI components, dependencies, build scripts, or design specifications are modified, update `IMPLEMENTATION_STATUS.md` and each affected active source-of-truth document: `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `AccuStandard_Developer_Correction_and_Acceptance_Test_Handoff.md`, `AccuStandard_Developer_Handoff_UPDATED.md`, `accustandard-webapp-spec.md`, and `GO_MIGRATION_PLAN.md`. Historical material in `to-review-and-delete/` is not active guidance.

### Rule 1: GitHub CLI Remote Protocol
- Remote synchronization uses only official `gh` commands over authenticated
  HTTPS. Do not use `git push`, SSH remotes, passkeys, or SSH keys.
- Follow the **Conventional Commits** specification:
  - `feat`: New feature or user capability.
  - `fix`: Bug fix or error resolution.
  - `style`: UI/UX, typography, layout, or print styling updates.
  - `docs`: Documentation updates.
  - `refactor`: Code improvements without functionality changes.
  - `chore`: Maintenance or script updates.

```bash
gh auth status
gh repo sync ItsAdventureTime/bridge-accustandard
```

---

## 🐳 Disposable Podman Build Checks

Always validate production static export builds inside an isolated, disposable Podman container before pushing changes:

```bash
podman run --rm \
  -v "$(pwd):/workspace:Z" \
  -v /workspace/.next \
  -v /workspace/node_modules \
  -w /workspace \
  node:lts-alpine \
  sh -c "npm ci && npm run build"
```

---

## 🛰️ Live Demo Target Environment

Deployments currently target **strictly the Demo Environment**:
- **Live URL:** [https://delegateops.business/accustandard/demo](https://delegateops.business/accustandard/demo)
- **Demo Web Root:** `/home/jk/bridge-ph/accustandard-demo/`
- **Demo Quadlet Path:** `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`
- **1-Command Deployment:** `npm run deploy:demo` (or `./scripts/deploy-demo.sh`)

## Workflow Guardrails

When changing workflow code, preserve the single-source API state model, role-specific queues, no-self-approval rules, Sales Quote GM-only approval, client acceptance evidence gate, and atomic Goods Receipt quantity checks. Validate with `npm run lint`, `npm run build`, and `go build ./...` from their respective project roots.
