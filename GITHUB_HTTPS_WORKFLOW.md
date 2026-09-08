# GitHub HTTPS Workflow

This is the canonical guide for synchronizing this repository with GitHub.
Operational guides should link here instead of redefining the protocol.

## Required transport

- Authenticate with the official GitHub CLI (`gh`) on `github.com`.
- Use the HTTPS Git remote:
  `https://github.com/ItsAdventureTime/portfolio-accustandard.git`.
- Never use `git@github.com:...`, `ssh://...`, SSH keys, `gh ssh-key`, or
  passkeys for repository synchronization.
- Demo runtime deployment is a separate manual image workflow; follow
  [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) rather than this GitHub
  synchronization guide.

`gh` does not provide a separate `gh push` command. Local staging and commits
still use the local Git repository because `gh` has no local commit command.
All GitHub-side inspection and remote publication for this project must use the
authenticated `gh` CLI over HTTPS. The standard direct-publication path uses
the Git Database REST endpoints through `gh api`; do not invoke `git push`.

## One-time or recovery setup

```bash
gh auth status --active --hostname github.com
gh config set git_protocol https --host github.com
gh auth setup-git --hostname github.com
git remote set-url origin https://github.com/ItsAdventureTime/portfolio-accustandard.git
git remote get-url origin
```

If authentication is not already present, use `gh auth login --git-protocol
https --skip-ssh-key` and complete the browser/device flow. Do not generate or
register an SSH key.

## Commit locally and publish through `gh api`

```bash
git status --short
git add <changed-files>
git commit -m "<conventional commit message>"
gh auth status --active --hostname github.com
```

After the local commit, publish the tree through `gh api` in this order:

1. Read the current remote `main` ref and its tree.
2. Upload changed files as Git blobs.
3. Create a tree based on the remote tree, replacing changed paths with the
   uploaded blob SHAs.
4. Create one commit with the remote commit as its parent.
5. Patch `refs/heads/main` to the new commit SHA with `force=false`.

The complete command contract and verification checklist are in
[`PROJECT_UPDATE_STANDARD.md`](PROJECT_UPDATE_STANDARD.md). `gh pr create` is
reserved for a separate pull-request review workflow; it is not the direct
publication path for this repository standard. `gh repo sync` is for syncing a
fork with its upstream and is not part of this workflow.

## Verification

```bash
gh auth status --active --hostname github.com
gh repo view ItsAdventureTime/portfolio-accustandard \
  --json nameWithOwner,url,defaultBranchRef
gh api repos/ItsAdventureTime/portfolio-accustandard/git/ref/heads/main \
  --jq '.object.sha'
git status --short
```

`gh repo view` must report the expected HTTPS GitHub repository, and
`gh auth status` must report the active `github.com` account before any remote
operation. Runtime deployment remains operationally distinct from GitHub
synchronization and is documented in [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md).

## Official references

- [`gh auth setup-git`](https://cli.github.com/manual/gh_auth_setup-git)
- [`gh auth login`](https://cli.github.com/manual/gh_auth_login)
- [`gh auth status`](https://cli.github.com/manual/gh_auth_status)
- [GitHub Git database REST API](https://docs.github.com/en/rest/git)
- [GitHub remote repositories](https://docs.github.com/en/get-started/git-basics/about-remote-repositories)
