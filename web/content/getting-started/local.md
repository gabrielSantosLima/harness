---
title: Local quick start
description: Run the renderer from a local harness clone.
---

# Local quick start

## 1. Clone the harness

```bash
git clone https://github.com/gabrielSantosLima/harness.git
cd harness
```

## 2. Build the answers

Copy `setup/answers.example.json` and adjust it, or let the agent write it after
the interview. The full shape is documented in
[`.harness.json`](../reference/harness-json.md).

## 3. Dry run

```bash
node scripts/render.mjs \
  --answers <answers.json> \
  --target <path-to-project> \
  --merge \
  --dry-run
```

Review the actions: `create`, `overwrite`, `skipped (exists)`, `merged`,
`appended`.

## 4. Render

```bash
node scripts/render.mjs \
  --answers <answers.json> \
  --target <path-to-project> \
  --merge \
  --submodule https://github.com/gabrielSantosLima/harness.git \
  --commit "$(git rev-parse HEAD)"
```

`--merge` preserves an existing `AGENTS.md`. The renderer never commits.

## 5. Verify

```bash
node scripts/verify-setup.mjs <path-to-project>
```

All checks must pass. If `.agent` is reported as not initialized, run
`git submodule update --init` in the target.

## Next

- [Your first setup](first-setup.md)
- [Reference: render.mjs](../reference/render.md)
