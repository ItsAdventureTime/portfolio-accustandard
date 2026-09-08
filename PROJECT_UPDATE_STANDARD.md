# AccuStandard Project Update Standard

**Status:** Active repository standard
**Updated:** 2026-08-16

This is the normal sequence for every code, UI, dependency, build-script,
deployment, or documentation revision in this project.

## 1. Research before execution

- Check current official guidance for each framework, tool, or platform in the
  requested change before editing.
- Prefer primary sources: Next.js, npm, Docker, GitHub CLI, GitHub REST, W3C,
  and the relevant package documentation.
- Record a source in the affected guide when the research changes a runtime,
  security, accessibility, deployment, or dependency contract.

## 2. Inspect and define scope

- Read `AGENTS.md`, `STYLE_GUIDE.md`, `IMPLEMENTATION_STATUS.md`, and the
  source-of-truth guide affected by the task before making changes.
- Preserve existing user work, historical status records, `.agents/`, and
  `skills-lock.json` unless the user explicitly asks to change them.
- Use LeanCTX project context first (`ctx_compose`, then `ctx_read`,
  `ctx_search`, or `ctx_shell`) and inspect the current branch, remote, and
  worktree before synchronization.
- Keep API contracts, role boundaries, COSO controls, seeded data semantics,
  and demo-versus-production boundaries unchanged unless the task explicitly
  changes them.

## 3. Implement and synchronize documentation

- Make the smallest coherent implementation that satisfies the request.
- Update every affected active guide in the same change. At minimum, review
  `README.md`, `CONTRIBUTING.md`, `DEPLOYMENT_GUIDE.md`,
  `GITHUB_HTTPS_WORKFLOW.md`, and `IMPLEMENTATION_STATUS.md` when workflow or
  runtime boundaries change.
- Keep historical prompts, transcripts, and dated validation records intact;
  add a new dated entry instead of rewriting old evidence.
- Use English (US), sentence case, specific verbs, and the repository's calm
  visual/accessibility language. Do not claim acceptance, WCAG conformance,
  deployment, or tests that were not actually run.

## 4. Validate in the project execution plane

The local project execution plane is the deterministic Docker Sandbox. Do not
install dependencies or run Node, npm, Go, or container builds directly on the
macOS host, and do not use local Podman for development validation.

```bash
jk-sbx-project ensure
jk-sbx-project exec npm ci
jk-sbx-project exec npm run lint
jk-sbx-project exec npx tsc --noEmit --incremental false
jk-sbx-project exec npm run build
jk-sbx-project exec sh -lc 'cd backend && go test ./...'
jk-sbx-project exec sh -lc 'cd backend && go vet ./...'
```

Use `jk-sbx-project run '<compound shell command>'` for a bounded compound
check, and `jk-sbx-project exec-bg` only for a service that needs to remain
running. Run `git diff --check` on the host control plane. The active demo
release is a manual image handoff: build and export the frontend and backend in
the Docker Sandbox, load them into OrbStack, and run the image-only Compose
project through the `orbstack` context. Follow
[`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) for that procedure. Historical
VPS/Podman release scripts are retained for traceability and are not active.

Record the exact checks and their result in `IMPLEMENTATION_STATUS.md`. For a
documentation-only update, say so explicitly and do not imply that a runtime
build was rerun.

The demo release additionally runs:

```bash
jk-sbx-project exec docker build --pull --provenance=false \
  --platform linux/amd64 \
  --tag localhost/accustandard-bridge-backend:demo \
  --file backend/Dockerfile backend
jk-sbx-project exec docker save --output \
  .deploy-demo-release/accustandard-bridge-backend-demo.tar \
  localhost/accustandard-bridge-backend:demo
```

## 5. Commit locally, publish remotely through `gh` over HTTPS

GitHub CLI has no local staging or local-commit command. Local Git is therefore
required to create the local commit; the remote GitHub operation must use the
authenticated `gh` CLI and HTTPS only. Never use an SSH remote, SSH key,
`gh ssh-key`, passkey, or direct `git push` for this repository workflow.

Before any remote write, verify the active account and transport:

```bash
gh auth status --active --hostname github.com
gh config set git_protocol https --host github.com
gh auth setup-git --hostname github.com
git remote set-url origin https://github.com/ItsAdventureTime/portfolio-accustandard.git
git remote get-url origin
```

Then review and create the local commit with normal local Git commands:

```bash
git status --short
git diff --check
git add <changed-files>
git commit -m "<conventional commit message>"
```

Publish the resulting tree with the GitHub Git Database REST endpoints through
`gh api`: upload changed blobs, create a tree from the current `main` tree,
create one commit whose parent is the current remote `main` commit, then patch
`refs/heads/main` to the new commit SHA. Keep the remote update on `main` and
verify it with `gh api`; do not replace this sequence with `git push`.

```bash
gh api repos/ItsAdventureTime/portfolio-accustandard/git/ref/heads/main
gh api repos/ItsAdventureTime/portfolio-accustandard/git/blobs --method POST \
  -F encoding=utf-8 -F content=@<changed-file>
gh api repos/ItsAdventureTime/portfolio-accustandard/git/trees --method POST \
  -f base_tree=<remote-tree-sha> <tree-entry-fields>
gh api repos/ItsAdventureTime/portfolio-accustandard/git/commits --method POST \
  -f message="<commit message>" -f tree=<new-tree-sha> \
  -f parents[]=<remote-commit-sha>
gh api repos/ItsAdventureTime/portfolio-accustandard/git/refs/heads/main \
  --method PATCH -f sha=<new-commit-sha> -F force=false
```

The tree-entry fields must preserve unchanged paths from the remote base tree
and set changed paths to the uploaded blob SHAs. The ref update must be
fast-forwardable unless the user explicitly authorizes a force update.

## 6. Verify handoff

```bash
gh auth status --active --hostname github.com
gh repo view ItsAdventureTime/portfolio-accustandard \
  --json nameWithOwner,url,defaultBranchRef
gh api repos/ItsAdventureTime/portfolio-accustandard/git/ref/heads/main \
  --jq '.object.sha'
git status --short
git branch --all --no-color
git remote get-url origin
```

Confirm that the remote URL is HTTPS, only intended branches remain, the
remote `main` ref points to the published commit, and unrelated user files are
still preserved locally.

## Official references

- [GitHub CLI authentication](https://cli.github.com/manual/gh_auth_login)
- [GitHub CLI Git credential setup](https://cli.github.com/manual/gh_auth_setup-git)
- [GitHub Git database REST API](https://docs.github.com/en/rest/git)
- [Docker Sandboxes](https://docs.docker.com/ai/sandboxes/)
- [Docker Sandbox usage](https://docs.docker.com/ai/sandboxes/usage/)
- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Go command documentation](https://go.dev/cmd/go/)
- [npm install-script policy](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts/)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
