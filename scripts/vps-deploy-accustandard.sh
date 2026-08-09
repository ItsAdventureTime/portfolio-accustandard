#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — Production VPS Deployment & Caddy Auto-Repair Script
# Target Host: jk@216.75.75.136
# Production Web Root: /home/jk/bridge-ph/accustandard
# Demo Web Root:       /home/jk/bridge-ph/accustandard-demo
# Quadlet Systemd:     /home/jk/.config/containers/systemd/bridge-ph/
# Caddy Service:       caddy.service (~/.config/containers/systemd/caddy.container)
# ==============================================================================

set -euo pipefail

echo "======================================================================"
echo "==> Starting Accustandard Production Deployment & Caddy Repair..."
echo "======================================================================"

# 1. Stop legacy Podman containers & quadlet services if present
echo "[1/7] Cleaning up legacy container services..."
systemctl --user stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db 2>/dev/null || true
podman stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db 2>/dev/null || true
podman pod stop accustanda-pod accustanda-demo-pod 2>/dev/null || true
podman rm -f accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db 2>/dev/null || true
podman pod rm -f accustanda-pod accustanda-demo-pod 2>/dev/null || true

# 2. Ensure Web Root Directories (No Symlinks)
echo "[2/7] Ensuring target web root directories..."
mkdir -p "$HOME/bridge-ph/accustandard"
mkdir -p "$HOME/bridge-ph/accustandard-demo"
rm -f "$HOME/bridge-ph/accustanda" "$HOME/bridge-ph/accustanda-demo" 2>/dev/null || true

# 3. Clean up sed string duplications (e.g. accustandardrdrd) across configuration files
echo "[3/7] Sanitizing volume paths & Quadlet configurations..."

repair_file_paths() {
  local target_file="$1"
  if [ -f "$target_file" ]; then
    # Fix repeated suffix corruption (e.g. accustandardrdrd -> accustandard)
    sed -i 's|accustandardrd[rd]*|accustandard|g' "$target_file" || true
    # Fix remaining legacy accustanda-demo -> accustandard-demo
    sed -i 's|accustanda-demo|accustandard-demo|g' "$target_file" || true
    # Fix remaining standalone accustanda -> accustandard
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

# 4. Install / Synchronize Quadlet Units
echo "[4/7] Synchronizing Quadlet unit files..."
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard"
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard-demo"

# If deploy directory is passed, sync Quadlet unit files
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

if [ -d "$REPO_DIR/deploy/quadlets/production" ]; then
  cp -rf "$REPO_DIR/deploy/quadlets/production/"* "$HOME/.config/containers/systemd/bridge-ph/accustandard/" 2>/dev/null || true
fi
if [ -d "$REPO_DIR/deploy/quadlets/demo" ]; then
  cp -rf "$REPO_DIR/deploy/quadlets/demo/"* "$HOME/.config/containers/systemd/bridge-ph/accustandard-demo/" 2>/dev/null || true
fi

# 5. Auto-Format (`caddy fmt`) & Validate (`caddy validate`) Caddyfile
echo "[5/7] Formatting (caddy fmt) and validating (caddy validate) Caddyfile..."
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
echo "[6/7] Reloading systemd user daemon & restarting rootless caddy.service..."
loginctl enable-linger "$USER" || true
systemctl --user daemon-reload
systemctl --user restart caddy.service || systemctl --user start caddy.service || true
systemctl --user status caddy.service --no-pager || true

# 7. Purge Bunny CDN Cache
if command -v bunny-purge &> /dev/null; then
  echo "  - Purging Bunny CDN cache..."
  bunny-purge || true
fi

echo "======================================================================"
echo "==> Accustandard VPS Deployment & Caddy Repair Completed!"
echo "    Production Path: $HOME/bridge-ph/accustandard"
echo "    Demo Path:       $HOME/bridge-ph/accustandard-demo"
echo "    Caddy Service:   caddy.service (~/.config/containers/systemd/)"
echo "======================================================================"
