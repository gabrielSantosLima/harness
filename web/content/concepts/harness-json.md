---
title: The setup state
description: Why .harness.json is committed and what it is used for.
---

# The setup state

`.harness.json` is the committed record of how a project was configured. It is
written by the renderer and validated against
[`setup/harness.schema.json`](https://github.com/gabrielSantosLima/harness/blob/main/setup/harness.schema.json).

## Why commit it

- **Updates**: re-render without re-answering everything.
- **Audits**: compare configuration with files on disk.
- **Consistency**: any agent session can read the policy.
- **Traceability**: it records the harness commit used.

## What it contains

| Field | Purpose |
| --- | --- |
| `harness.version` / `harness.commit` | Harness contract and pinned commit |
| `project` | Name, slug, description, type, license, owner, repo |
| `git` | Commit autonomy and default branch |
| `quality` | Check commands, CI depth, OS matrix |
| `build` | Build command, artifacts, attach flag |
| `version` | Tags-only or file plus field |
| `release` | Trigger, notes language, sections, attach flag |
| `deploy` | Target, trigger, artifact |
| `skills` | Skills exposed to the project |
| `hygiene` | PR template, `CODEOWNERS`, owner |
| `ignore` | Local-only patterns |

## What it never contains

Secrets, tokens, credentials, environment values or prompts.

## Next

- [Full field reference](../reference/harness-json.md)
- [Generated vs owned files](generated-files.md)
