---
title: Your first setup
description: A complete walkthrough for a web project.
---

# Your first setup

This example configures a web project with full CI, a static build, GitHub Pages
deployed on release and all four skills.

## Interview

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
| Skills | All four |

## Answers file

```json
{
  "project": {
    "name": "Example",
    "slug": "example",
    "description": "An example web project.",
    "type": "web",
    "license": "MIT",
    "owner": "gabrielSantosLima",
    "repo": "gabrielSantosLima/example"
  },
  "git": {
    "commitAutonomy": "commit-and-push-when-asked",
    "defaultBranch": "main"
  },
  "quality": {
    "checks": ["npm run lint", "npm test"],
    "ciDepth": "full",
    "os": ["ubuntu-latest"]
  },
  "build": {
    "command": "npm run build",
    "artifacts": ["dist"]
  },
  "version": { "source": "tags" },
  "release": {
    "trigger": "workflow_dispatch",
    "notesLanguage": "en",
    "attachArtifacts": true
  },
  "deploy": {
    "target": "github-pages",
    "trigger": "on-release",
    "artifact": "dist"
  },
  "skills": ["commit-and-push", "release-summary", "release-cut", "add-skill"]
}
```

## Generated files

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

## Result

```text
13/13 checks passed.
```

## Next

- [After setup](after-setup.md)
- [AGENTS.md anatomy](../setup/agents-md.md)
