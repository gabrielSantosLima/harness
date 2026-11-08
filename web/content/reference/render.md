---
title: render.mjs
description: CLI reference for the harness renderer.
---

# render.mjs

Renders templates into a target repository.

```bash
node scripts/render.mjs --answers <file> --target <dir> [flags]
```

## Flags

| Flag | Effect |
| --- | --- |
| `--answers <file>` | Required. JSON answers file |
| `--target <dir>` | Required. Destination repository |
| `--dry-run` | Print actions, write nothing |
| `--merge` | Merge missing sections into an existing `AGENTS.md` |
| `--force` | Overwrite generated files |
| `--submodule <url>` | Add `.agent` and restrict it to `skills/` |
| `--commit <hash>` | Record the harness commit in `.harness.json` |
| `--skills-root <path>` | Skill path used in `AGENTS.md` (harness self-host uses `skills`) |

## Actions

`create`, `overwrite`, `skipped (exists)`, `merged`, `appended`, `unchanged`.

## Behavior

- `.harness.json` is always rewritten.
- `AGENTS.md` is only merged with `--merge`; otherwise an existing file is
  skipped.
- Existing workflows are skipped unless `--force`.
- `.gitignore` receives only missing entries.
- The renderer never commits, pushes or tags.

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Rendered |
| `1` | Invalid arguments, invalid answers or a failed write |

## Examples

Dry run:

```bash
node scripts/render.mjs --answers answers.json --target . --merge --dry-run
```

Full render with submodule:

```bash
node scripts/render.mjs --answers answers.json --target . \
  --merge --submodule https://github.com/gabrielSantosLima/harness.git \
  --commit "$(git rev-parse HEAD)"
```

## Next

- [verify-setup](verify.md)
- [Generated files reference](harness-json.md)
