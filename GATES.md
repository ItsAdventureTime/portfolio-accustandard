# Gates: manual Docker Compose demo deployment

The active demo gate is `scripts/check-demo-deployment-contract.sh` and the
step-by-step procedure is `DEPLOYMENT_GUIDE.md`. The former VPS/Podman gates
below are historical records, not current deployment instructions.

## 2026-09-24 pre-launch gates

The implementation owner and reviewer are assigned in
[`docs/agent/HANDOFF.md`](docs/agent/HANDOFF.md). Until these checks pass,
do not treat the public hostname as accepted:

- [ ] Compose pins PostgreSQL major 17, mounts its named volume at
  `/var/lib/postgresql/data`, and the contract script rejects regression.
- [ ] Existing OrbStack database state is inspected and backed up before a
  mount/image change; a fresh database starts healthy after the change.
- [ ] Secrets stay outside Git and images in a mode `700` directory with a
  mode `600` password file; safe environment values remain in Compose.
- [ ] The active Go binary fails closed when `DATABASE_URL` is absent; no
  hard-coded fallback credential remains in `backend/cmd/server/main.go`.
- [ ] Reviewer verifies root page, `/api/v1/readiness`, seeded read,
  controlled mutation, role failure, and HTTPS at
  `https://accustandard.delegateops.business`.
- [ ] Reviewer records browser and recovery evidence, or the precise blocker,
  in `IMPLEMENTATION_STATUS.md` before declaring the demo functional.

## Historical VPS/Podman gates

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
