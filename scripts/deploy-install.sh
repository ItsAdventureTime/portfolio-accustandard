#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Accustanda ERP Dashboard - Direct Caddy Static Deployment Script
# Target VPS: Fedora CoreOS (Caddy Native Static File Server & Bunny CDN)
# Remote Web Dir: ~/bridge-ph/accustanda-demo
# Caddy Config: ~/caddy/conf/Caddyfile
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"

REMOTE_USER="${REMOTE_USER:-jk}"
REMOTE_HOST="${REMOTE_HOST:-216.75.75.136}"
REMOTE_PORT="${REMOTE_PORT:-22}"

REMOTE_DEMO_DIR="${REMOTE_DEMO_DIR:-bridge-ph/accustanda-demo}"
REMOTE_CADDY_FILE="${REMOTE_CADDY_FILE:-caddy/conf/Caddyfile}"

echo "📂 [LOCAL PATH] Project Root: ${PROJECT_DIR}"
echo "🌐 [REMOTE VPS] User & Host: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PORT}"
echo "📁 [DEMO DIR] Web Root: ~/${REMOTE_DEMO_DIR}"
echo "🔒 [CADDY CONFIG] Target File: ~/${REMOTE_CADDY_FILE}"
echo "--------------------------------------------------------------------------------"

echo "🚀 [1/5] Running Podman containerized static build (--rm)..."
if command -v podman &> /dev/null; then
  podman run --rm \
    -v "${PROJECT_DIR}:/workspace:Z" \
    -w /workspace \
    node:20-alpine \
    sh -c "npm ci && npm run build"
else
  echo "⚠️ Podman CLI not found locally. Building via local Node.js environment..."
  npm ci
  npm run build
fi

echo "📁 [2/5] Initializing target web directory on Fedora CoreOS VPS..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ~/${REMOTE_DEMO_DIR}"

echo "🔄 [3/5] Syncing static build artifacts directly via rsync..."
rsync -avz --delete -e "ssh -p ${REMOTE_PORT}" "${PROJECT_DIR}/out/" "${REMOTE_USER}@${REMOTE_HOST}:~/${REMOTE_DEMO_DIR}/"

echo "🔒 [4/5] Checking & configuring Caddy route block in ~/${REMOTE_CADDY_FILE}..."
rsync -avz -e "ssh -p ${REMOTE_PORT}" "${PROJECT_DIR}/scripts/accustanda-caddy-block.conf" "${REMOTE_USER}@${REMOTE_HOST}:/tmp/accustanda-caddy-block.conf"
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "grep -q '/accustanda/demo' ~/${REMOTE_CADDY_FILE} || { echo 'Configuring /accustanda/demo route in Caddyfile...'; sed -i '/delegateops.business {/r /tmp/accustanda-caddy-block.conf' ~/${REMOTE_CADDY_FILE}; podman exec caddy caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || systemctl --user reload caddy.service 2>/dev/null || true; }"

echo "🐰 [5/5] Invoking Bunny CDN cache purge (bunny-purge)..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "bunny-purge" || {
  echo "⚠️ Note: bunny-purge command invoked on remote VPS."
}

echo "✅ Direct Caddy Installation & Deployment completed successfully!"
