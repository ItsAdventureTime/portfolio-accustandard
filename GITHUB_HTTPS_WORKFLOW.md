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

`gh` does not provide a separate `gh push` command. The supported GitHub CLI
workflow is `gh auth setup-git`, which configures Git to use the authenticated
GitHub CLI credential helper; the resulting `git push` uses the HTTPS remote.

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

## Commit and synchronize a branch

```bash
git status --short
git add <changed-files>
git commit -m "<conventional commit message>"
gh auth setup-git --hostname github.com
git push --set-upstream origin <branch-name>
```

For a pull request, use the authenticated CLI after the branch is pushed:

```bash
gh pr create --fill
```

`gh repo sync` is for synchronizing a fork with its upstream repository; it is
not a replacement for pushing the current local branch.

## Verification

```bash
git remote get-url origin
gh auth status --active --hostname github.com
git status --short
```

The remote URL must begin with `https://`, and `gh auth status` must report the
active `github.com` account before any remote operation.

## Official references

- [`gh auth setup-git`](https://cli.github.com/manual/gh_auth_setup-git)
- [`gh auth login`](https://cli.github.com/manual/gh_auth_login)
- [`gh auth status`](https://cli.github.com/manual/gh_auth_status)
- [GitHub remote repositories](https://docs.github.com/en/get-started/git-basics/about-remote-repositories)
