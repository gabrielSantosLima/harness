---
title: Troubleshooting agents
description: Common discovery and loading problems.
---

# Troubleshooting agents

## The agent ignores AGENTS.md

- Confirm the file is at the repository root.
- Confirm the agent reads `AGENTS.md`; Claude Code needs the global pointer.
- Restart or reload the session after creating the file.

## A skill is not used

- Confirm `AGENTS.md` lists it.
- Confirm `.agent/skills/<id>/SKILL.md` exists.
- Initialize the submodule: `git submodule update --init`.
- Mention the skill explicitly: "use `commit-and-push`".

## `.agent` is empty

The clone did not initialize submodules:

```bash
git submodule update --init --recursive
```

## Skills are missing after an update

The sparse checkout may be wrong:

```bash
git -C .agent sparse-checkout set skills
```

## The agent tries to edit `.agent`

Stop it. The submodule is read-only. Changes belong in the harness repository;
projects write proposals to `docs/skill-proposals/`.

## The agent cannot clone the harness

Use a local clone and follow the [local quick start](../getting-started/local.md).

## Next

- [Compatibility](compatibility.md)
- [Submodule operations](../operations/submodule.md)
