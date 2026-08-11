#!/usr/bin/env bash
# Accustandard Medical ERP — remote VPS build and Quadlet deployment

set -euo pipefail

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

DEMO_ROOT="${HOME}/bridge-ph/accustandard-demo"
SOURCE_ROOT="${DEMO_ROOT}/source"
DEMO_QUADLET_DIR="${HOME}/.config/containers/systemd/bridge-ph/accustandard-demo"

echo '[1/6] Verifying remote source and data directories...'
mkdir -p "${DEMO_ROOT}/web-dist" "${DEMO_ROOT}/postgres-data" "${DEMO_QUADLET_DIR}"
test -d "${SOURCE_ROOT}/backend"
test -f "${SOURCE_ROOT}/package-lock.json"

echo '[2/6] Building the frontend in a disposable container...'
podman run --rm --userns=keep-id \
  -v "${SOURCE_ROOT}:/workspace:Z" \
  -v /workspace/node_modules \
  -v /workspace/.next \
  -w /workspace \
  node:lts-alpine \
  sh -lc 'npm ci && npm run build'
test -f "${SOURCE_ROOT}/out/index.html"

echo '[3/6] Building the persistent Go image for the Quadlet...'
podman build --pull=missing \
  --tag localhost/accustandard-bridge-backend:demo \
  --file "${SOURCE_ROOT}/backend/Dockerfile" \
  "${SOURCE_ROOT}/backend"

echo '[4/6] Installing only the AccuStandard demo Quadlets...'
cp -f "${SOURCE_ROOT}/deploy/quadlets/demo/"* "${DEMO_QUADLET_DIR}/"

echo '[5/6] Publishing the static export to web-dist...'
rsync -a --delete "${SOURCE_ROOT}/out/" "${DEMO_ROOT}/web-dist/"

echo '[6/6] Reloading and restarting only the demo API service...'
loginctl enable-linger "${USER}" 2>/dev/null || true
systemctl --user daemon-reload
systemctl --user restart accustandard-demo-app.service

echo '==> Remote VPS build and Quadlet deployment completed'
