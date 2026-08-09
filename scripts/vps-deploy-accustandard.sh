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

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

echo "======================================================================"
echo "==> Starting Accustandard Demo VPS Deployment & Caddy Auto-Repair..."
echo "======================================================================"

DEMO_ROOT="$HOME/bridge-ph/accustandard-demo"
DEMO_QUADLET_DIR="$HOME/.config/containers/systemd/bridge-ph/accustandard-demo"

# 1. Clean up legacy container services & directories if present
echo "[1/6] Cleaning up legacy container services..."
systemctl --user stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db 2>/dev/null || true
podman stop accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db 2>/dev/null || true
podman pod stop accustanda-pod accustanda-demo-pod 2>/dev/null || true
podman rm -f accustanda-app accustanda-db accustanda-demo-app accustanda-demo-db 2>/dev/null || true
podman pod rm -f accustanda-pod accustanda-demo-pod 2>/dev/null || true

# 2. Ensure Demo Web Root Directory structure
echo "[2/6] Verifying demo web root directory ($DEMO_ROOT)..."
mkdir -p "$DEMO_ROOT/web-dist"
mkdir -p "$DEMO_ROOT/postgres-data"
mkdir -p "$DEMO_ROOT/backend"
rm -rf "$HOME/bridge-ph/accustanda" "$HOME/bridge-ph/accustanda-demo" 2>/dev/null || true

# 3. Clean up legacy Quadlet folders and recreate target directory
echo "[3/6] Cleaning up Quadlet directory structures..."
rm -rf "$HOME/.config/containers/systemd/bridge-ph/accustandard" 2>/dev/null || true
rm -rf "$HOME/.config/containers/systemd/bridge-ph/accustanda" 2>/dev/null || true
rm -rf "$HOME/.config/containers/systemd/bridge-ph/accustanda-demo" 2>/dev/null || true
mkdir -p "$DEMO_QUADLET_DIR"

# 4. Synchronize Demo Quadlet Units strictly to /home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/
echo "[4/6] Synchronizing Demo Quadlet unit files to $DEMO_QUADLET_DIR..."
SCRIPT_SOURCE="${BASH_SOURCE[0]:-}"
if [ -n "$SCRIPT_SOURCE" ] && [ -f "$SCRIPT_SOURCE" ]; then
  SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_SOURCE")" && pwd)"
  REPO_DIR="$(dirname "$SCRIPT_DIR")"
  if [ -d "$REPO_DIR/deploy/quadlets/demo" ]; then
    cp -rf "$REPO_DIR/deploy/quadlets/demo/"* "$DEMO_QUADLET_DIR/" 2>/dev/null || true
  fi
fi

# Build Go Backend image on VPS if source is available
if [ -d "$DEMO_ROOT/backend" ] && [ -f "$DEMO_ROOT/backend/Dockerfile" ]; then
  echo "  - Building Go REST API backend image..."
  podman build -t localhost/accustandard-bridge-backend:demo -f "$DEMO_ROOT/backend/Dockerfile" "$DEMO_ROOT/backend" || true
fi

# 5. Fix caddy.container Volume Mounts & Caddyfile configuration
echo "[5/6] Updating Caddy configuration & volume mounts..."

CADDY_CONTAINER_LOCATIONS=(
  "$HOME/.config/containers/systemd/caddy/caddy.container"
  "$HOME/.config/containers/systemd/caddy.container"
)

for c_loc in "${CADDY_CONTAINER_LOCATIONS[@]}"; do
  if [ -f "$c_loc" ]; then
    echo "  - Updating Caddy container volume mount in: $c_loc"
    sed -i 's|/home/jk/bridge-ph/accustandard/demo|/home/jk/bridge-ph/accustandard-demo|g' "$c_loc" || true
    sed -i 's|/srv/bridge-ph-accustandard/demo|/srv/bridge-ph-accustandard-demo|g' "$c_loc" || true
  fi
done

# Format & validate Caddyfile
if podman container exists caddy 2>/dev/null; then
  echo "  - Reloading Caddy configuration inside caddy container..."
  podman exec caddy caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || true
fi

# 6. Reload Systemd User Daemon & Restart Quadlets & Rootless caddy.service
echo "[6/6] Reloading systemd user daemon & restarting services..."
loginctl enable-linger "$USER" 2>/dev/null || true
systemctl --user daemon-reload

systemctl --user restart accustandard-demo-db.service || systemctl --user start accustandard-demo-db.service || true
systemctl --user restart accustandard-demo-app.service || systemctl --user start accustandard-demo-app.service || true
systemctl --user restart caddy.service || systemctl --user start caddy.service || true

echo "======================================================================"
echo "==> Demo VPS Deployment & Caddy Repair Completed Successfully!"
echo "    Live Demo URL:  https://delegateops.business/accustandard/demo"
echo "    Demo Web Root:  /home/jk/bridge-ph/accustandard-demo/"
echo "    Demo Quadlets:  /home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/"
echo "======================================================================"
