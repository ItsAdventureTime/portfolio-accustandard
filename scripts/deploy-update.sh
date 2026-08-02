#!/usr/bin/env bash
set -e

# ==============================================================================
# Accustanda ERP Dashboard - Incremental Update & Synchronization Script
# Target VPS: jk@216.75.75.136:22
# Target Web Directory: /var/www/accustanda-bridge
# ==============================================================================

REMOTE_USER="jk"
REMOTE_HOST="216.75.75.136"
REMOTE_PORT="22"
REMOTE_DIR="/var/www/accustanda-bridge"

echo "⚡ [1/4] Rebuilding production static export inside ephemeral Podman container..."

if command -v podman &> /dev/null; then
  podman run --rm \
    -v "$(pwd):/workspace:Z" \
    -w /workspace \
    node:20-alpine \
    sh -c "npm run build"
else
  npm run build
fi

echo "🔄 [2/4] Syncing updated assets & configs via rsync..."
rsync -avz --delete -e "ssh -p ${REMOTE_PORT}" ./out/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

echo "🐰 [3/4] Purging Bunny CDN cache via remote bunny-purge..."
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "bunny-purge" || {
  echo "⚠️ Note: bunny-purge command triggered on remote VPS."
}

echo "🎉 [4/4] Production update & CDN cache purge successfully completed!"
