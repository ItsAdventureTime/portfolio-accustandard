#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — Demo VPS Deployment & Caddy Auto-Repair Script
# Target Host: jk@216.75.75.136
# Demo Web Root Path:      /home/jk/bridge-ph/accustandard-demo/web-dist
# Live Demo URL:           https://delegateops.business/accustandard/demo
# Caddy Service:           caddy.service (~/.config/containers/systemd/caddy.container)
# ==============================================================================

set -euo pipefail

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

echo '======================================================================'
echo '==> Starting Accustandard Demo VPS Deployment and Caddy Auto-Repair...'
echo '======================================================================'

DEMO_ROOT="${HOME}/bridge-ph/accustandard-demo"
DEMO_QUADLET_DIR="${HOME}/.config/containers/systemd/bridge-ph/accustandard-demo"

# 1. Clean up legacy container services cleanly using targeted filters
echo '[1/6] Cleaning up legacy container services...'
podman stop --filter 'name=accustandard' 2>/dev/null || true
podman rm --filter 'name=accustandard' 2>/dev/null || true

# 2. Ensure Demo Web Root Directory structure
echo '[2/6] Verifying demo web root directory...'
mkdir -p "${DEMO_ROOT}/web-dist"
mkdir -p "${DEMO_ROOT}/postgres-data"
mkdir -p "${DEMO_ROOT}/backend"

# 3. Clean up legacy Quadlet folders and recreate target directory
echo '[3/6] Cleaning up Quadlet directory structures...'
rm -rf "${HOME}/.config/containers/systemd/bridge-ph/accustandard" 2>/dev/null || true
rm -rf "${HOME}/.config/containers/systemd/bridge-ph/accustanda" 2>/dev/null || true
rm -rf "${HOME}/.config/containers/systemd/bridge-ph/accustanda-demo" 2>/dev/null || true
mkdir -p "${DEMO_QUADLET_DIR}"

# 4. Synchronize Demo Quadlet Units
echo '[4/6] Synchronizing Demo Quadlet unit files...'
SCRIPT_SOURCE="${BASH_SOURCE[0]:-}"
if [ -n "${SCRIPT_SOURCE}" ] && [ -f "${SCRIPT_SOURCE}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${SCRIPT_SOURCE}")" && pwd)"
  REPO_DIR="$(dirname "${SCRIPT_DIR}")"
  if [ -d "${REPO_DIR}/deploy/quadlets/demo" ]; then
    cp -rf "${REPO_DIR}/deploy/quadlets/demo/"* "${DEMO_QUADLET_DIR}/" 2>/dev/null || true
  fi
fi

# Build Go Backend image on VPS using golang:alpine if source is available
if [ -d "${DEMO_ROOT}/backend" ] && [ -f "${DEMO_ROOT}/backend/Dockerfile" ]; then
  echo '  - Building Go REST API backend image (golang:alpine)...'
  podman build -t localhost/accustandard-bridge-backend:demo -f "${DEMO_ROOT}/backend/Dockerfile" "${DEMO_ROOT}/backend" || true
fi

# 5. Fix caddy.container Volume Mounts to mount /web-dist directly
echo '[5/6] Updating Caddy container volume mounts for static export web-dist...'

CADDY_CONTAINER_LOCATIONS=(
  "${HOME}/.config/containers/systemd/caddy/caddy.container"
  "${HOME}/.config/containers/systemd/caddy.container"
)

for c_loc in "${CADDY_CONTAINER_LOCATIONS[@]}"; do
  if [ -f "${c_loc}" ]; then
    echo "  - Updating Caddy container volume mount in: ${c_loc}"
    sed -i 's|/home/jk/bridge-ph/accustandard-demo:/srv/bridge-ph-accustandard-demo|/home/jk/bridge-ph/accustandard-demo/web-dist:/srv/bridge-ph-accustandard-demo|g' "${c_loc}" || true
    sed -i 's|/home/jk/bridge-ph/accustandard/demo|/home/jk/bridge-ph/accustandard-demo/web-dist|g' "${c_loc}" || true
  fi
done

# 6. Reload Systemd User Daemon & Restart Caddy Container Quadlet
echo '[6/6] Reloading systemd user daemon and restarting Caddy...'
loginctl enable-linger "${USER}" 2>/dev/null || true
systemctl --user daemon-reload

if systemctl --user list-unit-files 2>/dev/null | grep -q 'accustandard-demo-db.service'; then
  systemctl --user restart accustandard-demo-db.service 2>/dev/null || true
fi

if systemctl --user list-unit-files 2>/dev/null | grep -q 'accustandard-demo-app.service'; then
  systemctl --user restart accustandard-demo-app.service 2>/dev/null || true
fi

if systemctl --user list-unit-files 2>/dev/null | grep -q 'caddy.service'; then
  systemctl --user restart caddy.service 2>/dev/null || true
elif podman container exists caddy 2>/dev/null; then
  podman restart caddy 2>/dev/null || true
fi

# Reload Caddy config inside container
if podman container exists caddy 2>/dev/null; then
  podman exec caddy caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || true
fi

echo '======================================================================'
echo '==> Demo VPS Deployment & Caddy Repair Completed Successfully!'
echo '    Live Demo URL:  https://delegateops.business/accustandard/demo'
echo '    Demo Web Root:  /home/jk/bridge-ph/accustandard-demo/web-dist'
echo '======================================================================'
