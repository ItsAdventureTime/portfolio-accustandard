# Backblaze B2 Storage Workflow

This project uses Backblaze B2 for object storage when needed. The primary
operator workflow is Backblaze's native `b2` command-line tool, not AWS CLI.
The existing bucket is:

```text
Bucket: bridge-ph
```

Use environment-specific object-key prefixes inside that bucket:

| Environment | Object-key prefix |
| --- | --- |
| Demo | `accustandard/demo/` |
| Production | `accustandard/` |

These are object-key prefixes, not independent filesystem directories or
buckets. Object keys must not begin with `/`. The `b2://` scheme is the only
prefix syntax in the commands below; the key after the bucket name starts with
`accustandard/`.

## Security and application keys

Keep Backblaze application credentials out of Git, frontend code, static
exports, and shell history. Use separate, prefix-restricted application keys:

| Key | Bucket restriction | File-name prefix |
| --- | --- | --- |
| Demo operator | `bridge-ph` | `accustandard/demo/` |
| Production operator | `bridge-ph` | `accustandard/` |

Grant each key only the capabilities required for its workflow. The key used
with the commands below must include `listBuckets` so the CLI can resolve the
bucket name; upload and verification also require the corresponding file
capabilities. Do not reuse the demo key for production or the production key
for demo work.

Backblaze folders are virtual prefixes. Uploading an object creates the prefix
implicitly, so empty-folder marker objects are not required. Never place demo
objects directly under `accustandard/`; that namespace is reserved for
production objects.

## Primary operator workflow: native `b2` CLI

Run these commands from the approved operator environment. Do not put the
application key in a committed file or frontend environment variable.

### 1. Install and authorize the CLI

Install the Backblaze B2 CLI using an approved installation method. Backblaze
recommends Homebrew on macOS:

```bash
brew install b2-tools
```

Then authorize the selected prefix-restricted application key. Enter the key
ID and application key when prompted; do not add secrets to the command line:

```bash
b2 account authorize
```

Confirm that the existing bucket is visible. Do not create another bucket for
demo or production:

```bash
b2 bucket list
```

The output must include `bridge-ph` before continuing.

### 2. Sync a directory to an environment prefix

Use an explicit prefix in every destination. The normal sync is intentionally
non-destructive: do not add `--delete` by default.

```bash
# Demo: authorize the demo key first
b2 sync ./release-assets/ b2://bridge-ph/accustandard/demo/

# Production: authorize the production key first and use reviewed assets
b2 sync ./release-assets/ b2://bridge-ph/accustandard/
```

Only add `--delete` after reviewing the source as a complete mirror of that
single environment prefix and explicitly approving removal of destination
objects. Never use it to reconcile demo and production together.

### 3. Upload one file when a full sync is unnecessary

Use `b2 file upload` with the bucket name, local path, and complete object key.
The object key has no leading slash:

```bash
# Demo example
b2 file upload bridge-ph ./release-assets/logo.svg \
  accustandard/demo/assets/logo.svg

# Production example
b2 file upload bridge-ph ./release-assets/logo.svg \
  accustandard/assets/logo.svg
```

### 4. Verify the target prefix

List the selected prefix after a sync or upload. Use the non-recursive form for
a top-level check and `--recursive` for all objects below the prefix:

```bash
# Demo: authorize the demo key first
b2 ls b2://bridge-ph/accustandard/demo/
b2 ls --recursive b2://bridge-ph/accustandard/demo/

# Production: authorize the production key first
b2 ls b2://bridge-ph/accustandard/
b2 ls --recursive b2://bridge-ph/accustandard/
```

Confirm that every listed object has the expected environment prefix and that
no object key begins with `/`.

## Optional interoperability note: S3-compatible API

This is an optional compatibility path for an existing S3-aware SDK or tool.
It is not the primary operator workflow for this project. Use the Backblaze
S3-compatible endpoint for the bucket's region and an application key that is
valid for the target prefix:

```text
AWS_ACCESS_KEY_ID=<Backblaze application key ID>
AWS_SECRET_ACCESS_KEY=<Backblaze application key>
AWS_ENDPOINT_URL_S3=https://s3.<region>.backblazeb2.com
S3_BUCKET=bridge-ph
S3_PREFIX=accustandard/demo/
```

S3 clients use HTTPS and Signature Version 4. Keep the same bucket, prefix,
no-leading-slash, credential-separation, and non-destructive defaults. Use an
S3-compatible client only when the integration requires the S3 protocol; do
not replace the native `b2` workflow with AWS CLI for routine operator work.

## Current implementation boundary

The current demo does not yet include a server-backed object-storage feature.
When one is implemented, update this document and `IMPLEMENTATION_STATUS.md`.
Backblaze application credentials must remain server-side.

References:

- [Install the Backblaze B2 Command-Line Tool](https://www.backblaze.com/docs/cloud-storage-command-line-tools)
- [Backblaze B2 Command-Line Tool documentation](https://b2-command-line-tool.readthedocs.io/en/master/)
- [Use the B2 Sync command](https://www.backblaze.com/docs/cloud-storage-use-the-b2-sync-command-with-the-cli)
- [Upload files with the B2 Command-Line Tool](https://www.backblaze.com/docs/cloud-storage-upload-files-with-the-cli)
- [Backblaze B2 application keys](https://www.backblaze.com/docs/en/cloud-storage-application-keys)
- [Backblaze B2 APIs](https://www.backblaze.com/docs/cloud-storage-apis)
- [Backblaze S3-Compatible API](https://www.backblaze.com/docs/cloud-storage-s3-compatible-api)
