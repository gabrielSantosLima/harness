---
title: Adopting existing projects
description: What happens to workflows and release scripts that already exist.
---

# Adopting existing projects

Adoption is conservative by design.

## What is merged

- `AGENTS.md`: missing sections are appended; existing content is preserved.
- `.gitignore`: missing patterns are appended.
- `.harness.json`: written.

## What is skipped

- Existing workflows (`ci.yml`, `build.yml`, `release.yml`, `deploy.yml`).
- An existing `docs/RELEASE_TEMPLATE.md`.
- Existing `scripts/release-notes.*`.
- `README.md`.

The handoff lists every skipped file. Reconciling is an agent task.

## Why not overwrite

Existing workflows often encode project-specific behavior: secrets, caches,
matrix entries, permissions, artifact names. Overwriting would break releases.

## Recommended adoption sequence

1. Run the interview and dry-run.
2. Inspect the diffs.
3. Render with `--merge`.
4. Compare existing workflows with the generated ones in a temporary directory.
5. Decide per file: keep, replace or merge.
6. Run verification.
7. Commit as a single configuration change.

## Known limitation

Semantic alias detection prevents duplicate headings, but an existing section
whose content conflicts with a house rule is not rewritten. The agent reports it
and asks.

## Next

- [Modes](../concepts/modes.md)
- [Audit](audit.md)
