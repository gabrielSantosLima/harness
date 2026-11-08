---
title: release-summary
description: Write a short, non-technical summary of the latest release.
---

# release-summary

## When to use

The user asks for a release message, release notes or a summary of what changed
recently. The readers are end users, not developers.

## Steps

1. Ask the language: Portuguese (Brazil), English or Spanish. Ask every time.
2. Find the latest tag with `git describe --tags --abbrev=0`.
3. Read the commits since the previous tag.
4. Group related commits into one user-facing bullet.
5. Drop internal work: refactors, CI, tests, dependency bumps, tooling.
6. Write 4 to 7 bullets under a bold title.

## Rules

- No technical vocabulary: API, refactor, job, commit, dependency, payload, CI.
- No hashes, file names or version numbers unless asked.
- No emoji, extra headings or closing paragraph.
- Never invent a feature that is not in the commits.

## Source

[`skills/release-summary/SKILL.md`](https://github.com/gabrielSantosLima/harness/blob/main/skills/release-summary/SKILL.md)

## Next

- [release-cut](release-cut.md)
