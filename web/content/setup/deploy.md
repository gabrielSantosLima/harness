---
title: Deploy
description: Deploy targets and triggers, currently focused on GitHub Pages.
---

# Deploy

Deploy is asked only for `web` and `data` projects.

## Targets

| Target | Result |
| --- | --- |
| `github-pages` | Generates `deploy.yml` with Pages actions |
| `other` | No workflow generated; document the host in `AGENTS.md` |
| `none` | No deploy |

## Triggers

| Trigger | Behavior |
| --- | --- |
| `on-release` | Deploys after a successful `Release` workflow, checking out the released tag |
| `on-push` | Deploys on every push to the default branch |
| `manual` | `workflow_dispatch` only |

## GitHub Pages requirements

1. Repository Settings → Pages → Source = **GitHub Actions**.
2. The artifact directory must exist after the build.
3. Use relative URLs so the site works under `/<repo>/`.

## Base path

A project site is served from `/<repo>/`, not from the domain root. The deploy
workflow does not rewrite paths for you; configure your build accordingly or use
relative URLs.

## Next

- [Pages checklist](../operations/pages.md)
- [Workflows reference](../reference/workflows.md)
