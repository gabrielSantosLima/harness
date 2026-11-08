---
title: project-setup
description: The playbook that configures a repository from the harness.
---

# project-setup

The meta-skill. It runs the interview, renders the templates and verifies the
result.

## When to use

- Setting up a new repository.
- Adopting an existing repository.
- Updating a configured repository.
- Auditing drift.

## Steps

1. Choose the mode: `new`, `adopt`, `update` or `audit`.
2. Detect remote, branch, tags, commits and existing harness files.
3. Interview with `setup/questions.md`.
4. Write the answers file.
5. Show the plan and wait for approval.
6. Dry-run, then render with `--merge` and `--submodule`.
7. Verify until green.
8. Remove the temporary clone and report.

## Boundaries

- Never touch application code.
- Never commit, push or tag.
- Never invent answers.
- Never write into `.agent/`.
- Never change locked decisions.

## Source

[`skills/project-setup/SKILL.md`](https://github.com/gabrielSantosLima/harness/blob/main/skills/project-setup/SKILL.md)

## Next

- [Setup guide](../setup/interview.md)
- [Remote quick start](../getting-started/remote.md)
