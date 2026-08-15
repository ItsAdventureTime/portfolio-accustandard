#!/usr/bin/env bash
# Accustandard Medical ERP — local Docker Sandbox build + VPS artifact deployment
# The VPS receives build artifacts and activates the existing runtime services.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
REMOTE="jk@216.75.75.136"
REMOTE_ROOT="/home/jk/bridge-ph/accustandard-demo"
REMOTE_RELEASE="${REMOTE_ROOT}/release"
LOCAL_RELEASE="${REPO_DIR}/.deploy-demo-release"
BACKEND_IMAGE="localhost/accustandard-bridge-backend:demo"
BACKEND_IMAGE_ARCHIVE="${LOCAL_RELEASE}/accustandard-bridge-backend-demo.tar"
TARGET_PLATFORM="${ACCUSTANDARD_TARGET_PLATFORM:-linux/amd64}"

cleanup_local_release() {
  rm -rf -- "${LOCAL_RELEASE}"
}
trap cleanup_local_release EXIT

for command_name in jk-sbx-project rsync ssh; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Required command is unavailable: ${command_name}" >&2
    exit 1
  fi
done

echo '==> Accustandard local-build demo deployment started'

mkdir -p "${LOCAL_RELEASE}/web-dist" "${LOCAL_RELEASE}/quadlets"

echo '[1/5] Ensuring the Docker Sandbox is ready...'
jk-sbx-project ensure

echo '[2/5] Installing dependencies and building the frontend in the sandbox...'
jk-sbx-project exec npm ci --no-audit --no-fund
jk-sbx-project exec npm run lint
jk-sbx-project exec npx tsc --noEmit --incremental false
jk-sbx-project exec npm run build
jk-sbx-project exec sh -lc 'cd backend && go test ./...'
jk-sbx-project exec sh -lc 'cd backend && go vet ./...'
test -f "${REPO_DIR}/out/index.html"
rsync -a --delete "${REPO_DIR}/out/" "${LOCAL_RELEASE}/web-dist/"

echo '[3/5] Building and exporting the backend image in the sandbox...'
jk-sbx-project exec docker build --pull --provenance=false \
  --platform "${TARGET_PLATFORM}" \
  --tag "${BACKEND_IMAGE}" \
  --file backend/Dockerfile backend
jk-sbx-project exec docker save --output \
  ".deploy-demo-release/accustandard-bridge-backend-demo.tar" \
  "${BACKEND_IMAGE}"
test -s "${BACKEND_IMAGE_ARCHIVE}"
cp -f "${REPO_DIR}"/deploy/quadlets/demo/* "${LOCAL_RELEASE}/quadlets/"

if [[ "${ACCUSTANDARD_DEPLOY_DRY_RUN:-false}" == true ]]; then
  echo '==> Local release staging completed; skipping VPS transfer (dry run)'
  exit 0
fi

echo '[4/5] Transferring the release bundle to the VPS...'
ssh -p 22 "${REMOTE}" \
  "mkdir -p '${REMOTE_RELEASE}' '${REMOTE_ROOT}/web-dist' '${REMOTE_ROOT}/postgres-data'"
rsync -az --delete -e 'ssh -p 22' \
  "${LOCAL_RELEASE}/" "${REMOTE}:${REMOTE_RELEASE}/"

echo '[5/5] Activating the prebuilt release on the VPS...'
ssh -p 22 "${REMOTE}" \
  "RELEASE_ROOT='${REMOTE_RELEASE}' bash -s" \
  < "${SCRIPT_DIR}/vps-deploy-accustandard.sh"

echo '    Verifying the remote static artifact...'
ssh -p 22 "${REMOTE}" "test -f '${REMOTE_ROOT}/web-dist/index.html'"

echo '==> Accustandard local-build demo deployment completed'
