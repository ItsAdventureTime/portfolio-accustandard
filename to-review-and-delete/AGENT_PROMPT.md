# Execution Agent Copy-Paste Prompt

> **2026-08-12 audit:** Read `IMPLEMENTATION_STATUS.md` first. The confirmed
> handoff and acceptance handoff outrank this historical execution prompt;
> seeded or UI-only states are not acceptance evidence.

Copy and paste the prompt below into your next session or agent to execute the implementation plan.

---

```markdown
You are an expert Go backend engineer, frontend specialist, and DevOps engineer. Execute tasks for the Accustandard Medical ERP project strictly adhering to the specification in `GO_MIGRATION_PLAN.md` and repository guidelines.

## Mandatory Repository Workflow Rules:

0. **Documentation Synchronization Policy**:
   - Every time code, components, dependencies, scripts, or design specs are changed, all project documentation (`README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `accustandard-developer-handoff.md`, `AGENT_PROMPT.md`, `GO_MIGRATION_PLAN.md`) MUST be updated immediately.

1. **GitHub Remote HTTPS Synchronization Policy**:
   - Remote synchronization to GitHub (`https://github.com/ItsAdventureTime/bridge-accustandard.git`) MUST use only official GitHub CLI (`gh`) over authenticated HTTPS.
   - Do not use `git push`, SSH remotes, SSH keys, or passkeys for remote operations.

## Execution Rules:

1. **Architecture & Scope**:
   - Keep the existing Next.js React UI in `src/` (do not rewrite the frontend). Build static export files to `out/` with `basePath: '/accustandard/demo'`.
   - Build a high-performance Go REST API backend in `backend/` using `go-chi/chi/v5`, PostgreSQL, and `sqlc` or GORM.
   - Serve API endpoints under `/accustandard/demo/api/v1/*`.

2. **Database & Mock Data**:
   - Create versioned migrations (`backend/migrations/`) for PostgreSQL (`accustandard_demo_db`).
   - Pre-populate the demo database with realistic, high-fidelity mock data (Class 1/2/3 items across QC and Pampanga warehouses, active quotations, SOA ledgers, COSO 4-layer approval pipeline logs, and QBO sync items).

3. **Containerization & Quadlets**:
   - Place all Quadlet unit files for the Demo environment strictly in:
     `/home/jk/.config/containers/systemd/bridge-ph/accustandard-demo/`
   - Store all data, config, and web dist files on the VPS strictly in:
     `/home/jk/bridge-ph/accustandard-demo/`

4. **Deployment Scripts**:
   - Provide `./scripts/vps-migrate-to-go.sh` to initialize the Go backend container and database migration on the VPS.
   - Provide `./scripts/deploy-demo.sh` (or `npm run deploy:demo`) for 1-command deployment:
     - Automatically start Podman machine locally via `podman machine start` if stopped.
     - Runs local static build inside a disposable Podman container (`podman run --rm -v "$(pwd):/workspace:Z" node:24-alpine sh -c "npm ci && npm run build"`).
     - Runs VPS deployment & Caddy repair non-interactively over SSH.
     - Syncs static export files to `/home/jk/bridge-ph/accustandard-demo/web-dist/`.
```

## Current Acceptance Corrections (2026-08-12)

- Do not add a DCS approval task to Sales Quotes.
- Enforce Marketing Reviewer → GM ordering and segregation of duties.
- Block over-receiving atomically and leave fully received POs awaiting vendor invoice/3-way match.
- Prefer the Go API for hydration; do not reintroduce browser `localStorage` as authoritative business state.
