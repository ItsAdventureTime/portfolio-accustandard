# Contributing to Accustandard Medical ERP

Thank you for contributing to the **Accustandard Medical ERP Dashboard**. This guide outlines development standards, local `git` commit rules, and remote GitHub CLI (`gh`) synchronization guidelines.

---

## 🚀 Strict Version Control & Tooling Standard

### 1. Local Commits (Standard Git CLI Only)
- Use **only** local `git` CLI commands (`git add .`, `git commit -m "..."`).
- SSH commit signing is **not required** for local commits.
- Follow the **Conventional Commits** specification:
  - `feat`: New feature or user capability.
  - `fix`: Bug fix or error resolution.
  - `docs`: Documentation updates.
  - `refactor`: Code improvements without functionality changes.
  - `chore`: Maintenance or script updates.

```bash
git add .
git commit -m "docs: update contribution guidelines for local git and gh remote sync"
```

### 2. Remote Commit & Synchronization (GitHub CLI `gh` Only)
- ALWAYS perform remote commits, PRs, and synchronization using official **GitHub CLI (`gh`)** over **HTTPS**.
- **NEVER** use `git` commands for remote operations (e.g. do not use `git push`).
- Repository Remote: `https://github.com/ItsAdventureTime/bridge-accustandard.git`
- Ensure local `.git` and remote GitHub repository remain 100% synchronized.

```bash
# Synchronize remote repository via GitHub CLI
gh repo sync

# Verify GitHub CLI authentication status
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
  node:current-alpine \
  sh -c "npm ci && npm run build"
```

---

## 🛰️ Live Demo Target Environment

Deployments currently target **strictly the Demo Environment**:
- **Live URL:** [https://delegateops.business/accustandard/demo](https://delegateops.business/accustandard/demo)
- **Demo Web Root:** `/home/jk/bridge-ph/accustandard-demo/`
- **Demo Quadlet Path:** `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`
- **1-Command Deployment:** `npm run deploy:demo` (or `./scripts/deploy-demo.sh`)
