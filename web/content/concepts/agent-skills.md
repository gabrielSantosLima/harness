---
title: The skill reference
description: How .agent/ exposes skills without copying them.
---

# The skill reference

Projects do not copy skills. They reference the harness repository through a git
submodule at `.agent/`, with a sparse checkout limited to `skills/`.

```text
.agent/
  skills/
    commit-and-push/SKILL.md
    release-summary/SKILL.md
    release-cut/SKILL.md
    add-skill/SKILL.md
```

## Why a submodule

- One source of truth for every project.
- Pinned per project, so an upgrade is explicit.
- Works offline after `git submodule update --init`.
- No duplication and no drift.

## How an agent finds a skill

`AGENTS.md` contains the list and the rule:

> Before a task that matches a skill, read its `SKILL.md` and follow it.

That is the entire integration. It works for any agent that can read files, with
no native skill loader required.

## Read-only

`.agent/` is read-only. A project agent that needs a new skill writes a proposal
to `docs/skill-proposals/<id>.md`; the skill is applied in the harness
repository.

## Cloning

```bash
git clone --recurse-submodules <repo>
# or, after a normal clone:
git submodule update --init --recursive
```

## Next

- [Skills](../skills/index.md)
- [Submodule operations](../operations/submodule.md)
