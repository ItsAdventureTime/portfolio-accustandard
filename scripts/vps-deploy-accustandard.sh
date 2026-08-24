#!/usr/bin/env bash
# Accustandard Medical ERP — VPS artifact activation and Quadlet deployment
# This script intentionally does not compile or build on the VPS.

set -euo pipefail

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

DEPLOY_TARGET="${ACCUSTANDARD_DEPLOY_TARGET:-demo}"
BASE_PATH="${ACCUSTANDARD_BASE_PATH:-}"
case "${DEPLOY_TARGET}" in
  demo)
    APP_ROOT="/srv/bridge-ph-accustandard-demo"
    QUADLET_DIR="${HOME}/.config/containers/systemd/bridge-ph/accustandard-demo"
    QUADLET_APP="accustandard-demo-app.container"
    QUADLET_DB="accustandard-demo-db.container"
    QUADLET_POD="accustandard-demo-pod.pod"
    APP_SERVICE="accustandard-demo-app.service"
    DB_SERVICE="accustandard-demo-db.service"
    POD_SERVICE="accustandard-demo-pod-pod.service"
    API_PORT=8080
    IMAGE_TAG=demo
    BASE_PATH="${BASE_PATH:-/demo/accustandard}"
    RESET_DATABASE=true
    ;;
  prod|production)
    DEPLOY_TARGET=prod
    APP_ROOT="/srv/bridge-ph-accustandard-prod"
    QUADLET_DIR="${HOME}/.config/containers/systemd/bridge-ph/accustandard"
    QUADLET_APP="accustandard-app.container"
    QUADLET_DB="accustandard-db.container"
    QUADLET_POD="accustandard-pod.pod"
    APP_SERVICE="accustandard-app.service"
    DB_SERVICE="accustandard-db.service"
    POD_SERVICE="accustandard-pod-pod.service"
    API_PORT=3000
    IMAGE_TAG=production
    BASE_PATH="${BASE_PATH:-/prod/accustandard}"
    RESET_DATABASE=false
    ;;
  *)
    echo "ACCUSTANDARD_DEPLOY_TARGET must be demo or production" >&2
    exit 2
    ;;
esac
export ACCUSTANDARD_BASE_PATH="${BASE_PATH}"

RELEASE_ROOT="${RELEASE_ROOT:-${APP_ROOT}/release}"
POSTGRES_DATA_DIR="${APP_ROOT}/postgres-data"
BACKEND_IMAGE_ARCHIVE="${RELEASE_ROOT}/accustandard-bridge-backend-${DEPLOY_TARGET}.tar"

stop_demo_services() {
  local service
  for service in \
    ${APP_SERVICE} \
    ${DB_SERVICE} \
    ${POD_SERVICE}; do
    if systemctl --user is-active --quiet "${service}" 2>/dev/null; then
      if ! systemctl --user stop "${service}"; then
        echo "Failed to stop active demo service: ${service}" >&2
        return 1
      fi
    fi
  done
}

reset_demo_database_if_needed() {
  if [[ "${RESET_DATABASE}" != true ]]; then
    echo "Preserving ${DEPLOY_TARGET} PostgreSQL data."
    return 0
  fi
  local data_state
  data_state="$(podman unshare sh -c '
    set -eu
    data=$1
    if [ -f "$data/PG_VERSION" ]; then
      IFS= read -r major < "$data/PG_VERSION" || true
      printf '%s' "version:$major"
    elif [ -n "$(find "$data" -mindepth 1 -maxdepth 1 -print -quit)" ]; then
      printf '%s' invalid
    else
      printf '%s' empty
    fi
  ' sh "${POSTGRES_DATA_DIR}")"

  case "${data_state}" in
    version:17)
      return 0
      ;;
    version:*)
      echo "Removing legacy PostgreSQL ${data_state#version:} demo data; initializing PostgreSQL 17..."
      ;;
    invalid)
      echo 'Removing incomplete demo PostgreSQL data with no PG_VERSION; initializing PostgreSQL 17...'
      ;;
    empty)
      return 0
      ;;
    *)
      echo "Could not inspect demo PostgreSQL data state: ${data_state}" >&2
      return 1
      ;;
  esac

  # This path is disposable demo state. Never apply this reset policy to a
  # production database or a data directory whose contents must be preserved.
  podman unshare sh -c '
    set -eu
    data=$1
    find "$data" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
  ' sh "${POSTGRES_DATA_DIR}"
}

assert_postgres_17() {
  local server_version
  server_version="$(podman exec accustandard-demo-db \
    psql -U accustandard -d accustandard_demo_db -Atqc 'SHOW server_version_num')"
  if [[ "${server_version}" != 17* ]]; then
    echo "Expected PostgreSQL 17, got server_version_num=${server_version}" >&2
    return 1
  fi
}

wait_for_api_readiness() {
  local readiness_url="http://127.0.0.1:${API_PORT}${BASE_PATH}/api/v1/readiness"

  echo '    Waiting for API readiness (up to 60 seconds)...'
  # The Go process can reset this idempotent GET while binding its listener.
  # Keep expected retry noise out of the release log; the explicit timeout
  # diagnostics below remain the failure signal when readiness is exhausted.
  if curl --fail --silent \
    --retry 30 --retry-delay 2 --retry-max-time 60 --retry-all-errors \
    --connect-timeout 2 --max-time 5 \
    "${readiness_url}" >/dev/null; then
    return 0
  fi

  echo 'AccuStandard API did not become ready within 60 seconds.' >&2
  echo 'Full API unit diagnostics:' >&2
  systemctl --user status ${APP_SERVICE} --no-pager -l >&2 || true
  journalctl --user -u ${APP_SERVICE} -n 100 --no-pager >&2 || true
  return 1
}

cleanup_release_after_success() {
  if [[ "${DEPLOYMENT_SUCCEEDED:-false}" == true ]]; then
    rm -rf -- "${RELEASE_ROOT}"
  fi
}
trap cleanup_release_after_success EXIT

echo '[1/5] Verifying the transferred release bundle...'
mkdir -p "${APP_ROOT}/web-dist" "${POSTGRES_DATA_DIR}" "${QUADLET_DIR}"
test -s "${BACKEND_IMAGE_ARCHIVE}"
test -f "${RELEASE_ROOT}/web-dist/index.html"
test -f "${RELEASE_ROOT}/quadlets/${QUADLET_APP}"
test -f "${RELEASE_ROOT}/quadlets/${QUADLET_DB}"
test -f "${RELEASE_ROOT}/quadlets/${QUADLET_POD}"

stop_demo_services

echo '[2/5] Loading the prebuilt backend image...'
podman load --input "${BACKEND_IMAGE_ARCHIVE}"
podman image inspect localhost/accustandard-bridge-backend:${IMAGE_TAG} >/dev/null
reset_demo_database_if_needed

echo '[3/5] Installing the transferred demo Quadlets...'
cp -f "${RELEASE_ROOT}/quadlets/"* "${QUADLET_DIR}/"
APP_QUADLET="${QUADLET_DIR}/${QUADLET_APP}"
if grep -q '^Environment=ACCUSTANDARD_BASE_PATH=' "${APP_QUADLET}"; then
  sed -i "s#^Environment=ACCUSTANDARD_BASE_PATH=.*#Environment=ACCUSTANDARD_BASE_PATH=${BASE_PATH}#" "${APP_QUADLET}"
else
  sed -i "/^\\[Container\\]/a Environment=ACCUSTANDARD_BASE_PATH=${BASE_PATH}" "${APP_QUADLET}"
fi
if [[ "${DEPLOY_TARGET}" == demo && -f "${RELEASE_ROOT}/accustandard-demo.handlers.Caddyfile" ]]; then
  CADDY_HANDLER_PATH="${CADDY_HANDLER_PATH:-/etc/caddy/accustandard-demo.handlers.Caddyfile}"
  CADDY_HANDLER_DIR="$(dirname "${CADDY_HANDLER_PATH}")"
  if [[ -w "${CADDY_HANDLER_DIR}" ]]; then
    install -m 0644 "${RELEASE_ROOT}/accustandard-demo.handlers.Caddyfile" "${CADDY_HANDLER_PATH}"
  elif command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
    sudo install -m 0644 "${RELEASE_ROOT}/accustandard-demo.handlers.Caddyfile" "${CADDY_HANDLER_PATH}"
  else
    echo "Caddy handler not installed; configure ${CADDY_HANDLER_PATH} with appropriate privileges." >&2
  fi
fi

echo '[4/5] Publishing the transferred static export...'
rsync -a --delete "${RELEASE_ROOT}/web-dist/" "${APP_ROOT}/web-dist/"

echo '[5/5] Starting the demo database and API services...'
loginctl enable-linger "${USER}" 2>/dev/null || true
stop_demo_services
systemctl --user daemon-reload
systemctl --user reset-failed ${DB_SERVICE} ${APP_SERVICE} 2>/dev/null || true
if ! systemctl --user restart ${DB_SERVICE}; then
  echo 'PostgreSQL Quadlet failed. Full unit diagnostics:' >&2
  systemctl --user status ${DB_SERVICE} --no-pager -l >&2 || true
  journalctl --user -u ${DB_SERVICE} -n 100 --no-pager >&2 || true
  exit 1
fi

echo '    Waiting for PostgreSQL readiness...'
for attempt in $(seq 1 30); do
  if podman exec accustandard-demo-db pg_isready -U accustandard -d accustandard_demo_db >/dev/null 2>&1; then
    break
  fi
  if [ "${attempt}" -eq 30 ]; then
    echo 'PostgreSQL did not become ready within 60 seconds.' >&2
    exit 1
  fi
  sleep 2
done
assert_postgres_17

if ! systemctl --user restart ${APP_SERVICE}; then
  echo 'AccuStandard API Quadlet failed. Full unit diagnostics:' >&2
  systemctl --user status ${APP_SERVICE} --no-pager -l >&2 || true
  journalctl --user -u ${APP_SERVICE} -n 100 --no-pager >&2 || true
  exit 1
fi
systemctl --user is-active --quiet ${DB_SERVICE}
systemctl --user is-active --quiet ${APP_SERVICE}
wait_for_api_readiness

DEPLOYMENT_SUCCEEDED=true
echo '==> VPS artifact deployment and Quadlet activation completed'
