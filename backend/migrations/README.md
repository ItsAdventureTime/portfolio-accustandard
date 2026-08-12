# Demo migration boundary

See the repository-level `IMPLEMENTATION_STATUS.md` before treating any SQL
file as an acceptance migration. The current runtime is transitional and is
not a production migration chain.

Repository authority is split deliberately: `implementation_plan.md` governs
UI/UX scope, the confirmed acceptance handoff governs business rules,
`IMPLEMENTATION_STATUS.md` governs runtime status, and `README.md`,
`ARCHITECTURE.md`, and `CONTRIBUTING.md` govern operations. This migration
directory does not override those documents.

The deployed demo service executes `003_cleanup_legacy_schema.sql`, uses GORM
`AutoMigrate` for the runtime schema, and executes `002_seed_data.sql` only for
idempotent demo seed data. The cleanup migration removes the incompatible
prototype table family when detected; it does not create a backup.

Before production cutover, replace this transitional boundary with one
versioned PostgreSQL migration chain, a migration ledger, rollback policy, and
integration tests against PostgreSQL 17.
