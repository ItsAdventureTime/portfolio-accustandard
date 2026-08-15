#!/usr/bin/env bash
# Accustandard Medical ERP — VPS artifact activation and Quadlet deployment
# This script intentionally does not compile or build on the VPS.

set -euo pipefail

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

DEMO_ROOT="${HOME}/bridge-ph/accustandard-demo"
RELEASE_ROOT="${RELEASE_ROOT:-${DEMO_ROOT}/release}"
DEMO_QUADLET_DIR="${HOME}/.config/containers/systemd/bridge-ph/accustandard-demo"
POSTGRES_DATA_DIR="${DEMO_ROOT}/postgres-data"
BACKEND_IMAGE_ARCHIVE="${RELEASE_ROOT}/accustandard-bridge-backend-demo.tar"

stop_demo_services() {
  local service
  for service in \
    accustandard-demo-app.service \
    accustandard-demo-db.service \
    accustandard-demo-pod-pod.service; do
    if systemctl --user is-active --quiet "${service}" 2>/dev/null; then
      if ! systemctl --user stop "${service}"; then
        echo "Failed to stop active demo service: ${service}" >&2
        return 1
      fi
    fi
  done
}

reset_demo_database_if_needed() {
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
  local readiness_url='http://127.0.0.1:8080/accustandard/demo/api/v1/readiness'

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
  systemctl --user status accustandard-demo-app.service --no-pager -l >&2 || true
  journalctl --user -u accustandard-demo-app.service -n 100 --no-pager >&2 || true
  return 1
}

cleanup_release_after_success() {
  if [[ "${DEPLOYMENT_SUCCEEDED:-false}" == true ]]; then
    rm -rf -- "${RELEASE_ROOT}"
  fi
}
trap cleanup_release_after_success EXIT

echo '[1/5] Verifying the transferred release bundle...'
mkdir -p "${DEMO_ROOT}/web-dist" "${POSTGRES_DATA_DIR}" "${DEMO_QUADLET_DIR}"
test -s "${BACKEND_IMAGE_ARCHIVE}"
test -f "${RELEASE_ROOT}/web-dist/index.html"
test -f "${RELEASE_ROOT}/quadlets/accustandard-demo-app.container"
test -f "${RELEASE_ROOT}/quadlets/accustandard-demo-db.container"
test -f "${RELEASE_ROOT}/quadlets/accustandard-demo-pod.pod"

stop_demo_services

echo '[2/5] Loading the prebuilt backend image...'
podman load --input "${BACKEND_IMAGE_ARCHIVE}"
podman image inspect localhost/accustandard-bridge-backend:demo >/dev/null
reset_demo_database_if_needed

echo '[3/5] Installing the transferred demo Quadlets...'
cp -f "${RELEASE_ROOT}/quadlets/"* "${DEMO_QUADLET_DIR}/"

echo '[4/5] Publishing the transferred static export...'
rsync -a --delete "${RELEASE_ROOT}/web-dist/" "${DEMO_ROOT}/web-dist/"

echo '[5/5] Starting the demo database and API services...'
loginctl enable-linger "${USER}" 2>/dev/null || true
stop_demo_services
systemctl --user daemon-reload
systemctl --user reset-failed accustandard-demo-db.service accustandard-demo-app.service 2>/dev/null || true
if ! systemctl --user restart accustandard-demo-db.service; then
  echo 'PostgreSQL Quadlet failed. Full unit diagnostics:' >&2
  systemctl --user status accustandard-demo-db.service --no-pager -l >&2 || true
  journalctl --user -u accustandard-demo-db.service -n 100 --no-pager >&2 || true
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

if ! systemctl --user restart accustandard-demo-app.service; then
  echo 'AccuStandard API Quadlet failed. Full unit diagnostics:' >&2
  systemctl --user status accustandard-demo-app.service --no-pager -l >&2 || true
  journalctl --user -u accustandard-demo-app.service -n 100 --no-pager >&2 || true
  exit 1
fi
systemctl --user is-active --quiet accustandard-demo-db.service
systemctl --user is-active --quiet accustandard-demo-app.service
wait_for_api_readiness

DEPLOYMENT_SUCCEEDED=true
echo '==> VPS artifact deployment and Quadlet activation completed'
