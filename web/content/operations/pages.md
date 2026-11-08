---
title: GitHub Pages checklist
description: Enable Pages and verify a deploy.
---

# GitHub Pages checklist

## One-time setup

1. Repository Settings → Pages.
2. Source: **GitHub Actions**.
3. Confirm the default branch.
4. If the site lives under a subpath, make the build use relative URLs or the
   correct base path.

## Generated workflow

`deploy.yml`:

- `configure-pages@v5`;
- `upload-pages-artifact@v3` with the artifact directory;
- `deploy-pages@v4` in the `github-pages` environment.

## Verify

- The workflow run is green.
- The environment URL opens.
- Deep links work (404 fallback or router configuration).
- Assets load from the correct base path.

## Common problems

| Problem | Fix |
| --- | --- |
| 404 on refresh | Add a `404.html` fallback or use hash routing |
| Blank page | Wrong base path for assets |
| Deploy skipped | `workflow_run` requires a successful release |
| Permission denied | Pages source is not GitHub Actions |

## Next

- [Deploy](../setup/deploy.md)
- [Workflows](../reference/workflows.md)
