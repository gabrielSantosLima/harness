---
title: Commit policy
description: Autonomy modes, staging and message rules.
---

# Commit policy

## Autonomy

| Mode | Behavior |
| --- | --- |
| `commit-and-push-when-asked` | Commit and push only when the user asks |
| `commit-only-when-asked` | Commit when asked; never push without a separate request |
| `strict` | Every git write action needs a direct instruction |

The default is `commit-and-push-when-asked`. The choice is recorded in
`.harness.json`.

## Staging

- Stage explicit paths.
- Never `git add -A`, `git add .` or `git commit -a` unless every change belongs
  to the same commit.
- Never stage local notes, secrets, environment files or build output.
- Review the staged diff.

## Message

```text
<type>(<optional scope>): <short description>
```

- Imperative, lowercase, no trailing period, at most 72 characters.
- Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `build`,
  `ci`, `style`.
- Body only when it adds context, wrapped at 72 columns.
- No AI attribution, co-author trailers or tool mentions.

## Checks

Run the commands recorded in `AGENTS.md` and `.harness.json` before committing.
A failing check blocks the commit.

## Next

- [Versioning](versioning.md)
- [commit-and-push skill](../skills/commit-and-push.md)
