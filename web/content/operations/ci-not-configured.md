---
title: CI fails on purpose
description: What to do when the generated CI is red because checks are missing.
---

# CI fails on purpose

With `ci` or `full` and no check commands, the generated `ci.yml` contains:

```yaml
- name: Checks not configured
  run: |
    echo "No check commands are configured in .harness.json." >&2
    exit 1
```

The release workflow calls CI, so a release is also blocked. This is intended: a
silent pass is worse than a red build.

## Fix

1. Decide the real check commands for the project.
2. Add them to `.harness.json` under `quality.checks`.
3. Re-render, or add the same commands to `.github/workflows/ci.yml`.
4. Run them locally.
5. Verify:

```bash
node scripts/verify-setup.mjs .
```

## Common choices

| Ecosystem | Example commands |
| --- | --- |
| Any | `make check` |
| Node | `npm run lint`, `npm test` |
| Python | `ruff check .`, `pytest` |
| Rust | `cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test` |
| Data | `python etl/validar.py` |

The harness does not infer these; you choose them.

## Alternative

Use `release-only` when the project is not ready for gates. The setup records it
as a known gap, and audit keeps reporting it.

## Next

- [CI and build](../setup/ci-build.md)
- [Audit](audit.md)
