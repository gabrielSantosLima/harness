---
title: Releasing the harness
description: Cut a harness release through the GitHub Action.
---

# Releasing the harness

The harness follows its own contract.

## Before releasing

- [ ] `node tests/run.mjs` is green.
- [ ] `node tests/pilot.mjs` is green.
- [ ] `node web/build.mjs --check` is green.
- [ ] `README*.md` and the docs are updated.
- [ ] The working tree is clean.

## Cut the release

```bash
gh workflow run release.yml -f bump=minor -f summary="Short summary"
```

Or choose a pre-release:

```bash
gh workflow run release.yml -f bump=prerelease -f preid=alpha -f summary="Preview"
```

## What the workflow does

1. Runs CI as a quality gate.
2. Resolves the previous `v*` tag.
3. Resolves the next version.
4. Generates notes from Conventional Commits.
5. Creates the tag.
6. Creates the GitHub release, marking `-` versions as prereleases.

## After

- Confirm the release page.
- Confirm the docs deployment, if configured.
- Confirm the tag points to the intended commit.

## Recovery

See [Release failures](../operations/release-failures.md). Never rewrite a
published tag.

## Next

- [Workflows](../reference/workflows.md)
- [Pilots](pilots.md)
