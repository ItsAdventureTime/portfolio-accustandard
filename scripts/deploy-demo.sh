#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "${SCRIPT_DIR}")"
DEPLOY_TARGET="${ACCUSTANDARD_DEPLOY_TARGET:-demo}"
case "${DEPLOY_TARGET}" in
  demo) BASE_PATH="/demo/accustandard"; QUADLET_SET="demo"; IMAGE_TAG="demo" ;;
  prod|production) DEPLOY_TARGET="prod"; BASE_PATH="/prod/accustandard"; QUADLET_SET="production"; IMAGE_TAG="production" ;;
  *) echo "ACCUSTANDARD_DEPLOY_TARGET must be demo or prod" >&2; exit 2 ;;
esac
case "${DEPLOY_TARGET}" in
  demo) REMOTE_ROOT="/home/jk/bridge-ph/accustandard-demo" ;;
  prod) REMOTE_ROOT="/home/jk/bridge-ph/accustandard" ;;
esac
REMOTE="jk@216.75.75.136"
REMOTE_RELEASE="${REMOTE_ROOT}/release/${DEPLOY_TARGET}"
LOCAL_RELEASE="${REPO_DIR}/.deploy-${DEPLOY_TARGET}-release"
SANDBOX_ROOT=""
BACKEND_IMAGE="localhost/accustandard-bridge-backend:${IMAGE_TAG}"
BACKEND_IMAGE_ARCHIVE="${LOCAL_RELEASE}/accustandard-bridge-backend-${DEPLOY_TARGET}.tar"
TARGET_PLATFORM="${ACCUSTANDARD_TARGET_PLATFORM:-linux/amd64}"
case "${LOCAL_RELEASE}" in
  "${REPO_DIR}/.deploy-demo-release"|"${REPO_DIR}/.deploy-prod-release") ;;
  *) echo "Unsafe release path: ${LOCAL_RELEASE}" >&2; exit 1 ;;
esac

cleanup_sandbox() {
  if [[ -n "${SANDBOX_ROOT}" ]]; then
    case "${SANDBOX_ROOT}" in
      /tmp/accustandard-build.*)
        jk-sbx-project exec rm -rf -- "${SANDBOX_ROOT}" >/dev/null 2>&1 || true
        echo "Sandbox cleanup complete: ${SANDBOX_ROOT}"
        ;;
    esac
  fi
}
cleanup_local_release() {
  rm -rf -- "${LOCAL_RELEASE}"
}
cleanup() {
  cleanup_sandbox
  cleanup_local_release
}
trap cleanup EXIT

for command_name in jk-sbx-project rsync ssh; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Required command is unavailable: ${command_name}" >&2
    exit 1
  fi
done

echo "==> Accustandard ${DEPLOY_TARGET} deployment build started"
rm -rf -- "${LOCAL_RELEASE}"
mkdir -p "${LOCAL_RELEASE}/web-dist" "${LOCAL_RELEASE}/quadlets"

echo "[1/5] Ensuring the Docker Sandbox is ready..."
jk-sbx-project ensure
SANDBOX_ROOT="$(jk-sbx-project exec sh -lc 'printf "SANDBOX_ROOT=%s\n" "$(mktemp -d /tmp/accustandard-build.XXXXXX)"' | sed -n 's/^SANDBOX_ROOT=//p' | tail -n 1)"
case "${SANDBOX_ROOT}" in
  /tmp/accustandard-build.*) ;;
  *) echo "Sandbox path validation failed: ${SANDBOX_ROOT}" >&2; exit 1 ;;
esac

echo "[2/5] Copying a clean checkout and building the frontend in the sandbox..."
jk-sbx-project exec env SANDBOX_ROOT="${SANDBOX_ROOT}" BASE_PATH="${BASE_PATH}" LOCAL_RELEASE="${LOCAL_RELEASE}" DEPLOY_TARGET="${DEPLOY_TARGET}" sh -lc '
  set -euo pipefail
  mkdir -p "$SANDBOX_ROOT/repo"
  rsync -a --delete --exclude=.git --exclude=node_modules --exclude=.next --exclude=out --exclude=.deploy-*-release ./ "$SANDBOX_ROOT/repo/"
  cd "$SANDBOX_ROOT/repo"
  npm ci --no-audit --no-fund
  npm run lint
  npx tsc --noEmit --incremental false
  ACCUSTANDARD_BASE_PATH="$BASE_PATH" npm run build
  test -f out/index.html
  rsync -a --delete out/ "$LOCAL_RELEASE/web-dist/"
'

echo "[3/5] Building and exporting the backend image in the sandbox..."
jk-sbx-project exec env SANDBOX_ROOT="${SANDBOX_ROOT}" TARGET_PLATFORM="${TARGET_PLATFORM}" BACKEND_IMAGE="${BACKEND_IMAGE}" BACKEND_IMAGE_ARCHIVE="${BACKEND_IMAGE_ARCHIVE}" sh -lc '
  set -euo pipefail
  cd "$SANDBOX_ROOT/repo/backend"
  go test ./...
  go vet ./...
  cd ..
  docker build --pull --provenance=false --platform "$TARGET_PLATFORM" --tag "$BACKEND_IMAGE" --file backend/Dockerfile backend
  docker save --output "$BACKEND_IMAGE_ARCHIVE" "$BACKEND_IMAGE"
'

test -f "${LOCAL_RELEASE}/web-dist/index.html"
test -s "${BACKEND_IMAGE_ARCHIVE}"
cp -f "${REPO_DIR}"/deploy/quadlets/"${QUADLET_SET}"/* "${LOCAL_RELEASE}/quadlets/"

if [[ "${ACCUSTANDARD_DEPLOY_DRY_RUN:-false}" == true ]]; then
  echo "==> Local release staging completed; skipping VPS transfer (dry run)"
  exit 0
fi

echo "[4/5] Transferring the release bundle to the VPS..."
ssh -p 22 "${REMOTE}" "mkdir -p '${REMOTE_RELEASE}' '${REMOTE_ROOT}/postgres-data'"
rsync -az --delete -e 'ssh -p 22' "${LOCAL_RELEASE}/" "${REMOTE}:${REMOTE_RELEASE}/"

echo "[5/5] Activating the prebuilt release on the VPS..."
ssh -p 22 "${REMOTE}" "RELEASE_ROOT='${REMOTE_RELEASE}' ACCUSTANDARD_DEPLOY_TARGET='${DEPLOY_TARGET}' ACCUSTANDARD_BASE_PATH='${BASE_PATH}' bash -s" < "${SCRIPT_DIR}/vps-deploy-accustandard.sh"
ssh -p 22 "${REMOTE}" "test -f '${REMOTE_ROOT}/web-dist/index.html'"
DEPLOYMENT_SUCCEEDED=true
echo "==> Accustandard ${DEPLOY_TARGET} deployment completed"
