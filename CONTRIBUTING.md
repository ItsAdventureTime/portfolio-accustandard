# Contributing to Accustandard Medical ERP

Thank you for contributing to the **Accustandard Medical ERP Dashboard**. This guide outlines development standards, local git rules, and remote synchronization guidelines.

---

## 🚀 Version Control Standards

### 1. Local Commits (Standard Git CLI)
- Use standard local `git` CLI commands.
- SSH commit signing is **not required** for local commits.
- Follow the **Conventional Commits** specification:
  - `feat`: New feature or user capability.
  - `fix`: Bug fix or error resolution.
  - `docs`: Documentation updates.
  - `refactor`: Code improvements without functionality changes.
  - `chore`: Maintenance or script updates.

```bash
git add .
git commit -m "docs: update deployment guidelines for demo site"
```

### 2. Remote Commit & Synchronization (GitHub CLI over HTTPS)
- ALWAYS perform remote commits and sync via the official **GitHub CLI (`gh`)** over **HTTPS**.
- Repository Remote: `https://github.com/ItsAdventureTime/bridge-accustandard.git`
- Ensure local `.git` and remote `origin/main` remain 100% synchronized.

```bash
# Push local commits to remote GitHub HTTPS origin
git push origin main

# Verify authentication status
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
