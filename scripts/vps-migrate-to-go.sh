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
  local service
  for service in \
    accustandard-demo-app.service \
    accustandard-demo-db.service \
    accustandard-demo-pod-pod.service; do
    if systemctl --user is-active --quiet "${service}" 2>/dev/null; then
      if ! systemctl --user stop "${service}"; then
        echo "Failed to stop active demo service: ${service}" >&2
        return 1
      fi
    fi
  done
}

reset_demo_database_if_needed() {
  local data_state
  data_state="$(podman unshare sh -c '
    set -eu
    data=$1
    if [ -f "$data/PG_VERSION" ]; then
      IFS= read -r major < "$data/PG_VERSION" || true
      printf '%s' "version:$major"
    elif [ -n "$(find "$data" -mindepth 1 -maxdepth 1 -print -quit)" ]; then
      printf '%s' invalid
    else
      printf '%s' empty
    fi
  ' sh "$POSTGRES_DATA_DIR")"

  case "$data_state" in
    version:17)
      return 0
      ;;
    version:*)
      echo "Removing legacy PostgreSQL ${data_state#version:} demo data; initializing PostgreSQL 17..."
      ;;
    invalid)
      echo "Removing incomplete demo PostgreSQL data with no PG_VERSION; initializing PostgreSQL 17..."
      ;;
    empty)
      return 0
      ;;
    *)
      echo "Could not inspect demo PostgreSQL data state: $data_state" >&2
      return 1
      ;;
  esac

  # This path is disposable demo state. Never apply this reset policy to a
  # production database or a data directory whose contents must be preserved.
  podman unshare sh -c '
    set -eu
    data=$1
    find "$data" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
  ' sh "$POSTGRES_DATA_DIR"
}

assert_postgres_17() {
  local server_version
  server_version="$(podman exec accustandard-demo-db \
    psql -U accustandard -d accustandard_demo_db -Atqc 'SHOW server_version_num')"
  if [[ "$server_version" != 17* ]]; then
    echo "Expected PostgreSQL 17, got server_version_num=$server_version" >&2
    return 1
  fi
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
reset_demo_database_if_needed

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
assert_postgres_17
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
