#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — VPS Go Backend & Database Migration Script
# Target Host: jk@216.75.75.136
# Target Directory: /home/jk/bridge-ph/accustandard-demo/
# ==============================================================================

set -euo pipefail

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

DEMO_ROOT="/home/jk/bridge-ph/accustandard-demo"
SOURCE_ROOT="$DEMO_ROOT/source"
QUADLET_DIR="/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo"
POSTGRES_DATA_DIR="$DEMO_ROOT/postgres-data"

stop_demo_services() {
  systemctl --user stop accustandard-demo-app.service accustandard-demo-db.service \
    accustandard-demo-pod-pod.service 2>/dev/null || true
}

echo "======================================================================"
echo "==> Initializing VPS Go Backend & PostgreSQL Database Migration..."
echo "======================================================================"

# 1. Ensure required directory structure exists
mkdir -p "$POSTGRES_DATA_DIR"
mkdir -p "$DEMO_ROOT/web-dist"
mkdir -p "$SOURCE_ROOT"
mkdir -p "$QUADLET_DIR"

stop_demo_services

if [ -f "$POSTGRES_DATA_DIR/PG_VERSION" ]; then
  read -r postgres_data_major < "$POSTGRES_DATA_DIR/PG_VERSION" || true
  if [ "$postgres_data_major" != "17" ]; then
    echo "Removing legacy PostgreSQL $postgres_data_major demo data; initializing PostgreSQL 17..."
    find "$POSTGRES_DATA_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
  fi
fi

# 2. Build Go API Container Image on VPS if backend code is present
if [ -d "$SOURCE_ROOT/backend" ] && [ -f "$SOURCE_ROOT/backend/Dockerfile" ]; then
  echo "[1/3] Building Go Backend image (localhost/accustandard-bridge-backend:demo)..."
  podman build --pull=missing --layers=false --force-rm -t localhost/accustandard-bridge-backend:demo -f "$SOURCE_ROOT/backend/Dockerfile" "$SOURCE_ROOT/backend"
fi

# 3. Reload systemd daemon & start the database before the API Quadlet
echo "[2/3] Reloading systemd user daemon & starting the database/API services..."
stop_demo_services
systemctl --user daemon-reload
systemctl --user reset-failed accustandard-demo-db.service accustandard-demo-app.service 2>/dev/null || true
if ! systemctl --user restart accustandard-demo-db.service; then
  echo "PostgreSQL Quadlet failed. Full unit diagnostics:" >&2
  systemctl --user status accustandard-demo-db.service --no-pager -l >&2 || true
  journalctl --user -u accustandard-demo-db.service -n 100 --no-pager >&2 || true
  exit 1
fi
for attempt in $(seq 1 30); do
  if podman exec accustandard-demo-db pg_isready -U accustandard -d accustandard_demo_db >/dev/null 2>&1; then
    break
  fi
  if [ "$attempt" -eq 30 ]; then
    echo "PostgreSQL did not become ready within 60 seconds." >&2
    exit 1
  fi
  sleep 2
done
if ! systemctl --user restart accustandard-demo-app.service; then
  echo "AccuStandard API Quadlet failed. Full unit diagnostics:" >&2
  systemctl --user status accustandard-demo-app.service --no-pager -l >&2 || true
  journalctl --user -u accustandard-demo-app.service -n 100 --no-pager >&2 || true
  exit 1
fi
systemctl --user is-active --quiet accustandard-demo-db.service
systemctl --user is-active --quiet accustandard-demo-app.service
curl --fail --silent --show-error http://127.0.0.1:8080/accustandard/demo/api/v1/readiness >/dev/null

# 4. Verify DB & Go container execution status
echo "[3/3] Checking container status..."
podman ps --filter "name=accustandard-demo" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "======================================================================"
echo "==> VPS Go Migration Initialization Complete!"
echo "======================================================================"
