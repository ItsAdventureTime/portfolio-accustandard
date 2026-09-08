# Demo deployment guide

This is the only active deployment path for the demo at
[https://accustandard.delegateops.business](https://accustandard.delegateops.business).
It uses realistic seeded demo data and is not a production release. Nothing
compiles, builds, or deploys automatically.

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
macOS Keychain, or Git. This demo does not need R2 because the application uses
its checked-in static assets and seeded demo data.

## Before the first run

Verify these prerequisites on macOS:

1. OrbStack is running and its Docker context is named `orbstack`.
2. The existing `cloudflared` container is running and already connected to
   the external `cloudflared-network`.
3. `jk-sbx-project` is available for Docker Sandbox work.
4. `docker`, `openssl`, and this repository checkout are available.

Do not start a second Cloudflare Tunnel container. Do not create a `.env` file
for this demo.

## One-time Cloudflare Tunnel route

Add a public hostname to the existing `cloudflared` configuration:

```yaml
hostname: accustandard.delegateops.business
service: http://accustandard-demo-frontend:80
```

The tunnel container must be attached to `cloudflared-network` so Docker DNS
can resolve the frontend alias. Add a Cloudflare Cache Rule that bypasses
caching for `/api/*` on this hostname; static HTML, JavaScript, CSS, and image
assets may use the normal CDN policy. Apply this route through the existing
tunnel administration process before opening the public URL.

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

jk-sbx-project exec docker build --pull --provenance=false \
  --platform "${DEMO_PLATFORM}" \
  --tag accustandard-demo-api:latest \
  --file backend/Dockerfile backend
jk-sbx-project exec docker save \
  --output release/accustandard-demo-api.tar \
  accustandard-demo-api:latest

jk-sbx-project exec docker build --pull --provenance=false \
  --platform "${DEMO_PLATFORM}" \
  --tag accustandard-demo-frontend:latest \
  --file docker/demo-frontend.Dockerfile .
jk-sbx-project exec docker save \
  --output release/accustandard-demo-frontend.tar \
  accustandard-demo-frontend:latest
```

The frontend build uses `node:lts-alpine` and serves the static export with
`nginx:alpine`. The API uses `golang:alpine` and `alpine:latest`; PostgreSQL
uses `postgres:alpine`. These are intentionally floating Alpine tags. Repeat
the build manually when you choose to receive upstream image updates. The
platform selection above uses `linux/arm64` on Apple silicon and
`linux/amd64` on Intel. The
`postgres:alpine` tag can move to a new PostgreSQL major version. Keep the
existing volume when upgrading, and perform a deliberate backup and tested
migration before accepting a major-version change; do not use `compose down -v`
as an upgrade step.

Before a full build, the deployment contract can be checked without compiling,
starting, or publishing anything:

```sh
jk-sbx-project exec bash scripts/check-demo-deployment-contract.sh
```

## Load and run the OrbStack storefront

Create the deployment directory and copy the prepared files:

```sh
mkdir -p ~/docker/portfolio/accustandard/secrets
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
docker --context orbstack pull docker.io/library/postgres:alpine
docker --context orbstack compose config --quiet
docker --context orbstack compose up -d --pull never
docker --context orbstack compose ps
```

Run the local checks before using the public URL:

```sh
docker --context orbstack compose exec frontend wget -q -O - http://127.0.0.1/healthz
docker --context orbstack compose exec api wget -q -O - http://127.0.0.1:8080/api/v1/readiness
curl --fail --silent --show-error https://accustandard.delegateops.business/ >/dev/null
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
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [OrbStack Docker context](https://docs.orbstack.dev/docker/)
