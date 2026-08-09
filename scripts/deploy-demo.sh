#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — 1-Command Demo Deployment Pipeline
# Usage: ./scripts/deploy-demo.sh OR npm run deploy:demo
# Target Host: jk@216.75.75.136
# Demo Web Root Path: /home/jk/bridge-ph/accustandard-demo/
# Live Demo URL:      https://delegateops.business/accustandard/demo
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

cd "$REPO_DIR"

echo '======================================================================'
echo '==> Accustandard 1-Command Demo Deployment Started'
echo '======================================================================'

# Step 0: Ensure local Podman machine is running if installed
if command -v podman &>/dev/null && podman machine list 2>/dev/null | grep -q 'stopped'; then
  echo '[0/4] Starting local Podman machine...'
  podman machine start 2>/dev/null || true
fi

# Step 1: Run static export inside disposable Podman container
echo '[1/4] Building static export inside disposable Podman container (node:24-alpine)...'
podman run --rm \
  -v "${REPO_DIR}:/workspace:Z" \
  -v /workspace/.next \
  -v /workspace/node_modules \
  -w /workspace \
  node:24-alpine \
  sh -c 'npm install -g npm@latest && npm ci && npm run build'

if [ ! -d "${REPO_DIR}/out" ]; then
  echo '  ! Error: Export directory out/ was not generated.'
  exit 1
fi
echo '  - Static build successfully generated in out/'

# Step 2: Sync Go Backend source to VPS
echo '[2/4] Syncing Go backend source to VPS...'
ssh -p 22 jk@216.75.75.136 'mkdir -p /home/jk/bridge-ph/accustandard-demo/backend'
rsync -avz --delete -e 'ssh -p 22' \
  "${REPO_DIR}/backend/" \
  jk@216.75.75.136:/home/jk/bridge-ph/accustandard-demo/backend/

# Step 3: Run VPS Demo deployment and Caddy repair script over SSH
echo '[3/4] Executing VPS Demo deployment and Caddy repair script...'
ssh -p 22 jk@216.75.75.136 'bash -s' < "${SCRIPT_DIR}/vps-deploy-accustandard.sh"

# Step 4: RSync static build files directly to Demo Web Root
echo '[4/4] Syncing static build files to VPS Demo Web Root...'
ssh -p 22 jk@216.75.75.136 'mkdir -p /home/jk/bridge-ph/accustandard-demo/web-dist'
rsync -avz --delete -e 'ssh -p 22' \
  "${REPO_DIR}/out/" \
  jk@216.75.75.136:/home/jk/bridge-ph/accustandard-demo/web-dist/

echo '======================================================================'
echo '==> Accustandard Demo Deployment Completed Successfully!'
echo '    Live Demo Site: https://delegateops.business/accustandard/demo'
echo '======================================================================'
