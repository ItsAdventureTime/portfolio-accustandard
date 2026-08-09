#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — Clean Permanent Production VPS Migration
# Target Host: jk@216.75.75.136
# Target Directories:
#   - Production Web Root: /home/jk/bridge-ph/accustandard
#   - Production Quadlet Systemd: /home/jk/.config/containers/systemd/bridge-ph/accustandard
#   - Demo Web Root: /home/jk/bridge-ph/accustandard-demo
#   - Demo Quadlet Systemd: /home/jk/.config/containers/systemd/bridge-ph/accustandard-demo
# ==============================================================================

set -euo pipefail

echo "======================================================================"
echo "==> Starting Clean Permanent Accustandard VPS Migration..."
echo "======================================================================"

# 1. Stop legacy Podman containers & quadlet services
echo "[1/6] Stopping legacy containers and systemd services..."
systemctl --user stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db caddy.service || true
podman stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db caddy || true
podman pod stop accustanda-pod accustanda-demo-pod || true
podman rm -f accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db caddy || true
podman pod rm -f accustanda-pod accustanda-demo-pod || true

# 2. Clean up any legacy symlinks & rename web root directories permanently
echo "[2/6] Cleanly updating web root directories to permanent name 'accustandard'..."
rm -f "$HOME/bridge-ph/accustanda" "$HOME/bridge-ph/accustanda-demo" 2>/dev/null || true

mkdir -p "$HOME/bridge-ph"

if [ -d "$HOME/bridge-ph/accustanda" ] && [ ! -d "$HOME/bridge-ph/accustandard" ]; then
  mv "$HOME/bridge-ph/accustanda" "$HOME/bridge-ph/accustandard"
  echo "  - Moved $HOME/bridge-ph/accustanda -> $HOME/bridge-ph/accustandard"
else
  mkdir -p "$HOME/bridge-ph/accustandard"
fi

if [ -d "$HOME/bridge-ph/accustanda-demo" ] && [ ! -d "$HOME/bridge-ph/accustandard-demo" ]; then
  mv "$HOME/bridge-ph/accustanda-demo" "$HOME/bridge-ph/accustandard-demo"
  echo "  - Moved $HOME/bridge-ph/accustanda-demo -> $HOME/bridge-ph/accustandard-demo"
else
  mkdir -p "$HOME/bridge-ph/accustandard-demo"
fi

# 3. Permanently update systemd Quadlet & Caddy container files
echo "[3/6] Updating all Podman Quadlet & Caddy container volume configurations..."
mkdir -p "$HOME/.config/containers/systemd/bridge-ph"

if [ -d "$HOME/.config/containers/systemd/bridge-ph/accustanda" ]; then
  rm -rf "$HOME/.config/containers/systemd/bridge-ph/accustanda"
fi
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard"

if [ -d "$HOME/.config/containers/systemd/bridge-ph/accustanda-demo" ]; then
  rm -rf "$HOME/.config/containers/systemd/bridge-ph/accustanda-demo"
fi
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard-demo"

# Permanently update all volume path references in systemd Quadlet files
find "$HOME/.config/containers/systemd" -type f -exec sed -i 's/accustanda-demo/accustandard-demo/g' {} + 2>/dev/null || true
find "$HOME/.config/containers/systemd" -type f -exec sed -i 's/accustanda/accustandard/g' {} + 2>/dev/null || true
find "$HOME/.config/systemd/user" -type f -exec sed -i 's/accustanda-demo/accustandard-demo/g' {} + 2>/dev/null || true
find "$HOME/.config/systemd/user" -type f -exec sed -i 's/accustanda/accustandard/g' {} + 2>/dev/null || true

# 4. Update Caddyfile Reverse Proxy Configuration permanently
echo "[4/6] Updating Caddyfile configuration..."
if [ -f "$HOME/caddy/conf/Caddyfile" ]; then
  sed -i 's/accustanda-demo/accustandard-demo/g' "$HOME/caddy/conf/Caddyfile"
  sed -i 's/accustanda/accustandard/g' "$HOME/caddy/conf/Caddyfile"
fi

# 5. Reload Systemd User Daemon & Restart Caddy Service
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
echo "==> Clean Permanent Accustandard VPS Migration Completed!"
echo "    Production Path: $HOME/bridge-ph/accustandard"
echo "    Demo Path:       $HOME/bridge-ph/accustandard-demo"
echo "    Systemd Path:    $HOME/.config/containers/systemd/bridge-ph/accustandard"
echo "======================================================================"
