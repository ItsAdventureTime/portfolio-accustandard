# Security Policy & Internal Controls

At **Accustandard Medical and Diagnostic Supplies Corporation**, system security, commit verification, and fraud control are core engineering requirements.

---

## 🔒 Security Principles

### 1. Fraud Control & Access Locks
- **Role-Based Access Control (RBAC):** Navigation and document actions are strictly scoped to the user's role.
- **Immutable Audit Logging:** Every approval step, system override, and record modification is permanently logged with timestamps and user identifiers.
- **Strict Hard-Blocking:** Over-receiving supplier shipments or generating POs for Class 3 short-expiry items without customer POs is hard-blocked at the application layer.

### 2. Commit Integrity & Remote Protocol Standards
- **Local Commits:** All local commits must be signed using valid SSH keys (`git commit -S`) verified against GitHub user profiles.
- **Remote Synchronization:** Remote operations must use the official GitHub CLI (`gh`) over **HTTPS** (`https://github.com/ItsAdventureTime/bridge-accustandard.git`), authenticated via default `gh auth` credentials.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or security bug within this repository, please report it privately:

1. **Email:** Send details to `security@accustandard.com.ph` or contact your DelegateOps technical representative directly.
2. **Do Not Open Public Issues:** Please refrain from opening public GitHub issues for security vulnerabilities.
3. **Response Timeline:** We will acknowledge receipt of your report within 24 hours and provide an estimated timeline for resolution.

Thank you for keeping Accustandard secure!
