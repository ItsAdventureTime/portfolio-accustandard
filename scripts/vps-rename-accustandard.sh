#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — Clean Quadlet & Caddy Repair Script
# Fixes repeated sed corruption (e.g. accustandardrdrd) & restores Caddy service
# Target Host: jk@216.75.75.136
# ==============================================================================

set -euo pipefail

echo "======================================================================"
echo "==> Starting Accustandard Caddy & Quadlet Configuration Repair..."
echo "======================================================================"

# 1. Stop legacy Podman containers & quadlet services
echo "[1/6] Stopping containers and services..."
systemctl --user stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db caddy.service || true
podman stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db caddy || true
podman pod stop accustanda-pod accustanda-demo-pod || true
podman rm -f accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db caddy || true
podman pod rm -f accustanda-pod accustanda-demo-pod || true

# 2. Ensure Web Root Directories
echo "[2/6] Verifying web root directories..."
mkdir -p "$HOME/bridge-ph/accustandard"
mkdir -p "$HOME/bridge-ph/accustandard-demo"
rm -f "$HOME/bridge-ph/accustanda" "$HOME/bridge-ph/accustanda-demo" 2>/dev/null || true

# 3. Clean up sed-corrupted strings (accustandardrdrd, accustandardrd) across all systemd files
echo "[3/6] Cleaning up quadlet configuration files & correcting volume paths..."

# Helper function to perform idempotent replacement without suffix concatenation
repair_file_paths() {
  local target_file="$1"
  if [ -f "$target_file" ]; then
    # Fix repeated suffix corruption (e.g. accustandardrdrd -> accustandard)
    sed -i 's|accustandardrd[rd]*|accustandard|g' "$target_file" || true
    # Fix remaining legacy accustanda-demo -> accustandard-demo
    sed -i 's|accustanda-demo|accustandard-demo|g' "$target_file" || true
    # Fix remaining standalone accustanda -> accustandard (matching non-alphanumeric boundary)
    sed -i 's|accustanda\([^r]\|$\)|accustandard\1|g' "$target_file" || true
  fi
}

# Recursively fix all quadlet & systemd unit files
find "$HOME/.config/containers/systemd" -type f | while read -r file; do
  repair_file_paths "$file"
done

find "$HOME/.config/systemd/user" -type f | while read -r file; do
  repair_file_paths "$file"
done

# Fix Caddyfile if present
if [ -f "$HOME/caddy/conf/Caddyfile" ]; then
  repair_file_paths "$HOME/caddy/conf/Caddyfile"
fi

# 4. Update Caddy container definition directly if caddy.container exists
if [ -f "$HOME/.config/containers/systemd/caddy/caddy.container" ]; then
  repair_file_paths "$HOME/.config/containers/systemd/caddy/caddy.container"
fi

# 5. Reload Systemd User Daemon & Restart Caddy
echo "[4/6] Reloading systemd user daemon..."
loginctl enable-linger "$USER" || true
systemctl --user daemon-reload

echo "[5/6] Starting caddy.service..."
systemctl --user restart caddy.service || systemctl --user start caddy.service || true
systemctl --user status caddy.service --no-pager || true

# 6. Purge Bunny CDN Cache
echo "[6/6] Purging Bunny CDN cache..."
if command -v bunny-purge &> /dev/null; then
  bunny-purge || true
  echo "  - Bunny CDN cache purged"
fi

echo "======================================================================"
echo "==> Caddy & Quadlet Repair Completed Successfully!"
echo "    Production Path: $HOME/bridge-ph/accustandard"
echo "    Demo Path:       $HOME/bridge-ph/accustandard-demo"
echo "======================================================================"
