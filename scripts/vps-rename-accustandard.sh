#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — Production VPS Migration & Rename Script
# Target Host: jk@216.75.75.136
# Target Directories:
#   - Production Web Root: /home/jk/bridge-ph/accustandard
#   - Production Quadlet Systemd: /home/jk/.config/containers/systemd/bridge-ph/accustandard
#   - Demo Web Root: /home/jk/bridge-ph/accustandard-demo
#   - Demo Quadlet Systemd: /home/jk/.config/containers/systemd/bridge-ph/accustandard-demo
# ==============================================================================

set -euo pipefail

echo "======================================================================"
echo "==> Starting Accustandard VPS Container & Directory Migration..."
echo "======================================================================"

# 1. Stop legacy Podman containers & quadlet services
echo "[1/6] Stopping legacy containers and systemd services..."
systemctl --user stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db || true
podman stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db || true
podman pod stop accustanda-pod accustanda-demo-pod || true
podman rm -f accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db || true
podman pod rm -f accustanda-pod accustanda-demo-pod || true

# 2. Rename Web Root Directories on VPS
echo "[2/6] Renaming web root directories..."
mkdir -p "$HOME/bridge-ph"

if [ -d "$HOME/bridge-ph/accustanda" ]; then
  mv "$HOME/bridge-ph/accustanda" "$HOME/bridge-ph/accustandard"
  echo "  - Moved $HOME/bridge-ph/accustanda -> $HOME/bridge-ph/accustandard"
else
  mkdir -p "$HOME/bridge-ph/accustandard"
  echo "  - Created $HOME/bridge-ph/accustandard"
fi

if [ -d "$HOME/bridge-ph/accustanda-demo" ]; then
  mv "$HOME/bridge-ph/accustanda-demo" "$HOME/bridge-ph/accustandard-demo"
  echo "  - Moved $HOME/bridge-ph/accustanda-demo -> $HOME/bridge-ph/accustandard-demo"
else
  mkdir -p "$HOME/bridge-ph/accustandard-demo"
  echo "  - Created $HOME/bridge-ph/accustandard-demo"
fi

# 3. Update Quadlet Systemd Configurations
echo "[3/6] Updating Podman Quadlet Systemd directories..."
mkdir -p "$HOME/.config/containers/systemd/bridge-ph"

if [ -d "$HOME/.config/containers/systemd/bridge-ph/accustanda" ]; then
  rm -rf "$HOME/.config/containers/systemd/bridge-ph/accustanda"
fi
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard"

if [ -d "$HOME/.config/containers/systemd/bridge-ph/accustanda-demo" ]; then
  rm -rf "$HOME/.config/containers/systemd/bridge-ph/accustanda-demo"
fi
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard-demo"

# 4. Update Caddyfile Reverse Proxy
echo "[4/6] Updating Caddyfile reverse proxy configuration..."
if [ -f "$HOME/caddy/conf/Caddyfile" ]; then
  sed -i 's/accustanda/accustandard/g' "$HOME/caddy/conf/Caddyfile"
  podman exec caddy caddy fmt /etc/caddy/Caddyfile > /tmp/Caddyfile.tmp 2>/dev/null && mv /tmp/Caddyfile.tmp "$HOME/caddy/conf/Caddyfile" || true
  podman exec caddy caddy reload --config /etc/caddy/Caddyfile || true
  echo "  - Caddyfile updated and reloaded"
fi

# 5. Reload Systemd Lingering & Daemon
echo "[5/6] Reloading systemd user daemon..."
loginctl enable-linger "$USER" || true
systemctl --user daemon-reload

# 6. Purge Bunny CDN Cache
echo "[6/6] Purging Bunny CDN cache..."
if command -v bunny-purge &> /dev/null; then
  bunny-purge || true
  echo "  - Bunny CDN cache purged"
fi

echo "======================================================================"
echo "==> Migration Completed Successfully!"
echo "    Production Path: $HOME/bridge-ph/accustandard"
echo "    Demo Path:       $HOME/bridge-ph/accustandard-demo"
echo "    Systemd Path:    $HOME/.config/containers/systemd/bridge-ph/accustandard"
echo "======================================================================"
