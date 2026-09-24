# Active handoff: portfolio demo deployment

ACTIVE_ROLE: implementation agent (GPT 6 Luna, High)
NEXT_OWNER: planner/reviewer (GPT 6 Sol, High; manually triggered by user)
IMPLEMENTATION_OWNER: implementation agent (GPT 6 Luna, High)
REVIEW_OWNER: planner/reviewer (GPT 6 Sol, High)
STATUS: implementation complete; independent runtime and public acceptance pending
CAPABILITY: implementation agent may edit code and active docs and run focused Docker Sandbox checks; planner/reviewer owns independent acceptance
PUSH: commit locally and synchronize intended files to `main` through authenticated `gh` over HTTPS under `GITHUB_HTTPS_WORKFLOW.md`
DEPLOYMENT: do not deploy or change the user's live Tunnel/OrbStack stack during implementation; prepare the manual operator guide and return for review

## Outcome and decision

Make the existing image-only Docker Compose demo safe to run on the user's Mac
mini M1 with OrbStack and the already-running `cloudflared` container. Keep the
public hostname `https://accustandard.delegateops.business`. Use the existing
Next.js static export, Nginx same-origin API proxy, Go API, and PostgreSQL 17.
The Cloudflare service assessment is in
[`CLOUDFLARE_FEASIBILITY.md`](CLOUDFLARE_FEASIBILITY.md). No R2, D1,
Hyperdrive, KV, Cloudflare Containers, or new Worker is required for this demo.
Do not migrate the app to a different platform in this implementation pass.

Cloudflare Workers Builds can compile in Cloudflare after a Worker is connected
to GitHub and build/deploy commands are configured. This repository is not a
Worker project today. The selected Compose path still requires manual image
build/export in `jk-sbx-project implement`, followed by manual image load and
startup in OrbStack. Never claim Git pushes deploy this Compose stack.

## Baseline evidence before implementation

- `deploy/demo/compose.yaml` already isolates API/database on
  `accustandard-network`, gives only frontend a `cloudflared-network` alias,
  and injects the PostgreSQL password from `./secrets/postgres_password.txt`.
  Safe non-secret environment values stay in Compose; no `.env` is needed.
- `next.config.ts` has `output: 'export'`; `src/lib/api.ts` uses `/api/v1`;
  `docker/demo-nginx.conf` proxies that path to the Go API.
- `backend/internal/db/db.go` uses the PostgreSQL GORM driver and runs startup
  SQL. The current migration contract is validated against PostgreSQL 17.
- `backend/cmd/server/main.go` requires `DATABASE_URL` and fails before
  database initialization when it is absent. Compose still constructs the DSN
  from the mounted password file. The focused Go test and sandbox check passed
  as recorded in the implementation progress below. The unrelated
  `backend/main.go` is a historical stub; the active image builds `./cmd/server`.
- Active `deploy/demo/compose.yaml` now pins
  `docker.io/library/postgres:17.11-alpine3.24` and mounts `postgres_data` at
  `/var/lib/postgresql/data`. The contract now asserts the exact image and
  destination. The root `compose.yml` is a historical, separate build-based
  stack and is not the active demo workflow. Docker's official guidance says
  PostgreSQL 17 and below use `/var/lib/postgresql/data`; PostgreSQL 18+ changed
  the layout. [Official image guidance](https://hub.docker.com/_/postgres).
- The API's `X-Demo-Role` header is forgeable by every public visitor. Use
  synthetic data only. A UI reset does not restore the shared database.
- Before implementation, `jk-sbx-project inspect
  'bash scripts/check-demo-deployment-contract.sh'` passed against committed
  HEAD, but accepted the unsafe image/mount. The updated implementation-lane
  run and its limited scope are recorded below.

## Implementation slices

1. **Make PostgreSQL storage deterministic.** Pin the demo image to a
   PostgreSQL 17 Alpine tag in `deploy/demo/compose.yaml`; mount `postgres_data`
   at `/var/lib/postgresql/data`. Update
   `scripts/check-demo-deployment-contract.sh` so it fails if the image or
   volume destination regresses. Keep database/API off published host ports.
   Do not apply the new mount to an unknown existing volume. Document an
   operator preflight to inspect current server version, named/anonymous
   volumes, and take a logical backup. If existing data uses a different
   major/layout, stop and document a tested migration or an explicitly
   disposable demo reset. Do not auto-downgrade PostgreSQL or delete data.
2. **Tighten the manual guide.** Update `DEPLOYMENT_GUIDE.md` with exact
   OrbStack context, external network and tunnel attachment, first-run
   password creation in an external file, `chmod 700` on its directory and
   `chmod 600` on its file, Compose validation, backup, start, public checks,
   update, rollback, and an explicit operator reset for disposable shared demo
   data. Keep safe `APP_ENV`, CORS, and DB names in Compose.
   Do not add `.env`, store credentials in Compose, or launch a second tunnel.
   State that images build in Docker Sandbox and run in OrbStack. Keep the
   selected public hostname rooted at `/`, with `/api/v1` same origin.
   Remove the hard-coded DSN fallback in `backend/cmd/server/main.go`; require
   `DATABASE_URL` at startup and add the smallest focused check for the
   missing-variable failure. Keep the Compose secret-to-DSN entrypoint path.
3. **Synchronize active docs.** Update `README.md`, `ARCHITECTURE.md`,
   `CONTRIBUTING.md`, `SECURITY.md`, `GATES.md`,
   `IMPLEMENTATION_STATUS.md`, and any other affected active guide to the
   actual code. Preserve historical records and append dated validation
   evidence. Fix stale statements that call this a deployed/live or
   automatically updated runtime without evidence.
4. **Implementation-proximate checks.** In the Docker Sandbox implementation
   lane, run the contract check, Compose config, focused Go checks if Go code
   changes, and static build/lint/typecheck if frontend code changes. Verify
   `git diff --check` and inspect the staged diff for secrets. If the only code
   change is Compose/contract, do not run an unrelated full browser suite.
   Commit only intended files and publish with `gh` per repository policy.

## Implementation progress (2026-09-24)

- Confirmed the worktree is on `main` and has pre-existing untracked
  `.agents/` and `skills-lock.json`; these are user data and are excluded from
  this change.
- Slice 1 implementation is complete. Use the fully versioned official image tag
  `docker.io/library/postgres:17.11-alpine3.24` and mount the named volume at
  `/var/lib/postgresql/data`. Docker's current official image guidance says
  PostgreSQL 17 and below use that data path; PostgreSQL 18+ changed layout.
- Existing OrbStack server version, volume identity/layout, and data have not
  been inspected. Do not attach the new mount to an existing volume until its
  owner has made and verified a logical backup and a reviewer has accepted a
  tested migration or an explicitly disposable reset.
- Next.js official static export guidance was checked through Context7; this
  pass does not change frontend code or its `output: 'export'` configuration.
- Runtime deployment, public URL checks, and changes to the live tunnel or
  OrbStack stack are outside this implementation pass.
- Slice 1 implementation is complete: active Compose tag/mount and contract
  assertions are updated; the operator guide now requires recording database
  version, configured image, data directory, and named/anonymous mount details,
  and a nonempty, listable logical backup before existing-volume changes.
- Slice 2 implementation is complete: the manual guide covers the `orbstack`
  context, external tunnel network, external password file permissions,
  Compose validation, start/update/rollback, same-origin root/API routing, and
  an explicitly destructive reset for confirmed disposable demo data. The
  Go missing-`DATABASE_URL` unit test is included.
- Slice 3 active docs are synchronized. Implementation-proximate validation
  passed in Docker Sandbox on 2026-09-24:
  `jk-sbx-project implement 'bash scripts/check-demo-deployment-contract.sh'`
  printed `Demo deployment contract: pass`; this ran `docker compose config
  --format json` and checked the exact image and volume source/type/destination,
  no host ports/build/env file, network isolation, and file-based credentials.
- `jk-sbx-project implement 'cd backend && go test ./cmd/server'` returned
  `ok accustandard-backend/cmd/server`, including the missing-
  `DATABASE_URL` startup configuration test.
- No frontend source changed, so the static build/lint/typecheck were not run.
  The existing OrbStack volume/server was not inspected; no image was loaded,
  container was started, database backup/reset performed, tunnel changed, or
  public/browser/API acceptance attempted.
- Local commit and authenticated `gh` publication remain pending until the
  final diff and staged paths are checked.

## Return packet for reviewer

Report changed commit SHA, remote SHA, exact commands/results, chosen
PostgreSQL tag and mount, existing-volume migration decision, documentation
paths, and anything not tested. Then hand control to GPT 6 Sol (High) for
independent Docker Sandbox validation, rendered/browser checks, public URL
checks, and revision handoffs. The user will manually trigger each agent.

## Acceptance owned by reviewer

- Contract rejects floating/wrong PostgreSQL major and mount; Compose config
  shows no `build`, `ports`, `env_file`, or cleartext password.
- Fresh PostgreSQL 17 volume becomes healthy, API `/api/v1/readiness` reports
  ready, frontend `/healthz` reports healthy, and the root page loads.
- At least one seeded read and one controlled mutation work through the
  public same-origin API; a missing/invalid demo role returns 401. Verify
  role and state changes without entering real company data.
- Cloudflare Tunnel resolves the intended hostname to the frontend; `/api/*`
  is uncached, HTTPS works, and mobile/desktop browser checks show no blocking
  console or accessibility error. These are future acceptance steps, not
  evidence from the planning pass.
- Rollback restores retained image pair without deleting the database; if a
  schema/data migration occurred, its dump/restore recovery is tested.
