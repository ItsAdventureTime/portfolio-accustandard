# Backblaze B2 S3 Storage Workflow

This project uses the Backblaze B2 S3-compatible API when object storage is
needed. The existing bucket is:

```text
Bucket: bridge-ph
```

Use environment-specific object-key prefixes inside that bucket:

| Environment | Logical path | S3 object-key prefix |
| --- | --- | --- |
| Demo | `/accustandard/demo` | `accustandard/demo/` |
| Production | `/accustandard` | `accustandard/` |

The leading slash is a presentation convention. Do not include it in S3
object keys unless a specific integration explicitly requires it. Backblaze
treats folders as prefixes, not independent filesystem directories or buckets.

## Endpoint and authentication

Configure the S3 client with the region-specific Backblaze endpoint supplied
for the account, for example:

```text
https://s3.<region>.backblazeb2.com
```

Use an application key and application key ID, mapped to standard S3 settings:

```text
AWS_ACCESS_KEY_ID=<Backblaze application key ID>
AWS_SECRET_ACCESS_KEY=<Backblaze application key>
AWS_ENDPOINT_URL_S3=https://s3.<region>.backblazeb2.com
S3_BUCKET=bridge-ph
S3_PREFIX=accustandard/demo/
```

Never commit these values, put them in frontend code, or expose them through
the static export. Keep demo and production credentials separate and restrict
them to the required bucket/prefix capabilities.

Backblaze's S3-compatible API requires HTTPS and Signature Version 4. Keep the
bucket private unless a deliberate public-delivery decision is documented;
prefer short-lived pre-signed URLs for browser downloads and server-mediated
uploads.

## Naming and isolation rules

- Do not create another bucket for demo or production without an explicit
  infrastructure decision.
- Demo objects belong below `accustandard/demo/`.
- Production objects belong below `accustandard/`.
- Never place demo objects directly under `accustandard/`; that is the
  production namespace.
- Use stable sub-prefixes such as `documents/`, `attachments/`, `exports/`, or
  `imports/` only when the feature requires them.
- Validate the environment prefix server-side before upload, copy, delete, or
  list operations.
- Do not use S3 object ACLs as the primary authorization boundary; enforce
  application authorization and key-prefix restrictions.

## Current implementation boundary

The current demo does not yet include a server-backed object-storage feature.
When one is implemented, update this document and `IMPLEMENTATION_STATUS.md`.
Backblaze application credentials must remain server-side.

References:

- [Backblaze S3-Compatible API](https://www.backblaze.com/docs/cloud-storage-s3-compatible-api)
- [Calling the Backblaze S3-Compatible API](https://www.backblaze.com/docs/en/cloud-storage-call-the-s3-compatible-api)
- [Backblaze S3-Compatible App Keys](https://www.backblaze.com/docs/cloud-storage-s3-compatible-app-keys)
- [Backblaze Buckets and virtual folders](https://www.backblaze.com/docs/cloud-storage-buckets)
