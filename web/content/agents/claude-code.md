---
title: Claude Code
description: Point Claude Code at the project AGENTS.md once, globally.
---

# Claude Code

Claude Code does not read `AGENTS.md` natively. It reads `CLAUDE.md`. The harness
does not generate a per-project adapter; use one global pointer instead.

## One-time setup

Create or edit `~/.claude/CLAUDE.md`:

```markdown
When the current repository has an AGENTS.md, read it before starting any task
and follow it. Skills live in .agent/skills/<id>/SKILL.md; read the matching one
on demand.
```

That is enough for every configured repository.

## Why not generate CLAUDE.md

- It duplicates the contract.
- It drifts from `AGENTS.md`.
- It adds a file to every project for a single agent.

## If you prefer per-project

Create a one-line `CLAUDE.md`:

```markdown
@AGENTS.md
```

This is a project choice outside the harness. The default remains `AGENTS.md`
only.

## Next

- [Compatibility](compatibility.md)
- [Troubleshooting](troubleshooting.md)
