# AccuStandard Website and Web-App Deployment Guide

This is the operator guide for the current repository. The supported automated
release path is the remote demo deployment. It does not build or run the app on
macOS.

## Current deployment targets

| Target | Status | Command/path |
| --- | --- | --- |
| Demo website and Go API | Automated | `npm run deploy:demo` |
| Production website and Go API | Not automated yet | Production Quadlets exist, but no production release script is approved |
| Backblaze object storage | Auxiliary/manual | Native `b2` CLI; see `BACKBLAZE_S3_WORKFLOW.md` |

Backblaze B2 is not the current web host. The demo website is served from the
VPS static export through Caddy; B2 is reserved for object storage such as
future attachments, imports, exports, or documents.

## 1. One-time macOS prerequisites

Install or verify the client-side tools. The deployment script uses SSH and
rsync only to transfer source; all dependency installation, frontend
compilation, backend compilation, and service startup happen on the VPS.

```bash
command -v gh
command -v rsync
command -v ssh
/opt/homebrew/bin/podman version
```

Podman is only needed for optional disposable local validation. It is not used
for the deployment build itself.

Configure GitHub CLI for HTTPS. Never configure an SSH GitHub remote or create
an SSH key for repository synchronization:

```bash
gh auth status --active --hostname github.com
gh config set git_protocol https --host github.com
gh auth setup-git --hostname github.com
git remote set-url origin https://github.com/ItsAdventureTime/bridge-accustandard.git
```

## 2. Preflight from the repository checkout

```bash
cd ~/dev/accustandard-bridge-dashboard
git status --short
git remote get-url origin
gh auth status --active --hostname github.com
bash -n scripts/deploy-demo.sh scripts/vps-deploy-accustandard.sh scripts/vps-migrate-to-go.sh
```

The checkout should be on the intended branch, and the GitHub remote should
begin with `https://`. A clean worktree is recommended so the deployment does
not transfer accidental files.

## 3. Deploy the complete demo website and API

Run the single supported command:

```bash
npm run deploy:demo
```

The script performs this sequence:

1. Connects to the configured demo VPS and creates the remote source/web/data
   directories.
2. Transfers source with `rsync`, excluding Git metadata, dependencies, Next
   build output, and macOS metadata.
3. Runs the frontend build in disposable `node:lts-alpine` Podman on the VPS.
4. Builds the Go API image remotely using floating `golang:alpine` and
   `alpine` images with `--pull=always`.
5. Installs only the demo Quadlets and publishes the static `out/` export to
   the remote `web-dist/` directory.
6. Starts PostgreSQL 17, checks `pg_isready`, verifies the PostgreSQL major
   version, starts the API, and retries the API readiness endpoint for up to
   60 seconds.
7. Removes disposable remote frontend artifacts while retaining the runtime
   API image required by the Quadlet.
8. Verifies the remote `web-dist/index.html` exists.

The PostgreSQL demo reset policy is intentionally disposable: legacy or
incompatible demo data may be removed without a recoverable backup, then
recreated and seeded through GORM AutoMigrate plus the idempotent demo seed.

## 4. Verify the deployed demo

From macOS:

```bash
curl --fail --silent --show-error --location \
  https://delegateops.business/accustandard/demo/ >/dev/null

curl --fail --silent --show-error --location \
  https://delegateops.business/accustandard/demo/api/v1/readiness
```

Expected readiness includes an HTTP success response with the API reporting a
connected database.

## 5. VPS diagnostics if deployment fails

After the script reports a failure, run these commands yourself on the VPS:

```bash
systemctl --user status accustandard-demo-db.service --no-pager -l
systemctl --user status accustandard-demo-app.service --no-pager -l
journalctl --user -u accustandard-demo-db.service -n 100 --no-pager
journalctl --user -u accustandard-demo-app.service -n 100 --no-pager
podman ps -a --filter name=accustandard-demo
```

For an API readiness timeout, inspect the API journal first. A service can be
reported active before its HTTP listener is accepting requests; the deployment
already retries this condition. A database or migration error causes the API
container to exit, and the journal contains the root error.

## 6. Backblaze B2 assets, when a feature needs them

Backblaze uses one existing bucket with environment prefixes:

```text
Bucket: bridge-ph
Demo: accustandard/demo/
Production: accustandard/
```

Use the native Backblaze CLI, not AWS CLI, for routine operator work:

```bash
brew install b2-tools
b2 account authorize
b2 bucket list

# Demo assets
b2 sync ./release-assets/ b2://bridge-ph/accustandard/demo/

# Verify demo assets
b2 ls --recursive b2://bridge-ph/accustandard/demo/
```

Authorize separate prefix-restricted application keys for demo and
production. Do not use `--delete` unless the source is a complete, reviewed
mirror of exactly one environment prefix. See
[`BACKBLAZE_S3_WORKFLOW.md`](BACKBLAZE_S3_WORKFLOW.md) for the full storage
procedure.

## 7. Production status

Do not run the demo script against production. The repository contains
production Quadlet definitions and a production directory layout, but there is
currently no approved `npm run deploy:production` workflow. Production needs a
separate release script with explicit configuration, secrets, database backup/
rollback policy, migrations, health checks, and acceptance verification before
it is treated as deployable.

## References

- [GitHub HTTPS workflow](GITHUB_HTTPS_WORKFLOW.md)
- [Backblaze B2 workflow](BACKBLAZE_S3_WORKFLOW.md)
- [Next.js deployment guidance](https://nextjs.org/docs/app/getting-started/deploying)
- [Podman Quadlet documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
- [Backblaze B2 sync guidance](https://www.backblaze.com/docs/cloud-storage-use-the-b2-sync-command-with-the-cli)
