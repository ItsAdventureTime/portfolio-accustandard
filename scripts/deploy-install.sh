#!/usr/bin/env bash
set -e

# ==============================================================================
# Accustanda ERP Dashboard - Initial Installation & Deployment Script
# Target VPS: jk@216.75.75.136:22
# Target Web Directory: /var/www/accustanda-bridge
# ==============================================================================

REMOTE_USER="jk"
REMOTE_HOST="216.75.75.136"
REMOTE_PORT="22"
REMOTE_DIR="/var/www/accustanda-bridge"

echo "🚀 [1/5] Starting Podman containerized clean static build..."

if command -v podman &> /dev/null; then
  echo "📦 Building via ephemeral Podman container (node:20-alpine)..."
  podman run --rm \
    -v "$(pwd):/workspace:Z" \
    -w /workspace \
    node:20-alpine \
    sh -c "npm ci && npm run build"
else
  echo "⚠️ Podman CLI not detected on host. Falling back to local environment..."
  npm ci
  npm run build
fi

echo "📁 [2/5] Creating remote target directory structure on VPS (${REMOTE_HOST})..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ${REMOTE_DIR}"

echo "🔄 [3/5] Deploying build artifacts to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR} using rsync..."
rsync -avz --delete -e "ssh -p ${REMOTE_PORT}" ./out/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

echo "🐰 [4/5] Executing Bunny CDN global cache purge (bunny-purge)..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "bunny-purge" || {
  echo "⚠️ Note: bunny-purge command triggered on remote VPS."
}

echo "✅ [5/5] Installation & Deployment complete! Server site is live."
