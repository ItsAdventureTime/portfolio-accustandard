# macOS OrbStack + Cloudflare Tunnel Runtime Boundary

Refer to the canonical [Demo Deployment Guide](DEPLOYMENT_GUIDE.md) for full deployment instructions. This reference records the network and ingress boundary for the Mac mini host running OrbStack:

- **Ingress Owner**: The existing `cloudflared` container handles public traffic and joins the external bridge network `cloudflared-network`.
- **Frontend Boundary**: Container `accustandard-portfolio_frontend` joins both `cloudflared-network` (with alias `accustandard-demo-frontend`) and the internal `accustandard-network`.
- **Backend & Database Boundary**: Containers `accustandard-portfolio_api` and `accustandard-portfolio_db` join only `accustandard-network` (`internal: true`).
- **Host Ports**: The Compose file declares no `ports:` entries; services are unreachable from the host network interface directly.
- **Tunnel Route**: In Cloudflare Zero Trust, route `accustandard.delegateops.business` to `http://accustandard-demo-frontend:80`.
- **Caching**: Nginx automatically sends `Cache-Control: no-store` on `/api/*`, preventing Cloudflare edge caching by default.
