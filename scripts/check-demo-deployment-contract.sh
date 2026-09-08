#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "${SCRIPT_DIR}")"
TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/accustandard-demo-contract.XXXXXX")"
trap 'rm -rf -- "${TEMP_DIR}"' EXIT

cp "${REPO_DIR}/deploy/demo/compose.yaml" "${TEMP_DIR}/compose.yaml"
mkdir -p "${TEMP_DIR}/secrets"
printf 'contract-only-secret\n' > "${TEMP_DIR}/secrets/postgres_password.txt"

CONFIG_JSON="${TEMP_DIR}/compose.json"
docker compose -f "${TEMP_DIR}/compose.yaml" config --format json > "${CONFIG_JSON}"

python3 - "${CONFIG_JSON}" <<'PY'
import json
import sys

with open(sys.argv[1], encoding="utf-8") as handle:
    config = json.load(handle)

services = config["services"]
assert set(services) == {"db", "api", "frontend"}

expected_images = {
    "db": "docker.io/library/postgres:alpine",
    "api": "accustandard-demo-api:latest",
    "frontend": "accustandard-demo-frontend:latest",
}
for name, image in expected_images.items():
    service = services[name]
    assert service.get("image") == image, (name, service.get("image"))
    for forbidden in ("ports", "build", "env_file"):
        assert forbidden not in service, (name, forbidden)

assert set(services["db"]["networks"]) == {"accustandard-network"}
assert set(services["api"]["networks"]) == {"accustandard-network"}
frontend_networks = services["frontend"]["networks"]
assert set(frontend_networks) == {"accustandard-network", "cloudflared-network"}

cloudflared = frontend_networks["cloudflared-network"]
aliases = cloudflared.get("aliases", []) if isinstance(cloudflared, dict) else []
assert aliases == ["accustandard-demo-frontend"], aliases
all_aliases = [
    alias
    for service in services.values()
    for network in service.get("networks", {}).values()
    if isinstance(network, dict)
    for alias in network.get("aliases", [])
]
assert all_aliases == ["accustandard-demo-frontend"], all_aliases

assert set(config["secrets"]) == {"postgres_password"}
assert config["secrets"]["postgres_password"]["file"].endswith(
    "/secrets/postgres_password.txt"
)
PY

printf '%s\n' 'Demo deployment contract: pass'
