# AccuStandard Website and Web-App Deployment Guide

This is the operator guide for the current repository. The supported automated
release path builds the release locally in the Docker Sandbox, then performs a
plain artifact deployment to the demo VPS. The VPS does not compile or build
source.

## Current deployment targets

| Target | Status | Command/path |
| --- | --- | --- |
| Demo website and Go API | Automated | `npm run deploy:demo` |
| Production website and Go API | Not automated yet | Production Quadlets exist, but no production release script is approved |
| Backblaze object storage | Auxiliary/manual | Native `b2` CLI; see `BACKBLAZE_S3_WORKFLOW.md` |

Backblaze B2 is not the current web host. The demo website is served from the
VPS static export through Caddy; B2 is reserved for object storage such as
future attachments, imports, exports, or documents.

## Frontend font and network contract

Outfit is vendored as `src/app/fonts/Outfit-Variable.woff2` with its SIL Open
Font License 1.1 and provenance record. `src/app/layout.tsx` loads it through
`next/font/local`, so the frontend build no longer needs Google Fonts CSS or
font data and the browser does not depend on a runtime Google stylesheet.

The local Docker Sandbox needs network access for `npm ci` and Docker image
pulls. The release build must succeed without a `next/font/google` import or
Google Fonts request. The static export is generated in `out/` according to
Next.js's current static-export contract; the backend image is built for the
VPS target platform and exported as a release archive.

Historical Podman validation remains recorded in `IMPLEMENTATION_STATUS.md`.
Current local validation and release builds use the Docker Sandbox. The VPS
still uses rootless Podman Quadlets only to run the existing PostgreSQL/API
runtime; it does not build or compile the release.

## 1. One-time macOS prerequisites

Install or verify the client-side tools. The deployment script uses the Docker
Sandbox for dependency installation, validation, and release builds, then uses
SSH and rsync only to transfer release artifacts and activate the configured
demo VPS runtime. This transport is separate from GitHub synchronization: Git
commits and GitHub updates for this repository must use authenticated `gh`
HTTPS commands only. Do not configure GitHub SSH remotes, SSH keys, or passkeys.

```bash
command -v gh
command -v rsync
command -v ssh # VPS deployment transport only; never use for GitHub
command -v jk-sbx-project
jk-sbx-project ensure
```

The Docker Sandbox is the local execution plane for validation and release
builds. The VPS receives artifacts and uses its existing rootless Podman
Quadlets only for runtime activation.

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

1. Ensures the project Docker Sandbox is ready.
2. Installs frontend dependencies and runs lint, TypeScript validation, and the
   Next.js static export locally inside the sandbox.
3. Builds the Go API image locally inside the sandbox's private Docker engine
   for `linux/amd64`, then exports it as
   `.deploy-demo-release/accustandard-bridge-backend-demo.tar`.
4. Stages the static `out/` export, image archive, and demo Quadlets in the
   temporary `.deploy-demo-release/` directory.
5. Transfers only that release bundle to the VPS with `rsync`; repository
   source, `node_modules/`, and `.next/` are not transferred.
6. Loads the prebuilt image, installs the transferred Quadlets, and publishes
   the static export to the remote `web-dist/` directory.
7. Starts PostgreSQL 17, checks `pg_isready`, verifies the PostgreSQL major
   version, starts the API, and quietly retries the API readiness endpoint for
   up to 60 seconds. Expected transient curl retry errors are suppressed; if
   readiness is still unavailable, the script exits nonzero and prints the API
   unit status plus the recent journal.
8. Removes the temporary local and successfully transferred release bundles
   while retaining the loaded runtime image and published static files.

The release script targets `linux/amd64` by default because that is the
current VPS image contract. Set `ACCUSTANDARD_TARGET_PLATFORM` only after
verifying a different VPS architecture and its Docker/Podman image support.

To validate the complete local build and staging path without contacting the
VPS, run:

```bash
ACCUSTANDARD_DEPLOY_DRY_RUN=true npm run deploy:demo
```

The PostgreSQL demo reset policy is intentionally disposable: legacy or
incompatible demo data may be removed without a recoverable backup, then
recreated and seeded through legacy cleanup, compatibility reconciliation,
GORM AutoMigrate, and the idempotent demo seed. The reconciliation preserves
legacy `d_csstatus`/`s_idate` values as canonical `dcs_status`/`si_date`
values before removing the old aliases.

The frontend install uses npm 11's project-level `allowScripts` policy. Only
the reviewed `unrs-resolver` install script is approved in `package.json`; do
not bypass the policy with `dangerously-allow-all-scripts`.

The backend image does not embed `DATABASE_URL`; the demo Quadlet injects its
demo-only connection string at runtime. Production still requires an external
secret source, rotation, backups, authentication, and a separate approved
release workflow.

The automated readiness probe uses curl's `--fail --silent` retry pattern. The
deployment log stays readable while the API listener is binding, but a failed
60-second probe is not hidden: the script emits its own timeout message and
collects the API service diagnostics before returning a failure.

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

If the journal reports SQLSTATE `42703` for `dcs_status`, confirm the deployed
image contains `004_reconcile_runtime_columns.sql` and that startup order is
cleanup → reconciliation → AutoMigrate → seed. The repair handles databases
created by the pre-fix model by copying `d_csstatus` to `dcs_status` and
`s_idate` to `si_date`; do not manually edit the database on the VPS.

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

- [Project update standard](PROJECT_UPDATE_STANDARD.md)
- [GitHub HTTPS workflow](GITHUB_HTTPS_WORKFLOW.md)
- [Backblaze B2 workflow](BACKBLAZE_S3_WORKFLOW.md)
- [Docker Sandboxes](https://docs.docker.com/ai/sandboxes/)
- [Docker Sandbox usage](https://docs.docker.com/ai/sandboxes/usage/)
- [Next.js deployment guidance](https://nextjs.org/docs/app/getting-started/deploying)
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [npm install-script approval guidance](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts/)
- [Podman Quadlet documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
- [PostgreSQL `ALTER TABLE` documentation](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Backblaze B2 sync guidance](https://www.backblaze.com/docs/cloud-storage-use-the-b2-sync-command-with-the-cli)

## UI action and mobile operations contract

The frontend build includes the shared action hierarchy and role-filtered
operations disclosures. Desktop keeps the labeled `More tools` menu button;
mobile keeps search direct and exposes export, startup import, QBO queue,
barcode manager, scanner, and PWA installation through one `Operations & tools`
disclosure. These are client-side role checks in the demo and do not replace
backend authorization. Validate this UI contract with the standard Docker
Sandbox lint, TypeScript, and build commands before release; see
`PROJECT_UPDATE_STANDARD.md`. The remote release continues to use Podman on
the VPS.

## Demo authorization boundary and preview semantics

The demo Quadlet sets `APP_ENV=demo`. Protected API routes require the frontend
to send a valid `X-Demo-Role` value, and approval handlers resolve that
simulated actor from request context instead of accepting a JSON role field.
This prevents an approval payload from changing its own actor, but it is not
production authentication: a caller who can reach the demo can still forge the
demo header. Non-demo API deployments fail closed until a trusted session/JWT
or OIDC identity provider is configured.

Use the UI's `Preview` wording for local-only financial evidence, imports,
acceptance records, and other flows that do not commit through the Go API.
Do not treat a preview as a posted invoice, verified 3-way match, released RFP,
or persisted approval. Verify `APP_ENV`, `/readiness`, and the API service
journal when diagnosing a deployment.

### AccuStandard rootless Caddy boundary

Demo releases, Quadlets, PostgreSQL data, and `web-dist` stage under `/home/jk/bridge-ph/accustandard-demo`; Caddy serves that content through a read-only bind mount at `/srv/bridge-ph-accustandard-demo` inside the Caddy container. The deployment workflow never uses sudo, writes `/srv`, or overwrites `/home/jk/caddy/conf/Caddyfile`.

One-time user-owned change: discover the actual Caddy container and unit, add `deploy/caddy/Caddyfile.snippet` inside `delegateops.business` before the existing static handler, and add the read-only bind mount from `/home/jk/bridge-ph/accustandard-demo/web-dist` to `/srv/bridge-ph-accustandard-demo`.

```sh
podman ps --format '{{.Names}}'
systemctl --user list-units '*caddy*'
podman exec <discovered-caddy> caddy validate --config /etc/caddy/Caddyfile
podman exec <discovered-caddy> caddy reload --config /etc/caddy/Caddyfile
```

Do not guess the container or unit name; use discovery output.