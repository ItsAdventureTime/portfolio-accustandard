#!/usr/bin/env bash
# ==============================================================================
# Accustandard Medical ERP — VPS Go Backend & Database Migration Script
# Target Host: jk@216.75.75.136
# Target Directory: /home/jk/bridge-ph/accustandard-demo/
# ==============================================================================

set -euo pipefail

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

DEMO_ROOT="/home/jk/bridge-ph/accustandard-demo"
SOURCE_ROOT="$DEMO_ROOT/source"
QUADLET_DIR="/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo"

echo "======================================================================"
echo "==> Initializing VPS Go Backend & PostgreSQL Database Migration..."
echo "======================================================================"

# 1. Ensure required directory structure exists
mkdir -p "$DEMO_ROOT/postgres-data"
mkdir -p "$DEMO_ROOT/web-dist"
mkdir -p "$SOURCE_ROOT"
mkdir -p "$QUADLET_DIR"

# 2. Build Go API Container Image on VPS if backend code is present
if [ -d "$SOURCE_ROOT/backend" ] && [ -f "$SOURCE_ROOT/backend/Dockerfile" ]; then
  echo "[1/3] Building Go Backend image (localhost/accustandard-bridge-backend:demo)..."
  podman build --pull=missing -t localhost/accustandard-bridge-backend:demo -f "$SOURCE_ROOT/backend/Dockerfile" "$SOURCE_ROOT/backend"
fi

# 3. Reload systemd daemon & restart only the API Quadlet
echo "[2/3] Reloading systemd user daemon & restarting the API service..."
systemctl --user daemon-reload
systemctl --user restart accustandard-demo-app.service

# 4. Verify DB & Go container execution status
echo "[3/3] Checking container status..."
podman ps --filter "name=accustandard-demo" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "======================================================================"
echo "==> VPS Go Migration Initialization Complete!"
echo "======================================================================"
