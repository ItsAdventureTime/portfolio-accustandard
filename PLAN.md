# Rootless deployment repair plan

1. Map the actual rootless Caddy and Quadlet ownership paths; remove the incorrect root-publisher boundary.
2. Update deployment scripts so the user-owned Caddy configuration and static export are activated through the existing user services.
3. Update guides and run a no-remote demo dry run.
4. Independently review the diff for unnecessary complexity, then record all gate evidence.
