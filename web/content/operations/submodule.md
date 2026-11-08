---
title: Submodule operations
description: Initialize, update and repair .agent.
---

# Submodule operations

`.agent` is a git submodule pinned to the harness repository, with a sparse
checkout limited to `skills/`.

## Clone with submodules

```bash
git clone --recurse-submodules <repo>
```

## After a normal clone

```bash
git submodule update --init --recursive
```

## Update to the latest harness

```bash
git submodule update --remote .agent
git diff --submodule
```

Review the skill changes before committing.

## Pin a specific commit

```bash
git -C .agent fetch
git -C .agent checkout <commit>
git add .agent
```

## Verify the sparse checkout

```bash
git -C .agent sparse-checkout set skills
ls .agent
```

Only `skills/` should appear.

## Remove and re-add

```bash
git submodule deinit -f .agent
rm -rf .git/modules/.agent
git submodule add https://github.com/gabrielSantosLima/harness.git .agent
git -C .agent sparse-checkout set skills
```

## Windows

- Enable long paths if the clone path is deep.
- Avoid junctions for `.agent`; use a real submodule.
- Keep `.gitattributes` with `* text=auto eol=lf` for scripts.

## Next

- [Troubleshooting agents](../agents/troubleshooting.md)
- [Audit](audit.md)
