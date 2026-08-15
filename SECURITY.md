# Security Policy & Internal Controls

**Source of truth:** The confirmed acceptance handoff governs business control
requirements; `IMPLEMENTATION_STATUS.md` governs current runtime evidence;
`implementation_plan.md` governs UI/UX scope. The demo is not a production
security boundary.

## Current implementation boundary

The demo API is not an authenticated production system. Its protected routes
now require `APP_ENV=demo` plus a valid `X-Demo-Role` header, and approval
handlers derive the simulated actor from that request context rather than a
JSON role field. This is an explicit demo boundary, not authentication: the
header can be forged by a demo caller. Outside demo mode, protected routes
fail closed with service-unavailable until a trusted identity provider is
configured. Attachment authorization, idempotency, and immutable audit
guarantees remain incomplete. Do not expose the demo database or handle real
company data.

The Go service defaults to an explicit origin allowlist and disables credential
sharing. Production deployment must set `CORS_ALLOWED_ORIGINS` deliberately,
use same-origin Caddy routing where possible, and add authenticated sessions or
OIDC before handling real company data.

See `IMPLEMENTATION_STATUS.md` for the audited runtime boundary and the
acceptance claims that remain unverified.

The backend image intentionally does not contain a `DATABASE_URL` default.
The demo Quadlet supplies a disposable demo-only connection string at runtime;
those fixture credentials must never be reused for production. Production
must inject rotated database secrets through an external secret source before
the service is considered deployable.

At **Accustandard Medical and Diagnostic Supplies Corporation**, system security, commit verification, and fraud control are core engineering requirements.

---

## 🔒 Security Principles

### 1. Fraud Control & Access Locks
- **Role-Based Access Control (RBAC):** Navigation and document actions are role-scoped in the demo, and protected API routes require the explicit demo boundary; production identity enforcement still requires authentication middleware.
- **Audit Logging:** Implemented server mutations create audit records, while end-to-end immutability and coverage are acceptance gaps rather than production guarantees.
- **Strict Hard-Blocking:** The Go receiving endpoint rejects over-receipt atomically, and PO creation enforces the Class 3 linked-customer-PO control. Other controls remain subject to the documented demo boundary.

### 2. Commit Integrity & Remote Protocol Standards
- **GitHub repository synchronization:** Follow
  [`PROJECT_UPDATE_STANDARD.md`](PROJECT_UPDATE_STANDARD.md) and
  [`GITHUB_HTTPS_WORKFLOW.md`](GITHUB_HTTPS_WORKFLOW.md). Use authenticated
  `gh api` Git Database calls over HTTPS for remote Git objects and refs. Local
  staging and commits use local Git because `gh` has no local commit command.
  Never use SSH remotes, SSH keys, `gh ssh-key`, passkeys, or direct `git push`.
  HTTPS transport does not replace code review or acceptance evidence. VPS
  deployment transfer is a separate user-run SSH/rsync operation.
- **Local working tree:** Preserve and review changes before any remote action.
  A local commit is not evidence that the application passed the acceptance
  matrix.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or security bug within this repository, please report it privately:

1. **Email:** Send details to `security@accustandard.com.ph` or contact your DelegateOps technical representative directly.
2. **Do Not Open Public Issues:** Please refrain from opening public GitHub issues for security vulnerabilities.
3. **Response Timeline:** We will acknowledge receipt of your report within 24 hours and provide an estimated timeline for resolution.

Thank you for keeping Accustandard secure!
