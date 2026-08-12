#!/usr/bin/env bash
# Accustandard Medical ERP — remote VPS build and Quadlet deployment

set -euo pipefail

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

DEMO_ROOT="${HOME}/bridge-ph/accustandard-demo"
SOURCE_ROOT="${DEMO_ROOT}/source"
DEMO_QUADLET_DIR="${HOME}/.config/containers/systemd/bridge-ph/accustandard-demo"
POSTGRES_DATA_DIR="${DEMO_ROOT}/postgres-data"

stop_demo_services() {
  systemctl --user stop accustandard-demo-app.service accustandard-demo-db.service \
    accustandard-demo-pod-pod.service 2>/dev/null || true
}

# Frontend build output is disposable. Keep the backend image below because
# the demo Quadlet references it after this script exits.
cleanup_frontend_artifacts() {
  rm -rf -- "${SOURCE_ROOT}/out" "${SOURCE_ROOT}/node_modules" "${SOURCE_ROOT}/.next"
}
trap cleanup_frontend_artifacts EXIT INT TERM

echo '[1/6] Verifying remote source and data directories...'
mkdir -p "${DEMO_ROOT}/web-dist" "${POSTGRES_DATA_DIR}" "${DEMO_QUADLET_DIR}"
test -d "${SOURCE_ROOT}/backend"
test -f "${SOURCE_ROOT}/package-lock.json"

stop_demo_services

if [[ -f "${POSTGRES_DATA_DIR}/PG_VERSION" ]]; then
  IFS= read -r postgres_data_major < "${POSTGRES_DATA_DIR}/PG_VERSION" || true
  if [[ "${postgres_data_major}" != "17" ]]; then
    echo "Removing legacy PostgreSQL ${postgres_data_major} demo data; initializing PostgreSQL 17..."
    find "${POSTGRES_DATA_DIR}" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
  fi
fi

echo '[2/6] Building the frontend in a disposable container...'
podman run --rm --userns=keep-id \
  -v "${SOURCE_ROOT}:/workspace:Z" \
  -v /workspace/node_modules \
  -v /workspace/.next \
  -w /workspace \
node:lts-alpine \
  sh -lc 'npm ci --no-audit --no-fund && npm run build'
test -f "${SOURCE_ROOT}/out/index.html"

echo '[3/6] Building the persistent Go image for the Quadlet...'
podman build --pull=missing --layers=false --force-rm \
  --tag localhost/accustandard-bridge-backend:demo \
  --file "${SOURCE_ROOT}/backend/Dockerfile" \
  "${SOURCE_ROOT}/backend"

echo '[4/6] Installing only the AccuStandard demo Quadlets...'
cp -f "${SOURCE_ROOT}/deploy/quadlets/demo/"* "${DEMO_QUADLET_DIR}/"

echo '[5/6] Publishing the static export to web-dist...'
rsync -a --delete "${SOURCE_ROOT}/out/" "${DEMO_ROOT}/web-dist/"

echo '[6/6] Starting the demo database and API services...'
loginctl enable-linger "${USER}" 2>/dev/null || true
stop_demo_services
systemctl --user daemon-reload
systemctl --user reset-failed accustandard-demo-db.service accustandard-demo-app.service 2>/dev/null || true
if ! systemctl --user restart accustandard-demo-db.service; then
  echo 'PostgreSQL Quadlet failed. Full unit diagnostics:' >&2
  systemctl --user status accustandard-demo-db.service --no-pager -l >&2 || true
  journalctl --user -u accustandard-demo-db.service -n 100 --no-pager >&2 || true
  exit 1
fi

echo '    Waiting for PostgreSQL readiness...'
for attempt in $(seq 1 30); do
  if podman exec accustandard-demo-db pg_isready -U accustandard -d accustandard_demo_db >/dev/null 2>&1; then
    break
  fi
  if [ "${attempt}" -eq 30 ]; then
    echo 'PostgreSQL did not become ready within 60 seconds.' >&2
    exit 1
  fi
  sleep 2
done

if ! systemctl --user restart accustandard-demo-app.service; then
  echo 'AccuStandard API Quadlet failed. Full unit diagnostics:' >&2
  systemctl --user status accustandard-demo-app.service --no-pager -l >&2 || true
  journalctl --user -u accustandard-demo-app.service -n 100 --no-pager >&2 || true
  exit 1
fi
systemctl --user is-active --quiet accustandard-demo-db.service
systemctl --user is-active --quiet accustandard-demo-app.service
curl --fail --silent --show-error \
  http://127.0.0.1:8080/accustandard/demo/api/v1/readiness >/dev/null

echo '==> Remote VPS build and Quadlet deployment completed'
