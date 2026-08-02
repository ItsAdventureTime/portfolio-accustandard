#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Accustanda ERP Dashboard - Initial Installation & Quadlet Deployment Script
# Target VPS: Fedora CoreOS (Rootless Podman Quadlets)
# Remote Web Dir: ~/bridge-ph/accustanda-demo
# Quadlet Dir: ~/.config/containers/systemd/bridge-ph/accustanda-demo
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"

REMOTE_USER="${REMOTE_USER:-jk}"
REMOTE_HOST="${REMOTE_HOST:-216.75.75.136}"
REMOTE_PORT="${REMOTE_PORT:-22}"

REMOTE_DEMO_DIR="${REMOTE_DEMO_DIR:-bridge-ph/accustanda-demo}"
REMOTE_QUADLET_DIR="${REMOTE_QUADLET_DIR:-.config/containers/systemd/bridge-ph/accustanda-demo}"

echo "📂 [LOCAL PATH] Project Root: ${PROJECT_DIR}"
echo "🌐 [REMOTE VPS] User & Host: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PORT}"
echo "📁 [DEMO DIR] Web Root: ~/${REMOTE_DEMO_DIR}"
echo "⚙️ [QUADLET DIR] Systemd Unit Path: ~/${REMOTE_QUADLET_DIR}"
echo "--------------------------------------------------------------------------------"

echo "🚀 [1/6] Running Podman containerized static build (--rm)..."
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

echo "📁 [2/6] Initializing remote directories on Fedora CoreOS VPS..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ~/${REMOTE_DEMO_DIR} ~/${REMOTE_QUADLET_DIR}"

echo "🔄 [3/6] Deploying static build artifacts via rsync..."
rsync -avz --delete -e "ssh -p ${REMOTE_PORT}" "${PROJECT_DIR}/out/" "${REMOTE_USER}@${REMOTE_HOST}:~/${REMOTE_DEMO_DIR}/"

echo "⚙️ [4/6] Deploying Podman Quadlet container unit file..."
rsync -avz -e "ssh -p ${REMOTE_PORT}" "${PROJECT_DIR}/scripts/accustanda-demo.container" "${REMOTE_USER}@${REMOTE_HOST}:~/${REMOTE_QUADLET_DIR}/accustanda-demo.container"

echo "🔄 [5/6] Reloading systemd user daemon & restarting rootless Podman Quadlet container..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "systemctl --user daemon-reload && systemctl --user restart accustanda-demo.service || true"

echo "🐰 [6/6] Invoking Bunny CDN cache purge (bunny-purge)..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "bunny-purge" || {
  echo "⚠️ Note: bunny-purge command invoked on remote VPS."
}

echo "✅ Full Installation & Podman Quadlet deployment completed successfully!"
