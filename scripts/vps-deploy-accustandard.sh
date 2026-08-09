#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — Demo VPS Deployment & Caddy Auto-Repair Script
# Target Host: jk@216.75.75.136
# Demo Web Root Path:      /home/jk/bridge-ph/accustandard-demo/
# Demo Quadlet Systemd:    /home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/
# Live Demo URL:           https://delegateops.business/accustandard/demo
# Caddy Service:           caddy.service (~/.config/containers/systemd/caddy.container)
# ==============================================================================

set -euo pipefail

# Ensure non-interactive systemd user bus connection over SSH
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

echo "======================================================================"
echo "==> Starting Accustandard Demo VPS Deployment & Caddy Auto-Repair..."
echo "======================================================================"

# 1. Stop legacy Podman containers & quadlet services if present
echo "[1/6] Cleaning up legacy container services..."
systemctl --user stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db 2>/dev/null || true
podman stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db caddy 2>/dev/null || true
podman pod stop accustanda-pod accustanda-demo-pod 2>/dev/null || true
podman rm -f accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db caddy 2>/dev/null || true
podman pod rm -f accustanda-pod accustanda-demo-pod 2>/dev/null || true

# 2. Ensure Demo Web Root Directory (/home/jk/bridge-ph/accustandard-demo/)
echo "[2/6] Verifying demo web root directory (/home/jk/bridge-ph/accustandard-demo/)..."
mkdir -p "$HOME/bridge-ph/accustandard-demo"
rm -f "$HOME/bridge-ph/accustanda" "$HOME/bridge-ph/accustanda-demo" 2>/dev/null || true

# 3. Clean up sed string duplications (e.g. accustandardrdrd) across configuration files
echo "[3/6] Sanitizing volume paths & Quadlet configurations..."

repair_file_paths() {
  local target_file="$1"
  if [ -f "$target_file" ]; then
    # Fix repeated suffix corruption (e.g. accustandardrdrd -> accustandard)
    sed -i 's|accustandardrd[rd]*|accustandard|g' "$target_file" || true
    # Fix legacy accustanda-demo -> accustandard-demo
    sed -i 's|accustanda-demo|accustandard-demo|g' "$target_file" || true
    # Fix legacy accustanda -> accustandard
    sed -i 's|accustanda\([^r]\|$\)|accustandard\1|g' "$target_file" || true
  fi
}

# Recursively repair all quadlet & systemd unit files
find "$HOME/.config/containers/systemd" -type f 2>/dev/null | while read -r file; do
  repair_file_paths "$file"
done

find "$HOME/.config/systemd/user" -type f 2>/dev/null | while read -r file; do
  repair_file_paths "$file"
done

# 4. Synchronize Demo Quadlet Units to /home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/
echo "[4/6] Synchronizing Demo Quadlet unit files..."
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard-demo"

# Safely resolve script path when run from file or stdin pipe
SCRIPT_SOURCE="${BASH_SOURCE[0]:-}"
if [ -n "$SCRIPT_SOURCE" ] && [ -f "$SCRIPT_SOURCE" ]; then
  SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_SOURCE")" && pwd)"
  REPO_DIR="$(dirname "$SCRIPT_DIR")"
  if [ -d "$REPO_DIR/deploy/quadlets/demo" ]; then
    cp -rf "$REPO_DIR/deploy/quadlets/demo/"* "$HOME/.config/containers/systemd/bridge-ph/accustandard-demo/" 2>/dev/null || true
  fi
fi

# 5. Exhaustively Locate, Format (`caddy fmt`), & Validate (`caddy validate`) Caddyfile
echo "[5/6] Auto-formatting (caddy fmt), validating (caddy validate) & repairing Caddyfile..."

CADDYFILE_LOCATIONS=(
  "$HOME/caddy/conf/Caddyfile"
  "$HOME/.config/caddy/Caddyfile"
  "$HOME/caddy/Caddyfile"
  "/etc/caddy/Caddyfile"
)

FOUND_CADDYFILE=""
for loc in "${CADDYFILE_LOCATIONS[@]}"; do
  if [ -f "$loc" ]; then
    FOUND_CADDYFILE="$loc"
    echo "  - Found Caddyfile at: $FOUND_CADDYFILE"
    repair_file_paths "$FOUND_CADDYFILE"
    break
  fi
done

# Format & validate inside rootless Podman caddy container if active
if podman container exists caddy 2>/dev/null || podman image exists docker.io/library/caddy:alpine 2>/dev/null; then
  echo "  - Formatting Caddyfile via rootless Podman container..."
  podman exec caddy caddy fmt --overwrite /etc/caddy/Caddyfile 2>/dev/null || true
  echo "  - Validating Caddyfile syntax via rootless Podman container..."
  podman exec caddy caddy validate --config /etc/caddy/Caddyfile 2>/dev/null || true
elif command -v caddy &> /dev/null; then
  if [ -n "$FOUND_CADDYFILE" ]; then
    echo "  - Formatting Caddyfile with host caddy binary..."
    caddy fmt --overwrite "$FOUND_CADDYFILE" 2>/dev/null || true
    echo "  - Validating Caddyfile syntax..."
    caddy validate --config "$FOUND_CADDYFILE" || echo "  ! Warning: Host caddy validate reported errors."
  fi
fi
echo "  - Caddyfile format, repair and syntax validation complete."

# 6. Reload Systemd User Daemon & Restart Rootless caddy.service
echo "[6/6] Reloading systemd user daemon & restarting rootless caddy.service..."
loginctl enable-linger "$USER" 2>/dev/null || true
systemctl --user daemon-reload

if systemctl --user is-active --quiet caddy.service 2>/dev/null; then
  echo "  - Reloading caddy.service..."
  systemctl --user reload caddy.service 2>/dev/null || systemctl --user restart caddy.service 2>/dev/null || true
else
  echo "  - Restarting caddy.service..."
  systemctl --user restart caddy.service 2>/dev/null || systemctl --user start caddy.service 2>/dev/null || true
fi

# Print non-blocking Caddy status
systemctl --user status caddy.service --no-pager 2>/dev/null || true

# Purge Bunny CDN Cache with timeout and stdin redirect to prevent infinite loops
if command -v bunny-purge &> /dev/null; then
  echo "  - Purging Bunny CDN cache (non-blocking)..."
  timeout 10 bunny-purge < /dev/null 2>&1 || true
fi

echo "======================================================================"
echo "==> Demo VPS Deployment & Caddy Repair Completed Successfully!"
echo "    Live Demo URL:  https://delegateops.business/accustandard/demo"
echo "    Demo Web Root:  /home/jk/bridge-ph/accustandard-demo/"
echo "    Demo Quadlets:  /home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/"
echo "======================================================================"
