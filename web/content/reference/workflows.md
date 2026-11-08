---
title: Workflows
description: Triggers, inputs and permissions of the generated workflows.
---

# Workflows

## ci.yml

Triggers: push to the default branch, pull request, `workflow_call`.

- `quality`: runs the recorded checks on the OS matrix.
- `build`: only for `full`; runs the build and uploads artifacts.
- With no checks, the job fails on purpose.

Permissions: `contents: read`.

## build.yml

Only for `full`.

Triggers: `workflow_dispatch` and `workflow_call`, both with an optional `tag`.

- Builds, uploads artifacts.
- With a tag, attaches the artifacts to the release with `gh release upload`.

Permissions: `contents: write`.

## release.yml

Trigger: `workflow_dispatch`.

Inputs:

| Input | Default | Meaning |
| --- | --- | --- |
| `bump` | `patch` | patch, minor, major or a pre-release type |
| `preid` | `alpha` | Pre-release identifier |
| `version` | empty | Explicit version, overrides the bump |
| `summary` | empty | Short release summary |

Flow: optional quality job → resolve previous tag → resolve version → generate
notes → optional bump commit → tag → `gh release create`.

Permissions: `contents: write`. Concurrency group `release`.

## deploy.yml

Only for `github-pages`.

Triggers: `workflow_run` after a successful release, push to `main`, or
`workflow_dispatch`, depending on the answer.

Permissions: `contents: read`, `pages: write`, `id-token: write`.

## Secrets

| Secret | Used by |
| --- | --- |
| `GITHUB_TOKEN` | Tags, releases, Pages, artifact upload |

Add project-specific secrets manually; the harness never stores them.

## Next

- [Release template](release-template.md)
- [Pages checklist](../operations/pages.md)
