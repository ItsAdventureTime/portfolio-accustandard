# Contributing to Accustandard Medical ERP

Thank you for contributing to the **Accustandard Medical ERP Dashboard**. This guide outlines development standards, documentation synchronization rules, local `git` commit rules, and remote GitHub (`gh` / HTTPS) synchronization guidelines.

---

## 📌 Core Development & Repository Workflow Rules

### Rule 0: Documentation Synchronization Policy
- Every time code, UI components, dependencies, build scripts, or design specifications are modified, all project documentation (`README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `accustandard-developer-handoff.md`, `AGENT_PROMPT.md`, `GO_MIGRATION_PLAN.md`) **MUST** be updated immediately.

### Rule 1: Local Commit Protocol (Standard Git CLI Only)
- Perform local commits using standard `git` CLI (`git add .`, `git commit --no-gpg-sign -m "..."`).
- SSH keys, GPG signing, passkeys, and interactive prompts are strictly avoided.
- Follow the **Conventional Commits** specification:
  - `feat`: New feature or user capability.
  - `fix`: Bug fix or error resolution.
  - `style`: UI/UX, typography, layout, or print styling updates.
  - `docs`: Documentation updates.
  - `refactor`: Code improvements without functionality changes.
  - `chore`: Maintenance or script updates.

```bash
git add .
git commit --no-gpg-sign -m "style(ui): update design system alignment for COSO approval table"
```

### Rule 2: Remote Commit & Synchronization (GitHub HTTPS / `gh` CLI)
- Remote synchronization to GitHub (`https://github.com/ItsAdventureTime/bridge-accustandard.git`) must always be executed over authenticated **HTTPS** (`git push origin main` or `gh` CLI).
- SSH keys, SSH passphrase prompts, and passkeys are strictly avoided.
- Ensure local working directory and remote GitHub `main` branch remain 100% synchronized after every feature or bug fix.

```bash
# Push local commits to remote main over authenticated HTTPS
git push origin main

# Or check GitHub CLI authentication status
gh auth status
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
  node:24-alpine \
  sh -c "npm ci && npm run build"
```

---

## 🛰️ Live Demo Target Environment

Deployments currently target **strictly the Demo Environment**:
- **Live URL:** [https://delegateops.business/accustandard/demo](https://delegateops.business/accustandard/demo)
- **Demo Web Root:** `/home/jk/bridge-ph/accustandard-demo/`
- **Demo Quadlet Path:** `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`
- **1-Command Deployment:** `npm run deploy:demo` (or `./scripts/deploy-demo.sh`)
