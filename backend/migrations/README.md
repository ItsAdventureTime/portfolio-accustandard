# Demo migration boundary

See the repository-level `IMPLEMENTATION_STATUS.md` before treating any SQL
file as an acceptance migration. The current runtime is transitional and is
not a production migration chain.

Repository authority is split deliberately: `implementation_plan.md` governs
UI/UX scope, the confirmed acceptance handoff governs business rules,
`IMPLEMENTATION_STATUS.md` governs runtime status, and `README.md`,
`ARCHITECTURE.md`, and `CONTRIBUTING.md` govern operations. This migration
directory does not override those documents.

The deployed demo service executes `003_cleanup_legacy_schema.sql`, then
`004_reconcile_runtime_columns.sql`, uses GORM `AutoMigrate` for the runtime
schema, and executes `002_seed_data.sql` only for idempotent demo seed data.
The cleanup migration removes the incompatible prototype table family when
detected; it does not create a backup. The compatibility migration copies data
from the pre-tagged GORM aliases `d_csstatus` and `s_idate` into the canonical
runtime columns `dcs_status` and `si_date`, then removes the aliases so old
`NOT NULL` constraints cannot reject new writes.

Startup order is part of the demo contract: PostgreSQL 17 must be healthy,
then cleanup runs, then compatibility reconciliation, then GORM `AutoMigrate`,
then the seed SQL. Each runtime SQL script executes inside a database
transaction. The seed targets the default GORM pluralized snake_case table
names derived from
`backend/internal/models/models.go` (for example, `inventory_stocks` and
`qbo_queue_items`). Do not add singular table overrides or rename seed targets
without updating the model-derived contract and its regression test. Seed UUID
literals must remain valid PostgreSQL UUIDs; backend tests cover the canonical
acronym-column and seed-target contracts.

Before production cutover, replace this transitional boundary with one
versioned PostgreSQL migration chain, a migration ledger, rollback policy, and
integration tests against PostgreSQL 17.
