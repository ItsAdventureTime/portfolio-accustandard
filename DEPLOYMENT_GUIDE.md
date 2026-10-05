# AccuStandard ERP Demo Deployment Guide

This guide walks through deploying the AccuStandard Medical ERP demo on a self-hosted macOS Mac mini running **OrbStack** (`docker compose`), exposed through **Cloudflare Tunnel** at:

**`https://accustandard.delegateops.business/`**

The deployment uses synthetic seeded data for demonstration and portfolio review. It requires no external `.env` files, keeps sensitive credentials in isolated file-based secrets, exposes zero host ports, and labels all containers with the `accustandard-portfolio_` prefix.

---

## Architecture and Network Flow

```text
Internet
   │
   ▼ HTTPS
Cloudflare Edge & CDN (Domain: accustandard.delegateops.business)
   │
   ▼ Cloudflare Tunnel Protocol
Existing cloudflared Container
   │
   ▼ HTTP (port 80)
accustandard-portfolio_frontend (Nginx Alpine + Next.js Static Export)
   │  [Network: cloudflared-network (external) + accustandard-network (internal)]
   │
   ▼ Reverse Proxy /api/* (port 8080)
accustandard-portfolio_api (Go REST API, Chi Router)
   │  [Network: accustandard-network (internal only)]
   │
   ▼ Database Connection (port 5432)
accustandard-portfolio_db (PostgreSQL 17 Alpine)
   │  [Network: accustandard-network (internal only)]
   ▼
Storage Volume: postgres_data (/var/lib/postgresql/data)
```

### Key Architectural Boundaries
1. **Network Isolation**: Only `frontend` joins `cloudflared-network` with the alias `accustandard-demo-frontend`. `api` and `db` join only the internal bridge (`accustandard-network`).
2. **Zero Published Ports**: No service publishes a host port (`ports:` is forbidden). Ingress is strictly mediated by your existing `cloudflared` container.
3. **No External `.env` Files**: All non-sensitive configuration is embedded directly inside `compose.yaml`.
4. **Native File Secrets**: Database credentials stay in `./secrets/postgres_password.txt` (permissions `600`/`700`) and mount into containers at `/run/secrets/postgres_password`, matching the security model of Podman/Docker secrets without leaking cleartext credentials into process environments or images.

---

## Configuration Reference

### 1. Environment Variables in `compose.yaml`

| Container | Variable | Value | Purpose |
| :--- | :--- | :--- | :--- |
| **`db`** | `POSTGRES_DB` | `accustandard_demo` | Database name to initialize |
| **`db`** | `POSTGRES_USER` | `accustandard_demo` | Primary database user |
| **`db`** | `POSTGRES_PASSWORD_FILE` | `/run/secrets/postgres_password` | Tells Postgres to read password from mounted secret |
| **`api`** | `APP_ENV` | `demo` | Enables demo mode and synthetic role evaluation |
| **`api`** | `ACCUSTANDARD_BASE_PATH` | `""` | Configures root routing for the custom domain |
| **`api`** | `CORS_ALLOWED_ORIGINS` | `https://accustandard.delegateops.business` | Allowed CORS origins for browser requests |
| **`api`** | `DATABASE_HOST` | `db` | Resolves database container via internal Docker DNS |
| **`api`** | `DATABASE_NAME` | `accustandard_demo` | Target database name |
| **`api`** | `DATABASE_USER` | `accustandard_demo` | Target database username |
| **`api`** | `DATABASE_PASSWORD_FILE` | `/run/secrets/postgres_password` | Tells Go entrypoint where secret is mounted |

### 2. Secret Files Layout

- **Relative Path**: `./secrets/postgres_password.txt` beside `compose.yaml`.
- **Permissions**: Directory mode `700`, file mode `600`.
- **Container Path**: Mounted read-only at `/run/secrets/postgres_password`.

---

## Pre-Flight Checklist

Before launching, check these prerequisites on your macOS host:

1. **OrbStack running**: Verify Docker CLI targets OrbStack:
   ```bash
   docker context show
   # Expected output: orbstack
   ```
2. **Cloudflare Tunnel running**: Verify your existing `cloudflared` container is up and attached to `cloudflared-network`:
   ```bash
   docker network inspect cloudflared-network >/dev/null 2>&1 || docker network create cloudflared-network
   docker ps --filter "network=cloudflared-network" --format "table {{.Names}}\t{{.Status}}"
   ```
3. **Docker Sandbox available**: `jk-sbx-project` is present for clean image builds.
4. **Tooling**: `openssl`, `git`, and `gh` are available on your system.

---

## Step-by-Step Deployment Instructions

### Step 1: Generate or Verify the Database Secret
Generate a random 64-character hexadecimal password if one does not already exist:

```bash
install -d -m 700 deploy/demo/secrets
if [ ! -e deploy/demo/secrets/postgres_password.txt ]; then
  umask 077
  openssl rand -hex 32 > deploy/demo/secrets/postgres_password.txt
fi
chmod 700 deploy/demo/secrets
chmod 600 deploy/demo/secrets/postgres_password.txt
test -s deploy/demo/secrets/postgres_password.txt
```

> [!NOTE]
> If you are connecting to an existing database volume, preserve the original password file to prevent authentication mismatches.

### Step 2: Build and Export Images in Docker Sandbox
Build the API and frontend images inside the clean sandbox environment, targeting your Mac's architecture (`linux/arm64` on Apple Silicon):

```bash
mkdir -p release
jk-sbx-project ensure

case "$(uname -m)" in
  arm64|aarch64) DEMO_PLATFORM=linux/arm64 ;;
  x86_64|amd64) DEMO_PLATFORM=linux/amd64 ;;
  *) echo "Unsupported host architecture: $(uname -m)" >&2; exit 1 ;;
esac

# 1. Build and archive the Go REST API
jk-sbx-project implement "docker build --pull --provenance=false \
  --platform ${DEMO_PLATFORM} \
  --tag accustandard-demo-api:latest \
  --file backend/Dockerfile backend"
jk-sbx-project implement 'docker save \
  --output release/accustandard-demo-api.tar \
  -- accustandard-demo-api:latest'

# 2. Build and archive the Next.js Frontend
jk-sbx-project implement "docker build --pull --provenance=false \
  --platform ${DEMO_PLATFORM} \
  --tag accustandard-demo-frontend:latest \
  --file docker/demo-frontend.Dockerfile ."
jk-sbx-project implement 'docker save \
  --output release/accustandard-demo-frontend.tar \
  -- accustandard-demo-frontend:latest'
```

Before proceeding, run the automated contract verification:
```bash
jk-sbx-project inspect 'bash scripts/check-demo-deployment-contract.sh'
# Must output: Demo deployment contract: pass
```

### Step 3: Stage Deployment Files in OrbStack
Create the local runtime directory on your host and copy the Compose specification, image archives, and secret:

```bash
install -d -m 700 ~/docker/portfolio/accustandard
install -d -m 700 ~/docker/portfolio/accustandard/secrets

# Copy compose.yaml and prebuilt tar archives
cp deploy/demo/compose.yaml ~/docker/portfolio/accustandard/compose.yaml
cp release/accustandard-demo-*.tar ~/docker/portfolio/accustandard/

# Copy password file preserving strict permissions
if [ ! -e ~/docker/portfolio/accustandard/secrets/postgres_password.txt ]; then
  install -m 600 deploy/demo/secrets/postgres_password.txt \
    ~/docker/portfolio/accustandard/secrets/postgres_password.txt
fi
chmod 700 ~/docker/portfolio/accustandard/secrets
chmod 600 ~/docker/portfolio/accustandard/secrets/postgres_password.txt
test -s ~/docker/portfolio/accustandard/secrets/postgres_password.txt
```

### Step 4: Load Images and Start the Stack
Load the tar archives into OrbStack and start the services:

```bash
# Load images into OrbStack Docker daemon
docker --context orbstack load --input ~/docker/portfolio/accustandard/accustandard-demo-api.tar
docker --context orbstack load --input ~/docker/portfolio/accustandard/accustandard-demo-frontend.tar

# Pull pinned PostgreSQL 17 image
docker --context orbstack pull docker.io/library/postgres:17-alpine

cd ~/docker/portfolio/accustandard

# Validate Compose configuration
docker --context orbstack compose config --quiet

# Launch containers in background without registry pull
docker --context orbstack compose up -d --pull never

# Verify container status and prefix
docker --context orbstack compose ps
```

Expected containers running:
- `accustandard-portfolio_db`
- `accustandard-portfolio_api`
- `accustandard-portfolio_frontend`

### Step 5: Configure Cloudflare Tunnel & Caching

#### 1. Tunnel Ingress Rule
In Cloudflare Zero Trust Dashboard (**Networks > Tunnels > [Your Tunnel] > Public Hostname**), add:
- **Public Hostname**: `accustandard.delegateops.business`
- **Service Type**: `HTTP`
- **URL**: `accustandard-demo-frontend:80`

*If using a local tunnel `config.yml` instead*:
```yaml
ingress:
  - hostname: accustandard.delegateops.business
    service: http://accustandard-demo-frontend:80
  - service: http_status:404
```

#### 2. Cloudflare Caching Policy
**Is a Cloudflare Cache Rule necessary?**
Under standard Cloudflare settings, **no extra rule is required**. Nginx in `docker/demo-nginx.conf` automatically emits:
```nginx
location /api/ {
    add_header Cache-Control "no-store" always;
    proxy_pass http://api:8080;
    ...
}
```
Cloudflare honors `Cache-Control: no-store` and will never cache dynamic `/api/*` responses unless you configured an aggressive zone-wide "Cache Everything" rule.

*If your zone uses a global "Cache Everything" rule*, add an exception in Cloudflare **Caching > Cache Rules**:
- **Rule Name**: `Bypass Cache for AccuStandard API`
- **Expression**: `(http.host eq "accustandard.delegateops.business" and starts_with(http.request.uri.path, "/api/"))`
- **Cache Eligibility**: `Bypass cache`

#### 3. DNS CNAME Verification
Ensure DNS for `accustandard.delegateops.business` has an active proxied CNAME pointing to `<tunnel-uuid>.cfargotunnel.com`.

---

## Health Checks and Validation

### 1. Local Container Probes
Verify container health from your host:
```bash
# Frontend health
docker --context orbstack compose exec frontend wget -q -O - http://127.0.0.1/healthz
# Expected: ok

# API readiness and database connection
docker --context orbstack compose exec api wget -q -O - http://127.0.0.1:8080/api/v1/readiness
# Expected: {"db":"connected","status":"ready"}
```

### 2. Public HTTPS Probes
Test the public endpoint over the Internet:
```bash
# Root frontend page
curl --fail --silent --show-error https://accustandard.delegateops.business/ >/dev/null

# API readiness through Cloudflare Tunnel
curl --fail --silent --show-error https://accustandard.delegateops.business/api/v1/readiness
# Expected: {"db":"connected","status":"ready"}
```

### 3. Application Workflow Acceptance
1. Open `https://accustandard.delegateops.business/` in a browser.
2. Confirm the dashboard loads cleanly with seeded medical inventory records.
3. Switch user roles via the top-bar role selector (`Sales`, `Warehouse`, `Accounting Firm Admin`).
4. Create an RFQ or review a purchase order to confirm database read/write functionality.

---

## Routine Operations

### Stopping the Stack
To stop the services without deleting the database volume:
```bash
cd ~/docker/portfolio/accustandard
docker --context orbstack compose down
```

> [!WARNING]
> Never use `docker compose down -v` unless you explicitly want to erase the database volume and reset demo data back to factory seeds.

### Updating the Application
When code changes occur:
1. Rebuild and export images using Step 2.
2. Copy archives to `~/docker/portfolio/accustandard/`.
3. Load images into OrbStack (`docker load -i ...`).
4. Run `docker --context orbstack compose up -d --pull never`.

---

## Official References
- [Docker Compose Secrets](https://docs.docker.com/compose/how-tos/use-secrets/)
- [Docker Compose Networking](https://docs.docker.com/compose/how-tos/networking/)
- [Cloudflare Tunnel Routing](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/)
- [Cloudflare CDN Cache-Control](https://developers.cloudflare.com/cache/concepts/cache-control/)
- [PostgreSQL Official Docker Image](https://hub.docker.com/_/postgres)
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)
- [OrbStack Documentation](https://docs.orbstack.dev/)
