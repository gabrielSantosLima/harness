---
title: Generated vs owned files
description: What the harness regenerates and what belongs to the project.
---

# Generated vs owned files

## Generated and safe to regenerate

| File | Notes |
| --- | --- |
| `AGENTS.md` | Sections from `guidelines/`; merged on updates |
| `docs/RELEASE_TEMPLATE.md` | Placeholders used by the release script |
| `scripts/release-notes.mjs` | One implementation for every project |
| `scripts/next-version.mjs` | Tags-only versioning |
| `scripts/bump-version.mjs` | File-based versioning |
| `.github/workflows/*` | CI, build, release, deploy |
| `.github/pull_request_template.md` | Hygiene |
| `.github/CODEOWNERS` | Hygiene |
| `.harness.json` | Setup state |

## Owned by the project

| File | Why |
| --- | --- |
| Application code | Never touched. |
| `README.md` | User-authored. |
| Existing workflows | Skipped on adopt; reconcile manually. |
| Existing release scripts | Kept during adoption. |
| `AGENTS.md` custom sections | Preserved by merge. |
| `.agent/**` | Read-only submodule. |

## Editing generated files

Small fixes are fine, but they drift from the templates. Prefer:

1. update the harness template or answer;
2. re-render;
3. run verification.

The `audit` mode reports files that no longer match `.harness.json`.

## Next

- [Verification](verification.md)
- [Audit](../operations/audit.md)
