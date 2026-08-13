# GitHub HTTPS Workflow

This is the canonical guide for synchronizing this repository with GitHub.
Operational guides should link here instead of redefining the protocol.

## Required transport

- Authenticate with the official GitHub CLI (`gh`) on `github.com`.
- Use the HTTPS Git remote:
  `https://github.com/ItsAdventureTime/bridge-accustandard.git`.
- Never use `git@github.com:...`, `ssh://...`, SSH keys, `gh ssh-key`, or
  passkeys for repository synchronization.
- VPS deployment transfer is a separate, user-run SSH/rsync operation. This
  repository workflow never asks Codex to open that connection.

`gh` does not provide a separate `gh push` command. Local staging and commits
still use the local Git repository, but all GitHub-side inspection and remote
publication for this project must use the authenticated `gh` CLI over HTTPS.
Use `gh pr create` to publish the current branch and open its review request;
do not invoke `git push` directly for this workflow.

## One-time or recovery setup

```bash
gh auth status --active --hostname github.com
gh config set git_protocol https --host github.com
gh auth setup-git --hostname github.com
git remote set-url origin https://github.com/ItsAdventureTime/bridge-accustandard.git
git remote get-url origin
```

If authentication is not already present, use `gh auth login --git-protocol
https --skip-ssh-key` and complete the browser/device flow. Do not generate or
register an SSH key.

## Commit locally and publish through `gh`

```bash
git status --short
git add <changed-files>
git commit -m "<conventional commit message>"
gh auth status --active --hostname github.com
gh pr create --base main --fill
```

`gh pr create` may ask to publish an unpushed current branch; approve that
prompt only after confirming the branch and HTTPS authentication. `gh repo
sync` is for synchronizing a fork with its upstream repository and is not part
of this branch publication workflow.

## Verification

```bash
gh auth status --active --hostname github.com
gh repo view --json nameWithOwner,url,defaultBranchRef
gh pr view --json number,url,state,headRefName,baseRefName
git status --short
```

`gh repo view` must report the expected HTTPS GitHub repository, and
`gh auth status` must report the active `github.com` account before any remote
operation. This guide does not authorize VPS deployment transport; the
separate deployment guide's user-run SSH/rsync transfer remains operationally
distinct from GitHub synchronization.

## Official references

- [`gh auth setup-git`](https://cli.github.com/manual/gh_auth_setup-git)
- [`gh auth login`](https://cli.github.com/manual/gh_auth_login)
- [`gh auth status`](https://cli.github.com/manual/gh_auth_status)
- [GitHub remote repositories](https://docs.github.com/en/get-started/git-basics/about-remote-repositories)
