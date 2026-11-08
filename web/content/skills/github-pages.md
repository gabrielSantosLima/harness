---
title: github-pages
description: Set up a GitHub Pages deployment for a static site, a folder of HTML/CSS/JS, or generated documentation.
---

# github-pages

Sets up a Pages deployment for whatever the repository actually ships. The skill
asks first; it never assumes the project already has a site.

## When to use

- Publishing an existing `index.html` and its assets.
- Publishing a folder such as `docs/`, `public/` or `site/`.
- Publishing the output of a build command.
- Generating documentation and publishing it.

## What it asks

1. What to publish:
   - existing static site;
   - a static folder;
   - a build command that produces a directory;
   - generated documentation.
2. Branch and trigger: push to the default branch, on release, or manual.
3. Published directory and, when needed, the build command.
4. Whether the site is a single-page app that needs a `404.html` fallback.

If the user wants generated documentation and there is no generator, the skill
asks whether to use an existing tool or add a minimal builder. It never adds a
framework silently.

## What it creates

`.github/workflows/pages.yml` with:

- `permissions` for Pages;
- a `build` job: checkout, optional build, `configure-pages`,
  `upload-pages-artifact`;
- a `deploy` job with the `github-pages` environment and `deploy-pages`;
- the trigger chosen by the user.

## What it checks

- `PUBLISH_DIR` exists after the build.
- `index.html` exists in the artifact.
- Assets use relative URLs or the correct base path.
- No secret or local environment file is inside the artifact.
- An existing Pages workflow is diffed, not replaced silently.

## Manual step

Set **Settings → Pages → Source** to **GitHub Actions**. The expected URL is
`https://<owner>.github.io/<repo>/`.

## Boundaries

- No framework or dependency without approval.
- No secret in the workflow.
- No overwrite of an existing workflow without approval.
- No commit, push or tag unless asked.

## Source

[`skills/github-pages/SKILL.md`](https://github.com/gabrielSantosLima/harness/blob/main/skills/github-pages/SKILL.md)

## Next

- [Run a skill remotely](remote.md)
- [Pages checklist](../operations/pages.md)
