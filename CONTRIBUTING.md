# Contributing to Accustandard Medical ERP

Thank you for helping improve the Accustandard Medical ERP Dashboard! We welcome contributions that improve code quality, enhance internal control workflows, or add new features.

---

## 🛠️ Development Setup

1. **Fork or Clone the Repository**:
   ```bash
   git clone git@github.com:ItsAdventureTime/bridge-accustandard.git
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
   Before submitting changes, make sure the static export compiles cleanly:
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

## 📐 Code Style & Conventions

- **Component Architecture:** Place feature modules under `src/components/features/` and modals under `src/components/modals/`.
- **State Management:** Keep shared demo state in `src/lib/useDemoStore.ts` to ensure all user roles see synchronized updates.
- **Styling:** Use standard Tailwind CSS utility classes matching the Light Corporate Medical palette (`#F8FAFC` slate canvas, `#1E3A8A` Deep Royal Navy, `#DC2626` Bright Medical Red). Avoid inline style overrides whenever possible.
- **TypeScript:** Enforce explicit type definitions for data structures and component props.

---

## 🔐 Commit Signing Guidelines

All commits submitted to this repository MUST be signed using SSH or GPG keys.

### Setting Up SSH Commit Signing
```bash
git config --global user.signingkey "ssh-ed25519 YOUR_PUBLIC_KEY"
git config --global gpg.format ssh
git config --global commit.gpgsign true
```

When committing your work, verify that your signature passes:
```bash
git commit -S -m "feat(module): describe your clear, punchy change"
```

---

## 📋 Pull Request Process

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feat/demand-planner-updates
   ```
2. Make your edits and commit with signed signatures.
3. Push your branch to GitHub:
   ```bash
   git push origin feat/demand-planner-updates
   ```
4. Open a Pull Request against `main` using GitHub CLI:
   ```bash
   gh pr create --title "feat(inventory): enhance Class 1 reorder logic" --body "Detailed summary of changes"
   ```
5. Ensure all build and type checks pass cleanly before requesting review.

Thank you again for building with us!
