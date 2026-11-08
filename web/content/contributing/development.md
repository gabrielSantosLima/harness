---
title: Development
description: Run the tests, pilots and docs build.
---

# Development

## Requirements

- Node.js 20 or newer.
- Git.

## Tests

```bash
node tests/run.mjs
node tests/pilot.mjs
```

`tests/run.mjs` covers rendering, verification, merge behavior, versioning,
release notes, negative cases and GitHub expression preservation.

`tests/pilot.mjs` creates real temporary git repositories and exercises new,
adopt and update flows, including the `.agent` submodule and sparse checkout.

## Docs

```bash
node web/build.mjs --check
```

Builds `web/dist`, verifies internal links and fails on a missing page.

## Rules

- Every change to `templates/`, `guidelines/` or `scripts/` must keep both suites
  green for all five project types.
- The renderer must stay deterministic: no timestamps, no network, no
  environment-dependent output.
- Never add stack, framework or architecture guidance to templates.

## Next

- [Templates](templates.md)
- [Releasing](releasing.md)
