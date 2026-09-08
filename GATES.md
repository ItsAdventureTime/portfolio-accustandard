# Gates: manual Docker Compose demo deployment

The active demo gate is `scripts/check-demo-deployment-contract.sh` and the
step-by-step procedure is `DEPLOYMENT_GUIDE.md`. The former VPS/Podman gates
below are historical records, not current deployment instructions.

- [ ] The deployment no longer references `/srv`, `sudo`, or the root-owned publisher.
  CHECK: rg -n '/srv/bridge-ph-accustandard|sudo|accustandard-demo-activate' scripts/deploy-demo.sh scripts/vps-deploy-accustandard.sh
  EXPECT: no matches
  EVIDENCE: checked 2026-08-25; see command above

- [ ] Demo release, web export, PostgreSQL data, Quadlets, and Caddy configuration use the `jk`-owned paths supplied by the user.
  CHECK: bash -n scripts/deploy-demo.sh scripts/vps-deploy-accustandard.sh
  EXPECT: exit 0
  EVIDENCE: checked 2026-08-25; see command above

- [x] Image-only Compose contract passes in the Docker Sandbox.
  CHECK: `jk-sbx-project exec bash scripts/check-demo-deployment-contract.sh`
  EXPECT: exit 0 and `Demo deployment contract: pass`
  EVIDENCE: checked 2026-09-08.

- [ ] Relevant documentation describes the rootless Caddy/Quadlet deployment and exact demo command.
  CHECK: git diff --check
  EXPECT: exit 0
  EVIDENCE: checked 2026-08-25; see command above

- [ ] Independent simplicity review finds no unnecessary deployment complexity.
  EVIDENCE: checked 2026-08-25; see command above
