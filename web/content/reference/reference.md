---
title: Reference
description: CLI flags, state fields, workflows and release template placeholders.
---

# Reference

## render.mjs

```bash
node scripts/render.mjs --answers <file> --target <dir> [flags]
```

| Flag | Effect |
| --- | --- |
| `--answers <file>` | Required JSON answers |
| `--target <dir>` | Required destination |
| `--dry-run` | Print actions, write nothing |
| `--merge` | Merge missing sections into an existing `AGENTS.md` |
| `--force` | Overwrite generated files |
| `--submodule <url>` | Add `.agent`, restricted to `skills/` |
| `--commit <hash>` | Record the harness commit |
| `--skills-root <path>` | Skill path used in `AGENTS.md` |

Actions: `create`, `overwrite`, `skipped (exists)`, `merged`, `appended`,
`unchanged`.

`.harness.json` is always rewritten. `AGENTS.md` is only merged with `--merge`.
Existing workflows are skipped unless `--force`. `.gitignore` receives only
missing entries. Exit code `0` on success, `1` on invalid input or a failed
write.

## verify-setup.mjs

```bash
node scripts/verify-setup.mjs <target>
```

Exit code `0` when every check passes, `1` otherwise.

1. `.harness.json` has the required fields.
2. `AGENTS.md` exists and is fully rendered.
3. The release template exists and uses supported placeholders.
4. The release engine exists.
5. Version tooling matches the declared source.
6. The release workflow exists and is manual.
7. CI and build workflows match the declared depth.
8. The deploy workflow matches the target.
9. Workflow commands match `.harness.json`.
10. `AGENTS.md` lists the selected skills.
11. `.agent` exposes the selected skills (note if uninitialized).
12. `.gitignore` covers the declared patterns.
13. Hygiene files match the configuration.

It does not prove that checks pass, that workflows are valid YAML or that the
project builds.

## .harness.json

| Field | Values |
| --- | --- |
| `harness.version` | `2` |
| `harness.commit` | Pinned harness commit |
| `project` | `name`, `slug`, `description`, `type`, `license`, `owner`, `repo` |
| `project.type` | `web`, `mobile`, `desktop`, `library`, `data` |
| `git` | `commitAutonomy`, `defaultBranch` |
| `quality` | `checks`, `ciDepth`, `os` |
| `build` | `command`, `artifacts`, `attachToRelease` |
| `version` | `source`: `tags` or `file` |
| `release` | `trigger`, `notesLanguage`, `sections`, `attachArtifacts` |
| `deploy` | `target`, `trigger`, `artifact` |
| `skills` | Selected skill IDs |
| `hygiene` | `pullRequestTemplate`, `codeowners`, `codeownersOwner` |
| `ignore` | Local-only patterns |

```json
{
  "harness": { "version": 2 },
  "project": {
    "name": "Example",
    "slug": "example",
    "description": "An example library.",
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

## Workflows

### ci.yml

Triggers: push to the default branch, pull request, `workflow_call`.
`quality` runs the checks; `build` exists only for `full`. With no checks, the
job fails on purpose. Permissions: `contents: read`.

### build.yml

Only for `full`. Triggers: `workflow_dispatch` and `workflow_call` with an
optional `tag`. Builds, uploads artifacts and, with a tag, attaches them to the
release. Permissions: `contents: write`.

### release.yml

Trigger: `workflow_dispatch`.

| Input | Default | Meaning |
| --- | --- | --- |
| `bump` | `patch` | patch, minor, major or a pre-release type |
| `preid` | `alpha` | Pre-release identifier |
| `version` | empty | Explicit version |
| `summary` | empty | Short release summary |

Flow: quality → previous tag → next version → notes → optional bump commit → tag
→ `gh release create`. Permissions: `contents: write`.

### deploy.yml

Only for `github-pages`. Triggers: after a successful release, on push to `main`,
or manual. Permissions: `contents: read`, `pages: write`, `id-token: write`.

## Release template

| Placeholder | Replaced with |
| --- | --- |
| `{version}` | Resolved version |
| `{date}` | `YYYY-MM-DD` |
| `{summary}` | Workflow input or a default |
| `{from}` | Previous tag or `(first release)` |
| `{features}` | `feat:` |
| `{fixes}` | `fix:` |
| `{chores}` | refactor, chore, docs, style, perf, test, build, ci |
| `{other}` | Unclassified |

Unknown placeholders fail verification. Empty groups render as `- None`.
`chore(release)` commits are ignored.

## Next

- [Skills](../skills/skills.md)
- [Operations](../maintain/operations.md)
