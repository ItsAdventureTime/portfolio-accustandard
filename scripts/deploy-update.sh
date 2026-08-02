#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Accustanda ERP Dashboard - Incremental Update Script
# Target VPS: Fedora CoreOS (Rootless Podman Quadlets & Caddy Reverse Proxy)
# Remote Web Dir: ~/bridge-ph/accustanda-demo
# Quadlet Dir: ~/.config/containers/systemd/
# Caddy Config: ~/caddy/conf/Caddyfile
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"

REMOTE_USER="${REMOTE_USER:-jk}"
REMOTE_HOST="${REMOTE_HOST:-216.75.75.136}"
REMOTE_PORT="${REMOTE_PORT:-22}"

REMOTE_DEMO_DIR="${REMOTE_DEMO_DIR:-bridge-ph/accustanda-demo}"
REMOTE_QUADLET_DIR="${REMOTE_QUADLET_DIR:-.config/containers/systemd}"

echo "📂 [LOCAL PATH] Project Root: ${PROJECT_DIR}"
echo "🌐 [REMOTE VPS] User & Host: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PORT}"
echo "--------------------------------------------------------------------------------"

echo "⚡ [1/5] Rebuilding static export inside ephemeral Podman container..."
if command -v podman &> /dev/null; then
  podman run --rm \
    -v "${PROJECT_DIR}:/workspace:Z" \
    -w /workspace \
    node:20-alpine \
    sh -c "npm run build"
else
  echo "⚠️ Podman CLI not found locally. Building via local Node.js environment..."
  npm run build
fi

echo "🔄 [2/5] Syncing delta updates via rsync -> ~/${REMOTE_DEMO_DIR}/..."
rsync -avz --delete -e "ssh -p ${REMOTE_PORT}" "${PROJECT_DIR}/out/" "${REMOTE_USER}@${REMOTE_HOST}:~/${REMOTE_DEMO_DIR}/"

echo "⚙️ [3/5] Ensuring Podman Quadlet unit file is synced..."
rsync -avz -e "ssh -p ${REMOTE_PORT}" "${PROJECT_DIR}/scripts/accustanda-demo.container" "${REMOTE_USER}@${REMOTE_HOST}:~/${REMOTE_QUADLET_DIR}/bridge-ph-accustanda-demo.container"
rsync -avz -e "ssh -p ${REMOTE_PORT}" "${PROJECT_DIR}/scripts/accustanda-demo.container" "${REMOTE_USER}@${REMOTE_HOST}:~/${REMOTE_QUADLET_DIR}/bridge-ph/accustanda-demo.container"

echo "🔄 [4/5] Reloading Quadlet service & Caddy web server..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "systemctl --user daemon-reload && (systemctl --user restart bridge-ph-accustanda-demo.service || systemctl --user restart accustanda-demo.service || true) && (podman exec caddy caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || systemctl --user reload caddy.service 2>/dev/null || true)"

echo "🐰 [5/5] Purging Bunny CDN cache via remote bunny-purge..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "bunny-purge" || {
  echo "⚠️ Note: bunny-purge command invoked on remote VPS."
}

echo "🎉 Update completed successfully!"
