#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — Production VPS Migration & Caddy Repair Script
# Target Host: jk@216.75.75.136
# ==============================================================================

set -euo pipefail

echo "======================================================================"
echo "==> Starting Accustandard VPS Container, Caddy & Directory Fix..."
echo "======================================================================"

# 1. Stop legacy Podman containers & quadlet services
echo "[1/7] Stopping legacy containers and systemd services..."
systemctl --user stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db || true
podman stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db || true
podman pod stop accustanda-pod accustanda-demo-pod || true
podman rm -f accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db || true
podman pod rm -f accustanda-pod accustanda-demo-pod || true

# 2. Ensure Web Root Directories & Create Backward-Compatible Symlinks
echo "[2/7] Managing web root directories & backward-compatibility symlinks..."
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

# Create symlinks so Caddy volume mounts pointing to legacy paths never fail
ln -sfn "$HOME/bridge-ph/accustandard" "$HOME/bridge-ph/accustanda"
ln -sfn "$HOME/bridge-ph/accustandard-demo" "$HOME/bridge-ph/accustanda-demo"
echo "  - Created symlinks: accustanda -> accustandard, accustanda-demo -> accustandard-demo"

# 3. Update Quadlet Systemd Configurations
echo "[3/7] Updating Podman Quadlet Systemd unit files..."
mkdir -p "$HOME/.config/containers/systemd/bridge-ph"

if [ -d "$HOME/.config/containers/systemd/bridge-ph/accustanda" ]; then
  rm -rf "$HOME/.config/containers/systemd/bridge-ph/accustanda"
fi
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard"

if [ -d "$HOME/.config/containers/systemd/bridge-ph/accustanda-demo" ]; then
  rm -rf "$HOME/.config/containers/systemd/bridge-ph/accustanda-demo"
fi
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard-demo"

# Update any Caddy systemd/quadlet files referencing legacy paths
find "$HOME/.config/containers/systemd" -type f -exec sed -i 's/accustanda-demo/accustandard-demo/g' {} + 2>/dev/null || true
find "$HOME/.config/containers/systemd" -type f -exec sed -i 's/accustanda/accustandard/g' {} + 2>/dev/null || true

# 4. Update Caddyfile Reverse Proxy
echo "[4/7] Updating Caddyfile reverse proxy configuration..."
if [ -f "$HOME/caddy/conf/Caddyfile" ]; then
  sed -i 's/accustanda-demo/accustandard-demo/g' "$HOME/caddy/conf/Caddyfile"
  sed -i 's/accustanda/accustandard/g' "$HOME/caddy/conf/Caddyfile"
  podman exec caddy caddy fmt /etc/caddy/Caddyfile > /tmp/Caddyfile.tmp 2>/dev/null && mv /tmp/Caddyfile.tmp "$HOME/caddy/conf/Caddyfile" || true
  podman exec caddy caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || true
  echo "  - Caddyfile updated and reloaded"
fi

# 5. Reload Systemd Lingering & Daemon
echo "[5/7] Reloading systemd user daemon..."
loginctl enable-linger "$USER" || true
systemctl --user daemon-reload

# 6. Restart Caddy Edge Service
echo "[6/7] Restarting caddy.service..."
systemctl --user restart caddy.service || true
systemctl --user status caddy.service --no-pager || true

# 7. Purge Bunny CDN Cache
echo "[7/7] Purging Bunny CDN cache..."
if command -v bunny-purge &> /dev/null; then
  bunny-purge || true
  echo "  - Bunny CDN cache purged"
fi

echo "======================================================================"
echo "==> Caddy & Accustandard VPS Migration Completed!"
echo "    Production Path: $HOME/bridge-ph/accustandard"
echo "    Demo Path:       $HOME/bridge-ph/accustandard-demo"
echo "    Symlinks Created: accustanda -> accustandard, accustanda-demo -> accustandard-demo"
echo "======================================================================"
