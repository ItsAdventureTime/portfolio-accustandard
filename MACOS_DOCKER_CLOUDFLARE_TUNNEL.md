# macOS OrbStack + Cloudflare Tunnel Demo Runtime

Use the canonical [Demo Deployment Guide](DEPLOYMENT_GUIDE.md). This supporting note records the network boundary:

- The existing `cloudflared` container owns public ingress and must join `cloudflared-network`.
- The demo frontend joins both `cloudflared-network` and the internal `accustandard-network`.
- The API and PostgreSQL join only `accustandard-network`.
- The runtime uses `~/docker/portfolio/accustandard/compose.yaml`, has no `ports:` entries, and runs prebuilt images only.

Route `accustandard.delegateops.business` in the existing tunnel to `http://accustandard-demo-frontend:80`. Bypass Cloudflare caching for `/api/*`.
