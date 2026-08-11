# Demo migration boundary

See the repository-level `IMPLEMENTATION_STATUS.md` before treating any SQL
file as an acceptance migration. The current runtime is transitional and is
not a production migration chain.

The deployed demo service currently uses GORM `AutoMigrate` for the runtime
schema and executes `002_seed_data.sql` only for idempotent demo seed data.

`001_initial_schema.sql` and `002_seed_demo_data.sql` are retained as legacy
prototype artifacts because they describe a different table family. They are
not executed by `backend/internal/db/db.go` and must not be presented as the
canonical production migration chain.

Before production cutover, replace this transitional boundary with one
versioned PostgreSQL migration chain, a migration ledger, rollback policy, and
integration tests against PostgreSQL 16.
