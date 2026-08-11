# Security Policy & Internal Controls

## Current implementation boundary

The demo API is not an authenticated production system. RBAC and approval
identity are not yet enforced by authentication middleware, and attachment
authorization, idempotency, and immutable audit guarantees remain incomplete.
Do not expose the demo database or treat a role field in a request payload as
proof of identity.

The Go service defaults to an explicit origin allowlist and disables credential
sharing. Production deployment must set `CORS_ALLOWED_ORIGINS` deliberately,
use same-origin Caddy routing where possible, and add authenticated sessions or
OIDC before handling real company data.

See `IMPLEMENTATION_STATUS.md` for the audited runtime boundary and the
acceptance claims that remain unverified.

At **Accustandard Medical and Diagnostic Supplies Corporation**, system security, commit verification, and fraud control are core engineering requirements.

---

## 🔒 Security Principles

### 1. Fraud Control & Access Locks
- **Role-Based Access Control (RBAC):** Navigation and document actions are role-scoped in the demo, but production identity enforcement still requires authentication middleware.
- **Audit Logging:** Implemented server mutations create audit records, while end-to-end immutability and coverage are acceptance gaps rather than production guarantees.
- **Strict Hard-Blocking:** The Go receiving endpoint rejects over-receipt atomically, and PO creation enforces the Class 3 linked-customer-PO control. Other controls remain subject to the documented demo boundary.

### 2. Commit Integrity & Remote Protocol Standards
- **Remote synchronization for this repository:** Use only the official GitHub
  CLI (`gh`) over authenticated HTTPS. Do not use `git push`, SSH remotes, SSH
  keys, passkeys, or signing claims as a substitute for review.
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
