---
title: Getting started
description: Requirements, quick starts, your first setup, and updates.
---

# Getting started

## Requirements

- **Node.js 20+** for the renderer, verifier and release scripts.
- **Git**, with submodule support in the target repository.
- **GitHub CLI (`gh`)** to cut releases and inspect runs.
- **SSH or HTTPS access** to the harness repository.

The target must be a git repository with a remote. No runtime dependency, package
manager, framework or language toolchain is assumed.

## Quick start: remote

Paste this into the agent running in the target repository:

```text
Use the harness at https://github.com/gabrielSantosLima/harness to configure this
repository. Read setup/PROMPT.md from that repository and follow it exactly.
```

The agent clones the harness into a temporary directory, detects the repository,
interviews you, shows the plan, renders, verifies and removes the clone. It never
commits, pushes or tags.

Use this mode when you want the full setup: `AGENTS.md`, `.harness.json`, CI,
release automation and `.agent/skills`.

To run only one skill, see [Run a skill remotely](../skills/skills.md#run-a-skill-remotely).

## Quick start: local

```bash
git clone https://github.com/gabrielSantosLima/harness.git
cd harness

node scripts/render.mjs \
  --answers <answers.json> \
  --target <path-to-project> \
  --merge \
  --submodule https://github.com/gabrielSantosLima/harness.git \
  --commit "$(git rev-parse HEAD)"

node scripts/verify-setup.mjs <path-to-project>
```

Add `--dry-run` first to review the actions. `--merge` preserves an existing
`AGENTS.md`. The renderer never commits.

## Your first setup

A complete web project example:

| Question | Answer |
| --- | --- |
| Project type | `web` |
| Commit autonomy | Commit and push when asked |
| Checks | `npm run lint`, `npm test` |
| CI depth | `full` |
| Build | `npm run build`, artifact `dist` |
| Version source | Tags only |
| Release notes | English |
| Deploy | GitHub Pages, on release |
| Skills | All defaults |

Generated files:

```text
AGENTS.md
.harness.json
.agent/                        submodule, skills only
docs/RELEASE_TEMPLATE.md
scripts/release-notes.mjs
scripts/next-version.mjs
.github/workflows/ci.yml
.github/workflows/build.yml
.github/workflows/release.yml
.github/workflows/deploy.yml
.github/pull_request_template.md
.github/CODEOWNERS
.gitignore
```

The result ends with `13/13 checks passed`.

## After setup

1. Review `git status` and the diff. Application code must be untouched.
2. Confirm the commands, commit autonomy, version source and deploy target in
   `AGENTS.md` and `.harness.json`.
3. Commit using the project's policy.
4. In GitHub: enable Actions, set Pages source to **GitHub Actions** when you
   deploy, add secrets and configure branch protection.
5. Cut the first release:

```bash
gh workflow run release.yml -f bump=minor -f summary="Initial release"
```

The first release is `v0.1.0`.

## Updates

```bash
git submodule update --remote .agent
node scripts/render.mjs --answers .harness.json --target . --merge
node scripts/verify-setup.mjs .
```

Review the diff before committing. Existing workflows are skipped, not
overwritten. For a read-only drift report, see
[Auditing drift](../maintain/operations.md#auditing-drift).

## Next

- [How it works](how-it-works.md)
- [Configuration](../configure/configuration.md)
