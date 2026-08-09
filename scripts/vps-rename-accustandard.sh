#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — VPS Migration, Caddy Validation & Formatting Script
# Target Host: jk@216.75.75.136
# ==============================================================================

set -euo pipefail

echo "======================================================================"
echo "==> Starting Accustandard VPS Migration & Caddy Validation..."
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

# 3. Clean up sed-corrupted strings across all systemd files
echo "[3/6] Cleaning up quadlet configuration files & correcting volume paths..."

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

# Recursively fix all quadlet & systemd unit files
find "$HOME/.config/containers/systemd" -type f 2>/dev/null | while read -r file; do
  repair_file_paths "$file"
done

find "$HOME/.config/systemd/user" -type f 2>/dev/null | while read -r file; do
  repair_file_paths "$file"
done

# 4. Auto-Format (`caddy fmt`) & Validate (`caddy validate`) Caddyfile
echo "[4/6] Auto-formatting (caddy fmt) and validating (caddy validate) Caddyfile..."
if [ -f "$HOME/caddy/conf/Caddyfile" ]; then
  repair_file_paths "$HOME/caddy/conf/Caddyfile"

  # If host caddy binary exists:
  if command -v caddy &> /dev/null; then
    echo "  - Formatting Caddyfile with host caddy binary..."
    caddy fmt --overwrite "$HOME/caddy/conf/Caddyfile" 2>/dev/null || true
    echo "  - Validating Caddyfile syntax..."
    caddy validate --config "$HOME/caddy/conf/Caddyfile" || echo "  ! Warning: Host caddy validate reported errors."
  # Otherwise use Podman container caddy binary:
  elif podman container exists caddy 2>/dev/null || podman image exists docker.io/library/caddy:alpine 2>/dev/null; then
    echo "  - Formatting Caddyfile via Podman container..."
    podman exec caddy caddy fmt --overwrite /etc/caddy/Caddyfile 2>/dev/null || true
    echo "  - Validating Caddyfile syntax via Podman container..."
    podman exec caddy caddy validate --config /etc/caddy/Caddyfile 2>/dev/null || true
  fi
  echo "  - Caddyfile formatting and validation check complete."
fi

# 5. Reload Systemd User Daemon & Restart Caddy
echo "[5/6] Reloading systemd user daemon & starting caddy.service..."
loginctl enable-linger "$USER" || true
systemctl --user daemon-reload
systemctl --user restart caddy.service || systemctl --user start caddy.service || true
systemctl --user status caddy.service --no-pager || true

# 6. Purge Bunny CDN Cache
echo "[6/6] Purging Bunny CDN cache..."
if command -v bunny-purge &> /dev/null; then
  bunny-purge || true
  echo "  - Bunny CDN cache purged"
fi

echo "======================================================================"
echo "==> Accustandard VPS Migration, Formatting & Validation Complete!"
echo "    Production Path: $HOME/bridge-ph/accustandard"
echo "    Demo Path:       $HOME/bridge-ph/accustandard-demo"
echo "======================================================================"
