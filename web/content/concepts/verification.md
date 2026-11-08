---
title: Verification
description: What the harness proves before calling a setup done.
---

# Verification

`scripts/verify-setup.mjs` runs 13 checks against a generated repository. It
exits non-zero when any fails.

## The checks

1. `.harness.json` is valid JSON with the required fields.
2. `AGENTS.md` exists and is fully rendered.
3. The release template exists and uses supported placeholders.
4. The release engine exists.
5. Version tooling matches the declared source.
6. The release workflow exists and is manual.
7. CI and build workflows match the declared depth.
8. The deploy workflow matches the declared target.
9. Workflow commands match `.harness.json`.
10. `AGENTS.md` lists the selected skills.
11. `.agent` exposes the selected skills.
12. `.gitignore` covers the declared patterns.
13. Hygiene files match the configuration.

## What it does not prove

- That the check commands actually pass.
- That workflows are valid GitHub Actions YAML.
- That the project builds.
- That existing content was merged perfectly.

Those are agent and CI responsibilities.

## Advisory results

- `.agent` not initialized is a note, not a failure, because verification runs
  from the harness tree.
- Existing project sections such as `Tech stack` are reported, not rejected.

## Running

```bash
node scripts/verify-setup.mjs <target>
```

## Next

- [Reference: verify-setup](../reference/verify.md)
- [Auditing drift](../operations/audit.md)
