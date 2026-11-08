---
title: add-skill
description: Create a reusable skill or a proposal for one.
---

# add-skill

## When to use

The user asks to add, create or extract a skill, or wants to turn a repeated
workflow into instructions.

## Steps

1. Decide the scope:
   - in the harness repository: write `skills/<id>/SKILL.md`;
   - in a generated project: write `docs/skill-proposals/<id>.md`.
2. Define the task, trigger, steps, commands and boundaries.
3. Name it in lowercase kebab-case, unique in `skills/`.
4. Add frontmatter with `name` and `description`.
5. Write English, imperative, numbered steps.
6. Add it to `skills/README.md`.
7. Validate the checklist in [Writing a skill](authoring.md).

## Rules

- No agent-specific tool names; say "ask the user".
- No credentials, absolute paths or project-specific details.
- Keep it under roughly 150 lines.
- Move long samples to `references/` and scripts beside `SKILL.md`.
- Never write into `.agent/`.

## Source

[`skills/add-skill/SKILL.md`](https://github.com/gabrielSantosLima/harness/blob/main/skills/add-skill/SKILL.md)

## Next

- [Writing a skill](authoring.md)
