---
title: commit-and-push
description: Stage intended files, write a Conventional Commit and push when allowed.
---

# commit-and-push

## When to use

The user asks to commit, commit and push, or ship the current changes.

## Steps

1. Read `AGENTS.md` and `.harness.json` for checks and autonomy.
2. Inspect `git status`, the branch and the full diff.
3. Run every declared check.
4. Stage explicit paths only.
5. Write a Conventional Commit in English.
6. Commit.
7. Push only when the policy and the user allow.
8. Report branch, hash, subject and working-tree state.

## Rules

- No `git add -A`, `git add .` or `git commit -a`.
- No AI attribution or co-author trailers.
- No amend, rebase or force-push without an explicit request.
- No tags or releases; use `release-cut` for that.

With `strict`, confirm each git write action. With `commit-only-when-asked`,
never push unless asked separately.

## Source

[`skills/commit-and-push/SKILL.md`](https://github.com/gabrielSantosLima/harness/blob/main/skills/commit-and-push/SKILL.md)

## Next

- [Release summary](release-summary.md)
