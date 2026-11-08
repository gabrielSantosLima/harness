---
title: CI and build
description: Choosing a CI depth, OS matrix, build and artifacts.
---

# CI and build

## Depth

| Depth | Generated | Effect |
| --- | --- | --- |
| `full` | `ci.yml` + `build.yml` | Checks gate the release; artifacts attach to it |
| `ci` | `ci.yml` | Checks gate the release; no artifacts |
| `release-only` | `release.yml` | No gates; recorded as a known gap |

The question is asked for every project. Choose by maturity, not by stack.

## Checks

Checks are free-text commands recorded in `.harness.json` and reused in:

- `AGENTS.md`;
- `.github/workflows/ci.yml`;
- the `commit-and-push` skill;
- verification.

If no checks exist yet, CI fails on purpose until they are configured. A silent
pass would be worse than a red build.

## OS matrix

- One Linux runner by default.
- Add Windows or macOS when the project ships there.

## Build

For `full`, provide:

- the build command;
- the artifact paths.

The build job uploads the artifacts and, on a release, attaches them to the
GitHub release.

## Next

- [Deploy](deploy.md)
- [CI not configured](../operations/ci-not-configured.md)
