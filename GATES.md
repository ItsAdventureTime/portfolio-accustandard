# Gates: rootless Podman deployment repair

- [ ] The deployment no longer references `/srv`, `sudo`, or the root-owned publisher.
  CHECK: rg -n '/srv/bridge-ph-accustandard|sudo|accustandard-demo-activate' scripts/deploy-demo.sh scripts/vps-deploy-accustandard.sh
  EXPECT: no matches
  EVIDENCE: checked 2026-08-25; see command above

- [ ] Demo release, web export, PostgreSQL data, Quadlets, and Caddy configuration use the `jk`-owned paths supplied by the user.
  CHECK: bash -n scripts/deploy-demo.sh scripts/vps-deploy-accustandard.sh
  EXPECT: exit 0
  EVIDENCE: checked 2026-08-25; see command above

- [ ] Demo dry run succeeds without an SSH, sudo, or `/srv` write.
  CHECK: ACCUSTANDARD_DEPLOY_DRY_RUN=true npm run deploy:demo
  EXPECT: exit 0 and release cleanup
  EVIDENCE: checked 2026-08-25; see command above

- [ ] Relevant documentation describes the rootless Caddy/Quadlet deployment and exact demo command.
  CHECK: git diff --check
  EXPECT: exit 0
  EVIDENCE: checked 2026-08-25; see command above

- [ ] Independent simplicity review finds no unnecessary deployment complexity.
  EVIDENCE: checked 2026-08-25; see command above
