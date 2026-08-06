#!/usr/bin/env bash
set -euo pipefail

echo "==> Setting up Accustandard Dashboard Podman Quadlets..."

# Create Data Directories
mkdir -p "$HOME/bridge-ph/accustandard-demo/db"
mkdir -p "$HOME/bridge-ph/accustandard/db"

# Create Quadlet Systemd Directories
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard-demo"
mkdir -p "$HOME/.config/containers/systemd/bridge-ph/accustandard"

# Copy Demo Quadlets
cp -f deploy/quadlets/demo/* "$HOME/.config/containers/systemd/bridge-ph/accustandard-demo/"

# Copy Production Quadlets
cp -f deploy/quadlets/production/* "$HOME/.config/containers/systemd/bridge-ph/accustandard/"

# Enable Systemd Lingering for Rootless Podman
loginctl enable-linger "$USER" || true

# Reload Systemd Daemon
systemctl --user daemon-reload

echo "==> Quadlet units installed successfully!"
echo "    - Demo Quadlet path: $HOME/.config/containers/systemd/bridge-ph/accustandard-demo"
echo "    - Production Quadlet path: $HOME/.config/containers/systemd/bridge-ph/accustandard"
echo "    - Data path Demo: $HOME/bridge-ph/accustandard-demo"
echo "    - Data path Production: $HOME/bridge-ph/accustandard"
