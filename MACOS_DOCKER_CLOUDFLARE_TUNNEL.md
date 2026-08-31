# macOS Docker + Cloudflare Tunnel

This Compose stack is intended for an always-on Apple-silicon Mac mini with
Docker Desktop. It runs the static Next export in nginx, the existing Go API,
PostgreSQL 17. It reuses the existing Cloudflare Tunnel connector.

The Compose and Dockerfile images intentionally use floating official Alpine
tags (`postgres:17-alpine`, `node:alpine`, `nginx:alpine`, `golang:alpine`, and
`alpine:latest`). Always pass `--pull` when rebuilding. Floating tags receive
upstream updates but do not reproduce the same image on every build; record
`docker image inspect` digests when you need an auditable release.

## First run

Create the database secret file (it is ignored by Git):

```sh
mkdir -p secrets
openssl rand -hex 32 > secrets/postgres_password.txt
```

In the existing Cloudflare Tunnel, add a public hostname route to
`http://127.0.0.1:8088` when `cloudflared` runs on macOS, or
`http://host.docker.internal:8088` when the existing connector runs in Docker.
Do not start another `cloudflared` container for this stack.

Start and inspect the stack:

```sh
docker compose up -d --build
docker compose ps
```

The local origin is available at `http://127.0.0.1:8088/demo/accustandard/`.
Only nginx is published on the Mac; the API and database stay on the Compose
network. `postgres_data` is a named Docker volume and survives container
recreation.

Stop without deleting data with `docker compose down`. Do not use
`docker compose down -v` unless the database volume is intentionally being
removed.

This is a demo runtime: `APP_ENV=demo` retains the application's forgeable
demo-role boundary. Put Cloudflare Access in front of the public hostname and
do not treat the Tunnel as application authentication.

## Production build

The repository's protected API routes intentionally return `503` when
`APP_ENV` is not `demo` until a real identity provider is integrated. Do not
expose the production stack until that authentication work is complete.

After authentication is implemented:

```sh
openssl rand -hex 32 > secrets/postgres_production_password.txt
docker compose -f compose.yml -f compose.production.yml config --quiet
docker compose down
docker compose -f compose.yml -f compose.production.yml up -d --build
docker compose -f compose.yml -f compose.production.yml ps
```

Add a second hostname to the existing Cloudflare Tunnel and route it to
`http://127.0.0.1:8088` (macOS connector) or
`http://host.docker.internal:8088` (Docker connector). Use the production URL
under `/prod/accustandard/`. Keep the demo and production database volumes
separate; never use `docker compose down -v` for either environment unless the
volume is intentionally being destroyed.
