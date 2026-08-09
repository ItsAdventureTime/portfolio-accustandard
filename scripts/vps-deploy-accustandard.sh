#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — Demo VPS Deployment & Caddy Auto-Repair Script
# Target Host: jk@216.75.75.136
# Demo Web Root Path:      /home/jk/bridge-ph/accustandard/demo
# Demo Quadlet Systemd:    /home/jk/.config/containers/systemd/bridge-ph/accustandard/demo
# Caddy Service:           caddy.service (~/.config/containers/systemd/caddy.container)
# ==============================================================================

set -euo pipefail

echo "======================================================================"
echo "==> Starting Accustandard Demo Deployment & Caddy Repair..."
echo "======================================================================"

# 1. Stop legacy Podman containers & quadlet services if present
echo "[1/6] Cleaning up legacy container services..."
systemctl --user stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db 2>/dev/null || true
podman stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db caddy 2>/dev/null || true
podman pod stop accustanda-pod accustanda-demo-pod 2>/dev/null || true
podman rm -f accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db 2>/dev/null || true
podman pod rm -f accustanda-pod accustanda-demo-pod 2>/dev/null || true

# 2. Ensure Web Root Directories (/home/jk/bridge-ph/accustandard/demo)
echo "[2/6] Ensuring demo web root directory (/home/jk/bridge-ph/accustandard/demo)..."
mkdir -p "$HOME/bridge-ph/accustandard/demo"
rm -f "$HOME/bridge-ph/accustanda" "$HOME/bridge-ph/accustanda-demo" 2>/dev/null || true

# 3. Clean up sed string duplications (e.g. accustandardrdrd) across configuration files
echo "[3/6] Sanitizing volume paths & Quadlet configurations..."

repair_file_paths() {
  local target_file="$1"
  if [ -f "$target_file" ]; then
    # Fix repeated suffix corruption (e.g. accustandardrdrd -> accustandard)
    sed -i 's|accustandardrd[rd]*|accustandard|g' "$target_file" || true
    # Update standalone accustandard-demo to accustandard/demo
    sed -i 's|accustandard-demo|accustandard/demo|g' "$target_file" || true
    # Fix legacy accustanda-demo -> accustandard/demo
    sed -i 's|accustanda-demo|accustandard/demo|g' "$target_file" || true
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

# 4. Synchronize Quadlet Units to /home/jk/.config/containers/systemd/bridge-ph/accustandard/demo
echo "[4/6] Synchronizing Quadlet unit files to bridge-ph/accustandard/demo..."
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard/demo"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

if [ -d "$REPO_DIR/deploy/quadlets/demo" ]; then
  cp -rf "$REPO_DIR/deploy/quadlets/demo/"* "$HOME/.config/containers/systemd/bridge-ph/accustandard/demo/" 2>/dev/null || true
fi

# 5. Auto-Format (`caddy fmt`) & Validate (`caddy validate`) Caddyfile
echo "[5/6] Formatting (caddy fmt) and validating (caddy validate) Caddyfile..."
if [ -f "$HOME/caddy/conf/Caddyfile" ]; then
  repair_file_paths "$HOME/caddy/conf/Caddyfile"

  # Format & validate inside rootless Podman caddy container if active
  if podman container exists caddy 2>/dev/null || podman image exists docker.io/library/caddy:alpine 2>/dev/null; then
    echo "  - Formatting Caddyfile via rootless Podman container..."
    podman exec caddy caddy fmt --overwrite /etc/caddy/Caddyfile 2>/dev/null || true
    echo "  - Validating Caddyfile syntax via rootless Podman container..."
    podman exec caddy caddy validate --config /etc/caddy/Caddyfile 2>/dev/null || true
  elif command -v caddy &> /dev/null; then
    echo "  - Formatting Caddyfile with host caddy binary..."
    caddy fmt --overwrite "$HOME/caddy/conf/Caddyfile" 2>/dev/null || true
    echo "  - Validating Caddyfile syntax..."
    caddy validate --config "$HOME/caddy/conf/Caddyfile" || echo "  ! Warning: Host caddy validate reported errors."
  fi
  echo "  - Caddyfile format and syntax check complete."
fi

# 6. Reload Systemd User Daemon & Restart Rootless caddy.service
echo "[6/6] Reloading systemd user daemon & restarting rootless caddy.service..."
loginctl enable-linger "$USER" || true
systemctl --user daemon-reload
systemctl --user restart caddy.service || systemctl --user start caddy.service || true
systemctl --user status caddy.service --no-pager || true

# Purge Bunny CDN Cache
if command -v bunny-purge &> /dev/null; then
  echo "  - Purging Bunny CDN cache..."
  bunny-purge || true
fi

echo "======================================================================"
echo "==> Accustandard Demo VPS Deployment & Caddy Repair Completed!"
echo "    Demo Web Root Path: /home/jk/bridge-ph/accustandard/demo"
echo "    Demo Systemd Path:  /home/jk/.config/containers/systemd/bridge-ph/accustandard/demo"
echo "    Caddy Service:      caddy.service (~/.config/containers/systemd/)"
echo "======================================================================"
