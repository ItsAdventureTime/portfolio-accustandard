#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Accustanda ERP Dashboard - Initial Installation & Deployment Script
# Automatically resolves project directory and deploys to target VPS directory.
# ==============================================================================

# 1. Automatically resolve local project root directory regardless of current working directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "📂 [LOCAL PATH] Navigating to project root: ${PROJECT_DIR}"
cd "${PROJECT_DIR}"

# 2. Configurable Target Server Parameters (Overrideable via environment variables)
REMOTE_USER="${REMOTE_USER:-jk}"
REMOTE_HOST="${REMOTE_HOST:-216.75.75.136}"
REMOTE_PORT="${REMOTE_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/accustanda-bridge}"

echo "🌐 [REMOTE DESTINATION] Server Target: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PORT}"
echo "📁 [REMOTE DIRECTORY] Deployment Path: ${REMOTE_DIR}"
echo "--------------------------------------------------------------------------------"

echo "🚀 [1/5] Starting Podman containerized static export build..."
if command -v podman &> /dev/null; then
  echo "📦 Running Podman container (node:20-alpine) with automatic removal (--rm)..."
  podman run --rm \
    -v "${PROJECT_DIR}:/workspace:Z" \
    -w /workspace \
    node:20-alpine \
    sh -c "npm ci && npm run build"
else
  echo "⚠️ Podman CLI not found on host system. Building via local Node.js environment..."
  npm ci
  npm run build
fi

echo "📁 [2/5] Creating target remote directory on VPS: ${REMOTE_DIR}"
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ${REMOTE_DIR}"

echo "🔄 [3/5] Syncing local static build (${PROJECT_DIR}/out/) -> remote (${REMOTE_DIR}/) via rsync..."
rsync -avz --delete -e "ssh -p ${REMOTE_PORT}" "${PROJECT_DIR}/out/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

echo "🐰 [4/5] Calling remote Bunny CDN cache purge (bunny-purge)..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "bunny-purge" || {
  echo "⚠️ Note: bunny-purge command invoked on VPS."
}

echo "✅ [5/5] Installation complete! Files deployed to: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"
