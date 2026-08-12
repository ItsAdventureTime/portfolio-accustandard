#!/usr/bin/env bash
# Accustandard Medical ERP — remote-only demo deployment
# No local build, compilation, or application execution occurs.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
REMOTE="jk@216.75.75.136"
REMOTE_ROOT="/home/jk/bridge-ph/accustandard-demo"
REMOTE_SOURCE="${REMOTE_ROOT}/source"

echo '==> Accustandard remote-only demo deployment started'

echo '[1/3] Syncing source to the VPS...'
ssh -p 22 "${REMOTE}" "mkdir -p '${REMOTE_SOURCE}' '${REMOTE_ROOT}/web-dist' '${REMOTE_ROOT}/postgres-data'"
rsync -az --delete -e 'ssh -p 22' \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.next/' \
  --exclude 'out/' \
  --exclude '.DS_Store' \
  "${REPO_DIR}/" "${REMOTE}:${REMOTE_SOURCE}/"

echo '[2/3] Building and deploying entirely on the VPS...'
ssh -p 22 "${REMOTE}" 'bash -s' < "${SCRIPT_DIR}/vps-deploy-accustandard.sh"

echo '[3/3] Verifying the remote static artifact...'
ssh -p 22 "${REMOTE}" "test -f '${REMOTE_ROOT}/web-dist/index.html'"

echo '==> Accustandard remote-only demo deployment completed'
