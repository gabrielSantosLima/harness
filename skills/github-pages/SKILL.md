---
name: GitHub Pages
description: Publish a static site, an existing HTML/CSS/JS folder, or generated documentation to GitHub Pages. Use when the user asks to enable Pages, create a Pages workflow, deploy a site, or publish documentation.
---

# GitHub Pages

Set up a GitHub Pages deployment for a static site. Ask before choosing what to
publish; never assume the repository already has a site.

## 1. Inspect the repository

Look for:

- `index.html`, `404.html`;
- folders such as `docs/`, `public/`, `site/`, `dist/`, `build/`;
- build manifests and scripts (`package.json`, `Makefile`, `pyproject.toml`, ...);
- existing workflows under `.github/workflows/`;
- an existing Pages deployment or `CNAME`.

Report what you found before asking.

## 2. Ask what to publish

Ask a single-selection question:

1. **Existing static site** already committed (HTML/CSS/JS at the repository
   root or in a folder).
2. **A static folder** such as `docs/`, `public/` or `site/`.
3. **A build command** that produces a directory, such as a site generator.
4. **Generate documentation** from Markdown or another source.

If the answer is 4 and the repository has no documentation generator, ask a
second question:

- use a generator the user already chose;
- add a minimal dependency-free Markdown builder;
- stop and let the user decide later.

Never add a framework or dependencies silently.

## 3. Ask deployment details

- Branch to deploy from (default: the default branch).
- Trigger: on push to that branch (default), on release, or manual only.
- Published directory (`PUBLISH_DIR`).
- Build command (`BUILD_COMMAND`), when any.
- Whether the site is a single-page app that needs a `404.html` fallback.

## 4. Check the base path

A project site is served from `/<repo>/`, not from the domain root.

- Prefer relative URLs in HTML, CSS and JavaScript.
- If a generator needs a base path, configure it for `/<repo>/`.
- Do not hardcode `localhost` or the domain root.

## 5. Create the workflow

Create `.github/workflows/pages.yml`. Adjust names, commands and paths:

```yaml
name: Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: |
          <BUILD_COMMAND>
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: <PUBLISH_DIR>

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Remove the build step when there is no build command.

## 6. Handle common cases

- **Single-page app**: copy `index.html` to `404.html` in the build, or use hash
  routing.
- **Artifact must be a directory**: `upload-pages-artifact` does not accept a
  single file. Stage the site into one directory if needed.
- **Root deployment**: prefer a dedicated folder over `.`, so the artifact does
  not include the repository, workflows or secrets-adjacent files.
- **Existing workflow**: if one already deploys Pages, diff it and ask before
  replacing it.

## 7. Verify

- The build command succeeds locally, when one exists.
- `PUBLISH_DIR` exists after the build.
- `index.html` exists in the artifact.
- Internal assets use relative URLs or the correct base path.
- No secret or local environment file is inside the artifact.

## 8. Hand off

Tell the user to set **Settings → Pages → Source** to **GitHub Actions**. Report:

- the workflow file;
- the trigger and branch;
- the published directory;
- the expected URL: `https://<owner>.github.io/<repo>/`;
- anything that must be adjusted in the site's build.

Do not commit, push or tag unless the user asks.

## Boundaries

- Never add a framework or dependency without explicit approval.
- Never overwrite an existing Pages workflow without approval.
- Never store secrets in the workflow.
- Never change application code beyond the minimum required to build the site.
