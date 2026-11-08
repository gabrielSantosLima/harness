---
title: Auditing drift
description: Detect configuration that no longer matches the files.
---

# Auditing drift

Audit mode is read-only. It never writes.

## Run

```bash
node scripts/verify-setup.mjs .
```

Then compare `.harness.json` with the files on disk:

- workflows referenced in the answers;
- check commands in `ci.yml`;
- build command in `build.yml`;
- version file and field;
- skills listed in `AGENTS.md` and present in `.agent`;
- ignore patterns in `.gitignore`.

## Report format

| File | Expected | Actual |
| --- | --- | --- |
| `.github/workflows/ci.yml` | `npm test` | `npm run test:ci` |
| `.gitignore` | `.env` | missing |

## What to do

- For generated files: fix the answer or template, re-render, verify.
- For user-edited files: decide whether the edit is intentional; update
  `.harness.json` or the file.
- For skipped workflows: reconcile manually; the harness will not overwrite
  them.

## When to audit

- After pulling harness updates.
- Before a release.
- After another contributor edits generated files.

## Next

- [Verification](../concepts/verification.md)
- [Updates](../getting-started/updates.md)
