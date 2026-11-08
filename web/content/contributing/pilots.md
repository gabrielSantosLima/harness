---
title: Pilots
description: End-to-end pilots, including adoption of a real public repository.
---

# Pilots

## Automated

```bash
node tests/pilot.mjs
```

| Pilot | Scenario | Result |
| --- | --- | --- |
| 1 | New repository with `.agent`, sparse checkout | Passed |
| 2 | Existing repository with `AGENTS.md`, `--merge` | Passed |
| 3 | Re-render (update), idempotent | Passed |

Assertions:

- `.agent/skills/<id>/SKILL.md` exists;
- `.agent/templates` is hidden by the sparse checkout;
- `.harness.json` records the commit;
- `verify-setup` passes;
- no commit, push or tag is created;
- existing content is preserved;
- application files are untouched.

## Real adoption: mimose

Repository: `gabrielSantosLima/mimose` at `949fa11`, shallow clone into a
temporary directory.

Result: 13/13 checks passed.

| Action | Files |
| --- | --- |
| Merged | `AGENTS.md` |
| Created | release scripts, `ci.yml`, PR template, `CODEOWNERS`, `.harness.json` |
| Appended | `.gitignore` |
| Skipped | Existing template and workflows |
| Submodule | `.agent` with `skills/` |

The pilot exposed semantic duplicates (`Releases` vs `Versioning and releases`).
The merge now maps aliases, and a regression test covers it.

## Remote bootstrap

`setup/PROMPT.md` was validated with a temporary clone. The public clone and a
local clone behave identically; only the path changes.

## Reproduce

```bash
node tests/run.mjs
node tests/pilot.mjs --keep
```

`--keep` preserves the temporary repositories for inspection.

## Next

- [Development](development.md)
- [Adoption](../operations/adoption.md)
