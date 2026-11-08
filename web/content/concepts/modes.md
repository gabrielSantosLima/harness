---
title: Setup modes
description: The four ways to run the harness against a repository.
---

# Setup modes

| Mode | When | Behavior |
| --- | --- | --- |
| `new` | Empty or brand-new repository | Create every file. |
| `adopt` | Existing repository | Detect, merge, never overwrite content silently. |
| `update` | `.harness.json` exists | Reuse recorded answers; ask only what changes. |
| `audit` | Read-only review | Verify and report drift; write nothing. |

## new

The repository has no harness files. The agent runs the full interview, writes
the answers, renders, verifies and reports.

## adopt

The repository already has history and possibly an `AGENTS.md`, workflows and a
release script. The agent:

1. detects and reports existing files;
2. interviews only for what cannot be detected;
3. renders with `--merge`;
4. skips existing workflows instead of overwriting them;
5. reports what must be reconciled manually.

Semantic heading aliases (`Committing and pushing` → `Commits and pushes`,
`Releases` → `Versioning and releases`, `Deployment` → `Deploy`) prevent
duplicate sections.

## update

Loads `.harness.json`, re-renders with the current harness commit, merges and
verifies. Never overwrites user-edited content.

## audit

Runs verification, compares `.harness.json` with the files on disk and reports a
drift table. Makes no changes.

## Next

- [Generated files](generated-files.md)
- [Auditing drift](../operations/audit.md)
