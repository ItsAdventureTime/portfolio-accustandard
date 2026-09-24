# Active handoff: portfolio demo deployment

ACTIVE_ROLE: planner/reviewer (GPT 6 Sol, High)
NEXT_OWNER: implementation agent (GPT 6 Luna, High; manually triggered by user)
IMPLEMENTATION_OWNER: implementation agent (GPT 6 Luna, High)
REVIEW_OWNER: planner/reviewer (GPT 6 Sol, High)
STATUS: ready for implementation; deployment and public acceptance not yet verified
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

## Evidence and current risk

- `deploy/demo/compose.yaml` already isolates API/database on
  `accustandard-network`, gives only frontend a `cloudflared-network` alias,
  and injects the PostgreSQL password from `./secrets/postgres_password.txt`.
  Safe non-secret environment values stay in Compose; no `.env` is needed.
- `next.config.ts` has `output: 'export'`; `src/lib/api.ts` uses `/api/v1`;
  `docker/demo-nginx.conf` proxies that path to the Go API.
- `backend/internal/db/db.go` uses the PostgreSQL GORM driver and runs startup
  SQL. The current migration contract is validated against PostgreSQL 17.
- `backend/cmd/server/main.go` still supplies a hard-coded fallback PostgreSQL
  DSN when `DATABASE_URL` is absent. The Compose entrypoint normally constructs
  `DATABASE_URL` from the mounted secret, but the executable should fail closed
  if it is missing. The unrelated `backend/main.go` is a historical stub; the
  active image builds `./cmd/server`.
- The active Compose file uses `postgres:alpine` and mounts the named volume at
  `/var/lib/postgresql`. The contract script currently approves that choice.
  Docker's official image guide states PostgreSQL 17 and below need a volume at
  `/var/lib/postgresql/data`; PostgreSQL 18 and above changed `PGDATA` and the
  volume layout. The floating major version and mount are a data-retention
  risk. [Official image guidance](https://hub.docker.com/_/postgres).
- The API's `X-Demo-Role` header is forgeable by every public visitor. Use
  synthetic data only. A UI reset does not restore the shared database.
- `jk-sbx-project inspect 'bash scripts/check-demo-deployment-contract.sh'`
  passed on 2026-09-24 against committed HEAD. This checks configuration only;
  it did not build images, start the stack, or verify the public URL.

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
