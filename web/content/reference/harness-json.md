---
title: .harness.json reference
description: Every field of the committed setup state.
---

# .harness.json reference

Schema:
[`setup/harness.schema.json`](https://github.com/gabrielSantosLima/harness/blob/main/setup/harness.schema.json).

## Top level

| Field | Required | Values |
| --- | --- | --- |
| `harness.version` | yes | `2` |
| `harness.commit` | no | Pinned harness commit |
| `project` | yes | Name, slug, description, type |
| `git` | yes | `commitAutonomy`, `defaultBranch` |
| `quality` | yes | `checks`, `ciDepth`, `os` |
| `build` | when `full` | `command`, `artifacts`, `attachToRelease` |
| `version` | yes | `source`: `tags` or `file` |
| `release` | yes | `trigger`, `notesLanguage`, `attachArtifacts` |
| `deploy` | no | `target`, `trigger`, `artifact` |
| `skills` | yes | Selected skill IDs |
| `hygiene` | no | PR template, `CODEOWNERS`, owner |
| `ignore` | no | Local-only patterns |

## project.type

`web`, `mobile`, `desktop`, `library` or `data`.

## git.commitAutonomy

`commit-and-push-when-asked`, `commit-only-when-asked` or `strict`.

## quality.ciDepth

`full`, `ci` or `release-only`.

## version

```json
{ "source": "tags" }
```

```json
{ "source": "file", "file": "package.json", "pointer": "version" }
```

## release.notesLanguage

`en`, `pt-BR` or `es`.

## deploy.target / trigger

Targets: `none`, `github-pages`, `other`.
Triggers: `on-release`, `on-push`, `manual`.

## Minimal example

```json
{
  "harness": { "version": 2 },
  "project": {
    "name": "Example",
    "slug": "example",
    "description": "An example project.",
    "type": "library"
  },
  "git": { "commitAutonomy": "commit-and-push-when-asked", "defaultBranch": "main" },
  "quality": { "checks": ["npm test"], "ciDepth": "ci", "os": ["ubuntu-latest"] },
  "version": { "source": "tags" },
  "release": {
    "trigger": "workflow_dispatch",
    "notesLanguage": "en",
    "attachArtifacts": false
  },
  "skills": ["commit-and-push"]
}
```

## Next

- [render.mjs](render.md)
- [Setup state](../concepts/harness-json.md)
