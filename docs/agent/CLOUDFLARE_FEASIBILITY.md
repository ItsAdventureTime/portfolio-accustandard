# Cloudflare feasibility for the portfolio demo

**Reviewed:** 2026-09-24. **Decision:** Use the existing macOS OrbStack Docker
Compose stack behind the existing Cloudflare Tunnel. This keeps the Go API,
PostgreSQL schema, static Next.js export, same-origin `/api/v1` calls, and the
operator's current hosting setup. This is a public, disposable portfolio demo,
not a production ERP or a home for real company data. Account entitlements and
the running Mac mini were not inspected; confirm them before enabling any
Cloudflare product.

R2 has a separate subscription activation flow; a Workers subscription alone
does not prove that R2 is enabled. Containers require Workers Paid. Check the
account's actual entitlements and current pricing before choosing either.

## What the repository actually needs

- `next.config.ts` exports static files. `docker/demo-frontend.Dockerfile` serves
  them with Nginx and proxies `/api/` to the Go service.
- `src/lib/api.ts` calls same-origin `/api/v1` and sends the forgeable demo role
  header. The Go routes in `backend/cmd/server/main.go` use PostgreSQL through
  GORM in `backend/internal/db/db.go` and run PostgreSQL-specific SQL on startup.
- `deploy/demo/compose.yaml` already describes the three containers and the
  external tunnel network. No current API route stores files in object storage.
  The existing Backblaze B2 workflow is optional operator storage, not an
  application dependency.

## Service fit

| Service | Can bind to a Worker? | Fit for this repository now |
| --- | --- | --- |
| Workers with Static Assets | Yes. GitHub-connected Workers Builds can build and deploy on commits once the Worker project and build commands are configured. | Static frontend can move, but the Go API and PostgreSQL do not move with static assets. Preserving `/api/v1` requires a Worker proxy or an API rewrite. Cloudflare builds would replace local frontend builds only after that migration. |
| R2 | Yes, using an R2 bucket binding. R2 also offers a separate S3-compatible HTTP API for SDKs and tools. | No server-backed upload/download feature exists. Binding an empty bucket would add no demo function. Use it only when an actual document or attachment flow needs persistent objects. |
| D1 | Yes, using a D1 database binding. | D1 uses SQLite semantics. The Go PostgreSQL driver, GORM models, runtime SQL, and transactional behavior need migration and acceptance checks. A binding cannot make this PostgreSQL app run on D1. |
| Hyperdrive | Yes, for a Worker that connects to PostgreSQL or MySQL. | The existing Go container already connects locally to PostgreSQL; it cannot consume a Worker binding. Connecting a Worker to private Mac PostgreSQL would also require Workers VPC/Tunnel connectivity, TLS, and account access. No benefit for this demo path. |
| KV | Yes, using a KV namespace binding. | KV is eventually consistent and unsuitable as the transactional store for approvals, receiving, SOA allocation, or RFP release. It could hold read-heavy configuration later. |
| Containers | Yes, a Worker can route to Cloudflare Containers through a Durable Object binding. | The Go API could be containerized there, but images must support `linux/amd64`; container disk is ephemeral; PostgreSQL needs separate persistent hosting. Requires Workers Paid and adds cost and deployment machinery. |

Sources: [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/),
[build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/),
[Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/),
[R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/),
[R2 S3 API](https://developers.cloudflare.com/r2/api/),
[D1 binding API](https://developers.cloudflare.com/d1/worker-api/),
[Hyperdrive](https://developers.cloudflare.com/hyperdrive/get-started/),
[private Hyperdrive connection](https://developers.cloudflare.com/hyperdrive/configuration/connect-to-private-database-vpc/),
[KV consistency](https://developers.cloudflare.com/kv/concepts/how-kv-works/),
[Containers architecture](https://developers.cloudflare.com/containers/concepts/architecture/),
[Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/).

## If the demo later moves to Workers

1. Keep the existing Tunnel hostname serving the Compose demo while preparing
   the new Worker. Never point the same hostname at both origins during setup.
2. Choose one API design and implement it. The smaller migration is a static
   assets Worker plus an explicit `/api/*` proxy to a separate Tunnel hostname
   for the Go API. A full edge migration instead rewrites the Go/PostgreSQL API
   for a Worker-compatible runtime and database. Neither is a dashboard-only
   binding change.
3. Add a reviewed Wrangler configuration and Worker entry point to this repo.
   Set its name, static `out/` assets directory, and routing. Keep build-time
   variables separate from runtime variables, secrets, and bindings. Configure
   Next's empty `ACCUSTANDARD_BASE_PATH` at build time for this root hostname.
4. In Cloudflare **Workers & Pages**, import the GitHub repository, choose the
   production branch and repo root, set the build command to the repository's
   validated static build, and set the deploy command to the reviewed Wrangler
   deploy command. Inspect the first build logs and `workers.dev` preview.
   GitHub pushes trigger builds only after this connection is configured.
5. Create only resources used by implemented Worker code. For each resource,
   use **Worker > Settings > Bindings > Add** or the corresponding Wrangler
   declaration: R2 bucket, D1 database, KV namespace, or Hyperdrive config.
   Put secret values in Workers runtime secrets, never in Git or public
   `NEXT_PUBLIC_` variables. A binding name/ID is configuration, not a secret.
6. Test static assets, API reads and mutations, failure behavior, and preview
   bindings. Then remove the existing Tunnel CNAME/hostname route for
   `accustandard.delegateops.business` and add that hostname as the Worker's
   Custom Domain. Cloudflare does not allow a Worker Custom Domain on a
   hostname with an existing CNAME. Recheck HTTPS and every public API route.

See [Workers Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/),
[Worker Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/),
and [runtime bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/).
This is an option assessment, not a Cloudflare account change.

## Manual binding checklist if a matching feature is implemented

Complete the Worker migration and deploy working code first. A binding alone
does not create an API feature. Use separate demo resources and never bind
production data to this public role-simulation demo.

1. **R2:** In **Storage & databases > R2**, activate R2 if needed, create a
   demo bucket, then add an R2 Bucket binding in **Worker > Settings >
   Bindings**. Use `env.<binding>` through the Workers R2 API. For an external
   S3 client, use R2's S3 endpoint and an R2 API token; that is a different
   access path from the Worker binding.
2. **D1:** Create a demo D1 database, migrate the application schema and SQL to
   SQLite semantics, then add a D1 Database binding. Worker code queries
   `env.<binding>` with prepared statements. Verify every transaction and
   seed case before replacing PostgreSQL.
3. **Hyperdrive:** Create a Hyperdrive configuration for a supported PostgreSQL
   or MySQL database. For private Mac PostgreSQL, first establish a Workers
   VPC TCP service through the Tunnel and enable database TLS as required by
   Cloudflare's private-database guide. Add the Hyperdrive binding to the
   Worker, then use its connection string in a Worker-compatible database
   driver. Disable or bypass query caching where read-after-write matters.
4. **KV:** Create a namespace and add a KV Namespace binding. Use
   `env.<binding>` only for read-heavy configuration or cache data where
   delayed visibility is acceptable; keep transaction records in SQL.
5. **Containers:** Confirm Workers Paid, build the API image for
   `linux/amd64`, implement the Worker container class and Durable Object
   binding/migration, and configure its image and instance limit. Use a
   separate persistent database; container disk is ephemeral. Configure
   Workers Builds to run `wrangler deploy` on the production branch so image
   changes deploy with Worker code.

Sources: [R2 setup](https://developers.cloudflare.com/r2/get-started/),
[D1 setup](https://developers.cloudflare.com/d1/get-started/),
[Hyperdrive private connectivity](https://developers.cloudflare.com/hyperdrive/configuration/connect-to-private-database-vpc/),
[KV setup](https://developers.cloudflare.com/kv/get-started/), and
[Containers setup](https://developers.cloudflare.com/containers/get-started/).
