#!/usr/bin/env bash
set -euo pipefail

echo "==> Setting up Accustanda Bridge Dashboard Podman Quadlets..."

# Create Data Directories
mkdir -p "$HOME/bridge-ph/accustanda-demo/db"
mkdir -p "$HOME/bridge-ph/accustanda/db"

# Create Quadlet Systemd Directories
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustanda-demo"
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustanda"

# Copy Demo Quadlets
cp -f deploy/quadlets/demo/* "$HOME/.config/containers/systemd/bridge-ph/accustanda-demo/"

# Copy Production Quadlets
cp -f deploy/quadlets/production/* "$HOME/.config/containers/systemd/bridge-ph/accustanda/"

# Enable Systemd Lingering for Rootless Podman
loginctl enable-linger "$USER" || true

# Reload Systemd Daemon
systemctl --user daemon-reload

echo "==> Quadlet units installed successfully!"
echo "    - Demo Quadlet path: $HOME/.config/containers/systemd/bridge-ph/accustanda-demo"
echo "    - Production Quadlet path: $HOME/.config/containers/systemd/bridge-ph/accustanda"
echo "    - Data path Demo: $HOME/bridge-ph/accustanda-demo"
echo "    - Data path Production: $HOME/bridge-ph/accustanda"
