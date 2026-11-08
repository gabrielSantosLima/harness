---
title: Updates
description: Keep a configured repository in sync with the harness.
---

# Updates

A project records the harness commit it was generated from in `.harness.json`.
Updates are explicit; nothing changes on its own.

## Update the skill submodule

```bash
git submodule update --remote .agent
```

With the sparse checkout, only `skills/` is materialized. Review the resulting
skill changes before committing.

## Re-render from the recorded answers

```bash
node scripts/render.mjs \
  --answers .harness.json \
  --target . \
  --merge \
  --commit "$(git -C <harness> rev-parse HEAD)"
```

`--merge` keeps `AGENTS.md` content and adds only missing sections. Existing
workflows are skipped, not overwritten.

## Check for drift

```bash
node scripts/verify-setup.mjs .
```

Also run the read-only `audit` mode described in
[Auditing drift](../operations/audit.md).

## When to update

- A new harness release changes templates or guidelines.
- A skill you use has a fix.
- `verify-setup` reports drift.

## When not to update

- In the middle of a release.
- With a dirty working tree unrelated to the update.
- Without reviewing the rendered diff.

## Next

- [Submodule operations](../operations/submodule.md)
- [Auditing drift](../operations/audit.md)
