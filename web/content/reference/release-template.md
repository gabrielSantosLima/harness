---
title: Release template
description: Supported placeholders and sections of docs/RELEASE_TEMPLATE.md.
---

# Release template

`docs/RELEASE_TEMPLATE.md` is the single source of the release notes shape.

## Placeholders

| Placeholder | Replaced with |
| --- | --- |
| `{version}` | Resolved version |
| `{date}` | `YYYY-MM-DD` |
| `{summary}` | Workflow input or a default |
| `{from}` | Previous tag or `(first release)` |
| `{features}` | `feat:` commits |
| `{fixes}` | `fix:` commits |
| `{chores}` | refactor, chore, docs, style, perf, test, build, ci |
| `{other}` | Unclassified commits |

Unknown placeholders fail verification.

## Default shape

```markdown
# Project v{version} ({date})

{summary}

Changes since {from}.

## Features

{features}

## Fixes

{fixes}

## Refactor / Chore / Docs

{chores}

## Other

{other}

## Known issues

- None.
```

## Notes

- Commits are formatted as `- description [short-hash]`.
- `chore(release)` commits are ignored.
- Empty groups render as `- None`.
- Optional install sections can be added for mobile, desktop or library
  projects.

## Next

- [Release notes guide](../setup/release-notes.md)
- [Workflows](workflows.md)
