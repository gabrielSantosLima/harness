---
title: Requirements
description: What you need before configuring a project.
---

# Requirements

## On your machine

- **Node.js 20 or newer** — renderer, verifier and release scripts.
- **Git** — the target must be a git repository to receive the `.agent`
  submodule.
- **GitHub CLI (`gh`)** — to cut releases and inspect workflow runs.
- **SSH access to GitHub**, or the HTTPS URL for the harness.

## In the target repository

- A `git` repository with a remote.
- Permission to add a submodule (`.agent`).
- The default branch you want to use, usually `main`.

## In GitHub

- Actions enabled.
- Pages source set to **GitHub Actions** if you deploy.
- Any secrets your build needs, added by you.

## Not required

- No runtime dependency is installed in the target.
- No package manager is assumed.
- No framework or language toolchain is assumed.

## Next

- [Remote quick start](remote.md)
- [Local quick start](local.md)
