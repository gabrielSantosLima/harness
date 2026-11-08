---
title: Release notes
description: Language, sections and placeholders.
---

# Release notes

Release notes are generated from Conventional Commits since the previous tag.

## Language

English is suggested. Portuguese (Brazil) and Spanish templates ship with the
harness. The choice affects only
[`docs/RELEASE_TEMPLATE.md`](../reference/release-template.md), not the commits.

## Sections

| Placeholder | Source |
| --- | --- |
| `{features}` | `feat:` commits |
| `{fixes}` | `fix:` commits |
| `{chores}` | `refactor`, `chore`, `docs`, `style`, `perf`, `test`, `build`, `ci` |
| `{other}` | Anything else |
| `{version}`, `{date}`, `{summary}`, `{from}` | Release inputs |

`chore(release)` commits are ignored.

## Rules

- Describe user-visible changes.
- Do not list commits that are not shipped.
- Omit empty sections or use `- None`.
- Keep the template as the single source of shape.

## Editing

Edit `docs/RELEASE_TEMPLATE.md` in the project. Keep every placeholder your
script supports; the verifier rejects unknown ones.

## Next

- [Release template reference](../reference/release-template.md)
- [release-summary skill](../skills/release-summary.md)
