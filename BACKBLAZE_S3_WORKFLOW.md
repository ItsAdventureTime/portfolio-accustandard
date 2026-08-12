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

## Manual VPS deployment commands

Run these commands on the VPS after connecting through your normal SSH
workflow. Do not run them from the macOS checkout, and do not put credentials
in Git, Quadlet files committed to this repository, or frontend environment
variables.

### 1. Configure an AWS CLI profile

Install/use AWS CLI v2 on the VPS, then create a profile using the Backblaze
application key ID and application key. The region must match the bucket's
Backblaze endpoint.

```bash
export B2_PROFILE=b2-bridge-ph
export B2_REGION=<backblaze-region>
export B2_ENDPOINT="https://s3.${B2_REGION}.backblazeb2.com"

aws configure --profile "${B2_PROFILE}"
# AWS Access Key ID: <Backblaze application key ID>
# AWS Secret Access Key: <Backblaze application key>
# Default region name: ${B2_REGION}
# Default output format: json
```

Alternatively, store the credentials in the VPS user's protected AWS
credential/config files or an approved secret manager. Never echo or commit
the secret key.

### 2. Validate the bucket and create optional prefix markers

Backblaze folders are virtual prefixes. Uploading an object creates the prefix
implicitly, so marker objects are optional. If an operator wants visible empty
folders in a console, create zero-byte marker objects:

```bash
aws --profile "${B2_PROFILE}" --endpoint-url "${B2_ENDPOINT}" \
  s3api head-bucket --bucket bridge-ph

aws --profile "${B2_PROFILE}" --endpoint-url "${B2_ENDPOINT}" \
  s3api put-object --bucket bridge-ph --key accustandard/demo/

aws --profile "${B2_PROFILE}" --endpoint-url "${B2_ENDPOINT}" \
  s3api put-object --bucket bridge-ph --key accustandard/
```

The `put-object` commands do not create buckets. They create optional
zero-byte prefix markers in the existing `bridge-ph` bucket.

### 3. Upload environment-scoped files

Use an explicit prefix in every destination. The default is intentionally
non-destructive; do not add `--delete` unless the source is a complete,
reviewed mirror of that one environment prefix.

```bash
# Demo
aws --profile "${B2_PROFILE}" --endpoint-url "${B2_ENDPOINT}" \
  s3 sync ./release-assets/ \
  s3://bridge-ph/accustandard/demo/ \
  --only-show-errors

# Production (run only with production credentials and reviewed assets)
aws --profile "${B2_PROFILE}" --endpoint-url "${B2_ENDPOINT}" \
  s3 sync ./release-assets/ \
  s3://bridge-ph/accustandard/ \
  --only-show-errors
```

Verify the resulting prefix without listing the other environment:

```bash
aws --profile "${B2_PROFILE}" --endpoint-url "${B2_ENDPOINT}" \
  s3api list-objects-v2 --bucket bridge-ph \
  --prefix accustandard/demo/ --max-items 20
```

Use separate restricted app keys for the two prefixes when possible. Backblaze
supports bucket and file-name-prefix restrictions; a key used for demo should
not be able to write to `accustandard/` production objects.

## Current implementation boundary

The current demo does not yet include a server-backed object-storage feature.
When one is implemented, update this document and `IMPLEMENTATION_STATUS.md`.
Backblaze application credentials must remain server-side.

References:

- [Backblaze S3-Compatible API](https://www.backblaze.com/docs/cloud-storage-s3-compatible-api)
- [Calling the Backblaze S3-Compatible API](https://www.backblaze.com/docs/en/cloud-storage-call-the-s3-compatible-api)
- [Backblaze S3-Compatible App Keys](https://www.backblaze.com/docs/cloud-storage-s3-compatible-app-keys)
- [Backblaze Buckets and virtual folders](https://www.backblaze.com/docs/cloud-storage-buckets)
