---
title: CI, build and deploy
description: CI depth, checks, artifacts, deploy targets and Pages.
---

# CI, build and deploy

## CI depth

| Depth | Generated | Effect |
| --- | --- | --- |
| `full` | `ci.yml` + `build.yml` | Checks gate the release; artifacts attach to it |
| `ci` | `ci.yml` | Checks gate the release; no artifacts |
| `release-only` | `release.yml` | No gates; recorded as a known gap |

The question is asked for every project. Choose by maturity, not by stack.

## Checks

Checks are free-text commands stored in `.harness.json` and reused in
`AGENTS.md`, `ci.yml`, the `commit-and-push` skill and verification.

If no checks exist, CI fails on purpose:

```yaml
- name: Checks not configured
  run: |
    echo "No check commands are configured in .harness.json." >&2
    exit 1
```

Configure real commands instead, for example `npm run lint`, `npm test`,
`cargo clippy -- -D warnings`, `ruff check .` or `python etl/validar.py`.

## OS matrix

One Linux runner by default. Add Windows or macOS when the project ships there.
The matrix also applies to the build job.

## Build and artifacts

For `full`, provide a build command and artifact paths. The build job uploads
the artifacts and, with a tag, attaches them to the GitHub release.

```yaml
build:
  command: npm run build
  artifacts: ["dist"]
  attachToRelease: true
```

## Deploy

Deploy is asked only for `web` and `data`.

| Target | Result |
| --- | --- |
| `github-pages` | Generates `deploy.yml` with Pages actions |
| `other` | No workflow; document the host |
| `none` | No deploy |

| Trigger | Behavior |
| --- | --- |
| `on-release` | After a successful `Release`, checking out the released tag |
| `on-push` | On every push to the default branch |
| `manual` | `workflow_dispatch` only |

## GitHub Pages checklist

1. Settings → Pages → Source = **GitHub Actions**.
2. The artifact directory exists after the build.
3. Use relative URLs, because a project site is served from `/<repo>/`.
4. For single-page apps, add a `404.html` fallback or use hash routing.
5. Confirm assets load from the correct base path.

The generic `deploy.yml` uses `configure-pages@v5`,
`upload-pages-artifact@v3` and `deploy-pages@v4`.

## Release failures

| Symptom | Cause | Fix |
| --- | --- | --- |
| Quality job failed | Checks failed | Fix and re-run |
| Tag already exists | Version collision | Cut a new patch |
| Artifacts missing | Wrong paths | Fix the build |
| Release exists | Partial run | Recreate from the tag or cut a new patch |

Never move or reuse a published tag. Never force-push to repair a release.

## Next

- [Configuration](configuration.md)
- [Skills](../skills/skills.md)
