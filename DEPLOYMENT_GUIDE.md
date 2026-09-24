# Demo deployment guide

This is the only active deployment path for the demo at
[https://accustandard.delegateops.business](https://accustandard.delegateops.business).
It uses realistic seeded demo data and is not a production release. Nothing
compiles, builds, or deploys automatically.

**Pre-launch gate:** Follow [`docs/agent/HANDOFF.md`](docs/agent/HANDOFF.md)
before starting this stack. The current Compose file uses a floating
PostgreSQL image and an unsafe volume destination for PostgreSQL 17. This
guide describes the intended manual procedure after that contract is fixed
and reviewed. The public URL has not been verified in the current planning
pass.

Think of the Docker Sandbox as the kitchen, OrbStack as the storefront, and
Cloudflare Tunnel as the private doorway. The kitchen prepares two image
packages; the storefront runs those packages; the doorway is the only public
entrance.

## What runs where

```text
Internet → Cloudflare Tunnel → accustandard-demo-frontend:80
                              │  cloudflared-network (external)
                              │
                              ├─ frontend → api:8080
                              └─ api → db:5432
                                 accustandard-network (internal)
```

Only the frontend joins `cloudflared-network`, using the unique
`accustandard-demo-frontend` alias. The API and PostgreSQL join only the
internal `accustandard-network`. No service publishes a host port, and
[`deploy/demo/compose.yaml`](deploy/demo/compose.yaml) contains images only;
it has no `build:` instructions.

The Compose secret is a local file created once under the deployment
directory. It is mounted at runtime, never written to an image, `.env` file,
macOS Keychain, or Git. Safe environment values stay in `compose.yaml`.
This demo does not need R2 because the application uses its checked-in static
assets and seeded demo data. The full Cloudflare option assessment is in
[`docs/agent/CLOUDFLARE_FEASIBILITY.md`](docs/agent/CLOUDFLARE_FEASIBILITY.md).

## Before the first run

Verify these prerequisites on macOS:

1. OrbStack is running and its Docker context is named `orbstack`.
2. The existing `cloudflared` container is running and already connected to
   the external `cloudflared-network`.
3. `jk-sbx-project` is available for Docker Sandbox work.
4. `docker`, `openssl`, and this repository checkout are available.

Check `docker context inspect orbstack` and confirm the running `cloudflared`
container uses that same Docker engine. Its existing Compose project must
attach it to `cloudflared-network`; a container on another Docker engine
cannot resolve this demo's network alias. If the network does not exist,
create it once:

```sh
docker --context orbstack network create cloudflared-network
```

Add `cloudflared-network` to the existing tunnel Compose service's networks,
and declare it as an external network there. Preserve that service's other
networks and settings. Apply the tunnel Compose change through its normal
operator procedure, then confirm the running container joined the network.

Do not start a second Cloudflare Tunnel container. Do not create a `.env` file
for this demo.

## One-time Cloudflare Tunnel route

For a remotely managed tunnel, open Cloudflare **Networking > Tunnels**, choose
the existing tunnel, and add a published application route with hostname
`accustandard.delegateops.business`, service type HTTP, and service URL
`accustandard-demo-frontend:80`. For a locally managed tunnel, add this ingress
rule before its catch-all rule:

```yaml
- hostname: accustandard.delegateops.business
  service: http://accustandard-demo-frontend:80
```

The tunnel container must be attached to `cloudflared-network` so Docker DNS
can resolve the frontend alias. In **Cache > Cache Rules**, create a rule with
this custom expression and set **Cache eligibility** to **Bypass cache**:

```text
(http.host eq "accustandard.delegateops.business" and starts_with(http.request.uri.path, "/api/"))
```

Static HTML,
JavaScript, CSS, and image assets may use the normal CDN policy. Confirm that
the hostname's proxied DNS CNAME targets this tunnel's
`<tunnel-uuid>.cfargotunnel.com` address and that no existing route for this
hostname will be displaced accidentally. The tunnel dashboard may create the
record when the route is saved; inspect DNS rather than adding a duplicate.

## Existing database preflight

Before changing an existing Compose deployment, inspect its running database
version and volume mounts. Preserve an existing logical backup and image pair.
Do not attach a PostgreSQL 18 or unknown data directory to the planned
PostgreSQL 17 mount, delete a volume, or assume the old named volume contains
the data. The current floating image may have written PostgreSQL 17 data to
an anonymous `/var/lib/postgresql/data` volume. If the stack already contains
data, follow the migration or disposable-reset procedure written by the
implementation agent and accepted by the reviewer. A first run with no prior
Compose volume can proceed after the pre-launch gate passes.

For a running prior stack, inspect before replacing its Compose file:

```sh
cd ~/docker/portfolio/accustandard
umask 077
docker --context orbstack compose ps
docker --context orbstack compose exec -T db \
  psql -U accustandard_demo -d accustandard_demo -Atqc 'SHOW server_version'
docker --context orbstack inspect \
  "$(docker --context orbstack compose ps -q db)" \
  --format '{{json .Mounts}}'
docker --context orbstack compose exec -T db \
  pg_dump -U accustandard_demo -d accustandard_demo \
  > ~/docker/portfolio/accustandard/backup-before-postgres-change.sql
chmod 600 ~/docker/portfolio/accustandard/backup-before-postgres-change.sql
```

If the running database reports a different major, or the mount path is
unclear, stop here and use the handoff's reviewed migration plan. Verify the
dump is nonempty before any database change.

## Build and export the images manually

Run these commands from the repository root. The Docker Sandbox has its own
Docker engine, so its images must be saved as archives before OrbStack can run
them. The `release/` directory is an operator workspace only and is ignored by
Git.

```sh
mkdir -p release
jk-sbx-project ensure
case "$(uname -m)" in
  arm64|aarch64) DEMO_PLATFORM=linux/arm64 ;;
  x86_64|amd64) DEMO_PLATFORM=linux/amd64 ;;
  *) echo "Unsupported host architecture: $(uname -m)" >&2; exit 1 ;;
esac

jk-sbx-project implement "docker build --pull --provenance=false \
  --platform ${DEMO_PLATFORM} \
  --tag accustandard-demo-api:latest \
  --file backend/Dockerfile backend"
jk-sbx-project implement 'docker save \
  --output release/accustandard-demo-api.tar \
  accustandard-demo-api:latest'

jk-sbx-project implement "docker build --pull --provenance=false \
  --platform ${DEMO_PLATFORM} \
  --tag accustandard-demo-frontend:latest \
  --file docker/demo-frontend.Dockerfile ."
jk-sbx-project implement 'docker save \
  --output release/accustandard-demo-frontend.tar \
  accustandard-demo-frontend:latest'
```

The frontend build uses `node:lts-alpine` and serves the static export with
`nginx:alpine`. The API uses `golang:alpine` and `alpine:latest`; the target
Compose contract pins PostgreSQL to major 17. Repeat
the build manually when you choose to receive upstream image updates. The
platform selection above uses `linux/arm64` on Apple silicon and
`linux/amd64` on Intel. The
PostgreSQL major upgrades require a deliberate backup and tested migration;
do not use `compose down -v` as an upgrade step.

Before a full build, the deployment contract can be checked without compiling,
starting, or publishing anything:

```sh
jk-sbx-project inspect 'bash scripts/check-demo-deployment-contract.sh'
```

## Load and run the OrbStack storefront

Create the deployment directory and copy the prepared files:

```sh
install -d -m 700 ~/docker/portfolio/accustandard
install -d -m 700 ~/docker/portfolio/accustandard/secrets
cp deploy/demo/compose.yaml ~/docker/portfolio/accustandard/compose.yaml
cp release/accustandard-demo-*.tar ~/docker/portfolio/accustandard/
```

Create the database password only if this is the first run. Keeping the same
file preserves access to the existing PostgreSQL volume across restarts:

```sh
if [ ! -f ~/docker/portfolio/accustandard/secrets/postgres_password.txt ]; then
  umask 077
  openssl rand -hex 32 > ~/docker/portfolio/accustandard/secrets/postgres_password.txt
fi
chmod 700 ~/docker/portfolio/accustandard/secrets
chmod 600 ~/docker/portfolio/accustandard/secrets/postgres_password.txt
```

Load the archives and start the image-only Compose project through the explicit
OrbStack context. `--pull never` ensures Compose does not replace the manually
loaded images with registry pulls.

```sh
docker --context orbstack load \
  --input ~/docker/portfolio/accustandard/accustandard-demo-api.tar
docker --context orbstack load \
  --input ~/docker/portfolio/accustandard/accustandard-demo-frontend.tar
cd ~/docker/portfolio/accustandard
docker --context orbstack network inspect cloudflared-network
docker --context orbstack pull docker.io/library/postgres:17-alpine
docker --context orbstack compose config --quiet
docker --context orbstack compose up -d --pull never
docker --context orbstack compose ps
```

Run the local checks before using the public URL:

```sh
docker --context orbstack compose exec frontend wget -q -O - http://127.0.0.1/healthz
docker --context orbstack compose exec api wget -q -O - http://127.0.0.1:8080/api/v1/readiness
curl --fail --silent --show-error https://accustandard.delegateops.business/ >/dev/null
curl --fail --silent --show-error \
  https://accustandard.delegateops.business/api/v1/readiness
```

On first startup, the API applies the runtime schema and idempotent demo seed
after PostgreSQL becomes available. Existing demo edits remain in the volume;
the UI reset action reloads server data and does not reset the database.

## Stop, update, or roll back

Stop the demo without deleting its database volume:

```sh
docker --context orbstack compose down
```

Do not use `docker compose down -v` unless you deliberately want to erase the
demo database and reseed it on the next startup.

For an update, repeat the build, export, copy, load, and `up -d --pull never`
steps. For a rollback, load a retained pair of known-good archives and run the
same Compose command. Record image IDs when a repeatable demo snapshot matters:

```sh
docker --context orbstack image inspect \
  accustandard-demo-api:latest accustandard-demo-frontend:latest \
  --format '{{.RepoTags}} {{.Id}}'
```

## Historical deployment records

The repository retains older VPS, Caddy, Podman Quadlet, and automated-release
files as historical records for traceability. They are outside this demo
procedure and do not authorize a current demo deployment. Production files and
commands are also outside this guide.

## Official references

- [Docker Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Docker Compose secrets](https://docs.docker.com/compose/how-tos/use-secrets/)
- [Docker Compose networks](https://docs.docker.com/reference/compose-file/networks/)
- [Docker Sandboxes](https://docs.docker.com/ai/sandboxes/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)
- [Cloudflare cache](https://developers.cloudflare.com/cache/)
- [Create a Cloudflare Cache Rule](https://developers.cloudflare.com/cache/how-to/cache-rules/create-dashboard/)
- [Cloudflare published Tunnel applications](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/)
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [OrbStack Docker context](https://docs.orbstack.dev/docker/)
- [PostgreSQL official image storage layout](https://hub.docker.com/_/postgres)
