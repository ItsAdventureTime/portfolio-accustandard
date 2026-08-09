# Contributing to Accustandard Medical ERP

Thank you for helping improve the Accustandard Medical ERP Dashboard! We welcome contributions that improve code quality, enhance internal control workflows, or add new features.

---

## 🛠️ Development Setup

1. **Clone the Repository over HTTPS**:
   ```bash
   gh repo clone ItsAdventureTime/bridge-accustandard
   cd bridge-accustandard
   ```

2. **Install Node.js Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```

4. **Verify Production Build**:
   Before submitting changes, make sure the static export compiles cleanly inside a disposable Podman container:
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

## 🔐 Git & Remote Protocol Guidelines

To enforce security and consistency across developer workstations:

- **Local Commits:** Use standard local `git` commands with SSH commit signing (`git commit -S`).
- **Remote Operations:** Always use the official GitHub CLI (`gh`) over **HTTPS** (`https://github.com/ItsAdventureTime/bridge-accustandard.git`), authenticated via default `gh auth status` credentials.

### Setting Up Local Commit Signing
```bash
git config --global user.signingkey "ssh-ed25519 YOUR_PUBLIC_KEY"
git config --global gpg.format ssh
git config --global commit.gpgsign true
```

---

## 📋 Pull Request Process

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feat/demand-planner-updates
   ```
2. Make your edits and commit locally using standard `git`:
   ```bash
   git add .
   git commit -S -m "feat(inventory): enhance Class 1 reorder logic"
   ```
3. Push your branch using GitHub CLI / HTTPS:
   ```bash
   git push origin feat/demand-planner-updates
   ```
4. Open a Pull Request using GitHub CLI (`gh`):
   ```bash
   gh pr create --title "feat(inventory): enhance Class 1 reorder logic" --body "Detailed summary of changes"
   ```
5. Ensure all build and type checks pass cleanly before requesting review.

Thank you again for building with us!
