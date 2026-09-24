# Demo deployment guide

This guide is the active deployment path for the demo target at
[https://accustandard.delegateops.business/](https://accustandard.delegateops.business/).
The app uses synthetic seeded data. Public DNS did not resolve during the
2026-09-24 review, so the public site has not passed acceptance. Builds and
deployment are manual.

**Pre-launch gate:** Follow [`docs/agent/HANDOFF.md`](docs/agent/HANDOFF.md)
and [`GATES.md`](GATES.md) before starting this stack. Compose pins
PostgreSQL to `17.11-alpine3.24` and mounts its named volume at
`/var/lib/postgresql/data`. This fixes the PostgreSQL 17 path contract; it does
not establish compatibility with data in any existing volume. The public URL
and running stack have not been verified by this implementation pass.

The latest operator request calls for floating `postgres:18-alpine`. That
change is still pending: the checked-in Compose file and contract use
PostgreSQL 17. Use the commands below only for the checked-in 17 configuration.
Before launching the requested 18 configuration, have the implementation owner
update and validate Compose, its contract, and this guide.

## Deployment order

1. Inspect and back up any existing database before changing its image or
   volume mount. Skip that preflight only when this is a fresh installation.
2. Build and export the API and frontend images in Docker Sandbox.
3. Copy the Compose file, image archives, and local password file to the
   deployment directory. Keep an existing database password unchanged.
4. Load the images in OrbStack, start Compose, and run the local checks.
5. Confirm the existing Cloudflare Tunnel route, repair the hostname's DNS record,
   then run the public checks. Finish browser and rollback acceptance before
   calling the demo ready.

The commands below follow that order. The existing Cloudflare Tunnel is the
only public entry point.

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

Compose reads the password from `deploy/demo/secrets/postgres_password.txt`
in this checkout, or from `secrets/postgres_password.txt` beside the copied
Compose file. Docker mounts it at `/run/secrets/postgres_password` for the
database and API. The file stays outside Git and the images. Safe environment
values stay in `compose.yaml`.
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
5. The checkout's `deploy/demo/secrets/` directory is mode `700`, and its
   `postgres_password.txt` file is mode `600`. The password is generated once
   and ignored by Git. If you cloned the repository elsewhere, create it with
   the command below before copying deployment files:

```sh
install -d -m 700 deploy/demo/secrets
if [ ! -e deploy/demo/secrets/postgres_password.txt ]; then
  umask 077
  openssl rand -hex 32 > deploy/demo/secrets/postgres_password.txt
fi
chmod 700 deploy/demo/secrets
chmod 600 deploy/demo/secrets/postgres_password.txt
test -s deploy/demo/secrets/postgres_password.txt
```

Keep this file private. The generated password is for a new database volume.
Keep a separate secure backup of it. An existing database needs its original
matching password file.

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
can resolve the frontend alias. Serve the app at the hostname root (`/`); the
static frontend calls `/api/v1` on the same origin and Nginx proxies it to the
API. In **Cache > Cache Rules**, create a rule with
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
The hostname had no public A or CNAME answer in the 2026-09-24 review. Check
the route and DNS again before expecting the public checks to pass. The
Cloudflare account owner must sign in and make any required dashboard changes;
do not put a tunnel token or API key in this repository.

## Existing database preflight

On 2026-09-25, a read-only OrbStack check found no AccuStandard container or
named volume. It found three unattached anonymous volumes whose former owners
are unknown. Check your old deployment directory and backups before declaring
this a fresh install. Do not delete or reuse those volumes to make room.

```sh
docker --context orbstack ps -a --filter label=com.docker.compose.project=accustandard-demo
docker --context orbstack volume ls
ls -ld ~/docker/portfolio/accustandard 2>/dev/null || true
```

If you find an earlier AccuStandard database, use its original password file
and follow the backup procedure below. If there is no earlier database, record
that decision and use the generated password for the new volume. Do not treat
another project's PostgreSQL volume as AccuStandard data.

Before changing an existing Compose deployment, inspect its server version,
configured image, data directory, and every named or anonymous volume mount.
The old floating image may have stored PostgreSQL 17 data in an anonymous
`/var/lib/postgresql/data` volume, while an existing named volume mounted at
`/var/lib/postgresql` may be empty. Do not attach the new mount to an unknown
volume, downgrade or change a major version, or delete data. No migration of an
existing volume has been approved or tested by this implementation pass. If
the version or data path differs from PostgreSQL 17 at
`/var/lib/postgresql/data`, stop until the reviewer accepts a tested logical
backup/restore migration or the operator explicitly confirms the data is
disposable and follows the reset procedure below. A fresh deployment with no
existing Compose database volume can proceed after the pre-launch gates pass.

For a running prior stack, inspect before replacing its Compose file:

```sh
cd ~/docker/portfolio/accustandard
umask 077
docker --context orbstack compose ps
docker --context orbstack compose exec -T db \
  psql -U accustandard_demo -d accustandard_demo -Atqc 'SHOW data_directory'
docker --context orbstack compose exec -T db \
  psql -U accustandard_demo -d accustandard_demo -Atqc 'SHOW server_version'
docker --context orbstack inspect \
  "$(docker --context orbstack compose ps -q db)" \
  --format '{{.Config.Image}}'
docker --context orbstack inspect \
  "$(docker --context orbstack compose ps -q db)" \
  --format '{{range .Mounts}}{{println .Type .Name .Source .Destination}}{{end}}'
docker --context orbstack volume ls
docker --context orbstack compose exec -T db \
  pg_dump -Fc -U accustandard_demo -d accustandard_demo \
  > ~/docker/portfolio/accustandard/backup-before-postgres-change.dump
chmod 600 ~/docker/portfolio/accustandard/backup-before-postgres-change.dump
test -s ~/docker/portfolio/accustandard/backup-before-postgres-change.dump
docker --context orbstack compose exec -T db pg_restore --list < \
  ~/docker/portfolio/accustandard/backup-before-postgres-change.dump >/dev/null
```

Verify `pg_restore --list` succeeds and the dump is nonempty before any
database change. Record the image and each mount's type, name, source, and destination.
If the dump is empty, the server is not PostgreSQL 17, or the data path is not
`/var/lib/postgresql/data`, stop. Continue only with a reviewer-approved,
tested restore into a fresh volume or an operator-confirmed disposable reset.

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
`nginx:alpine`. The API uses `golang:alpine` and `alpine:latest`; Compose pins
PostgreSQL to `17.11-alpine3.24`. Repeat
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

Copy the generated password into the deployment directory on a fresh install.
If the destination file exists, leave it in place. First confirm that it is
the password for the database volume found in the preflight. Do not overwrite
it with the newly generated checkout file:

```sh
if [ ! -e ~/docker/portfolio/accustandard/secrets/postgres_password.txt ]; then
  test -s deploy/demo/secrets/postgres_password.txt
  install -m 600 deploy/demo/secrets/postgres_password.txt \
    ~/docker/portfolio/accustandard/secrets/postgres_password.txt
fi
chmod 700 ~/docker/portfolio/accustandard/secrets
chmod 600 ~/docker/portfolio/accustandard/secrets/postgres_password.txt
test -s ~/docker/portfolio/accustandard/secrets/postgres_password.txt
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
docker --context orbstack pull docker.io/library/postgres:17.11-alpine3.24
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

If `curl` reports `Could not resolve host`, inspect the published tunnel route
and its Cloudflare DNS record. The [Cloudflare routing guide](https://developers.cloudflare.com/tunnel/concepts/routing/)
shows the expected CNAME to `<tunnel-uuid>.cfargotunnel.com`. Then repeat the
public checks. Test a seeded read, a synthetic write, role rejection, desktop
and mobile rendering, and the rollback path before marking the demo accepted.

On first startup, the API applies the runtime schema and idempotent demo seed
after PostgreSQL becomes available. Existing demo edits remain in the volume;
the UI reset action reloads server data and does not reset the database.

## Stop, update, or roll back

Stop the demo without deleting its database volume:

```sh
docker --context orbstack compose down
```

Do not use `docker compose down -v` for upgrades or rollback. It permanently
deletes the demo database volume.

For an update, repeat the build, export, copy, load, and `up -d --pull never`
steps. Back up the database first if the API update changes schema or stored
data. For a rollback, load a retained pair of known-good archives and run the
same Compose command; retain the database volume. An app-image rollback does
not reverse a schema migration, so restore a verified pre-update backup only
under a tested recovery procedure. Record image IDs when a repeatable demo
snapshot matters:

```sh
docker --context orbstack image inspect \
  accustandard-demo-api:latest accustandard-demo-frontend:latest \
  --format '{{.RepoTags}} {{.Id}}'
```

### Explicit reset for disposable shared demo data

Use this only after confirming that the current Compose project is
`accustandard-demo` and its shared demo data may be permanently erased. This
does not reset Cloudflare or another Compose project. Keep any required backup
outside the volume first. The next startup creates an empty PostgreSQL 17
volume and reseeds synthetic demo records:

```sh
cd ~/docker/portfolio/accustandard
docker --context orbstack compose config --quiet
docker --context orbstack compose down --volumes
docker --context orbstack compose up -d --pull never
docker --context orbstack compose ps
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
