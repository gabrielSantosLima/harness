---
title: Run a skill remotely
description: Execute one harness skill without configuring the project.
---

# Run a skill remotely

Use this when you want a single skill in a repository that is not configured
with the harness. No `AGENTS.md`, no `.harness.json`, no `.agent` submodule.

The agent clones the harness into a temporary directory, reads the skill, runs
it, and removes the clone when the process finishes. Nothing is installed
permanently.

## The prompt

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"<skill-id>" in this repository, without configuring the project.

Task: <what you want the skill to do>

Steps:

1. Clone the harness into a temporary directory outside this repository:
   HARNESS_DIR="$(mktemp -d)/harness"
   git clone --depth 1 https://github.com/gabrielSantosLima/harness.git "$HARNESS_DIR"

2. Read "$HARNESS_DIR/skills/<skill-id>/SKILL.md" and every file it references.

3. Execute the skill against the current repository. Use scripts from the
   temporary clone; do not copy them into the repository.

4. Keep the clone until the skill finishes. Do not add .agent, do not create
   .harness.json, and do not install the skill permanently.

5. Remove the temporary clone when done.

6. Do not commit, push or tag unless I explicitly ask.

Rules:
- Follow the skill exactly, including its boundaries.
- Never modify application files the skill does not own.
- If the skill needs a decision, ask me before acting.
- If the network is blocked, stop and ask me for a local harness path.
```

The canonical copy lives at
[`skills/PROMPT.md`](https://github.com/gabrielSantosLima/harness/blob/main/skills/PROMPT.md).

## Examples

Commit and push the current changes:

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"commit-and-push" in this repository, without configuring the project.
Task: commit the current changes and push to the current branch.
```

Publish the site:

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"github-pages" in this repository, without configuring the project.
Task: publish the existing static site in docs/ to GitHub Pages.
```

## Available skills

| Skill | Use when |
| --- | --- |
| [`commit-and-push`](commit-and-push.md) | Commit and push the current changes |
| [`release-summary`](release-summary.md) | Write a user-facing release summary |
| [`release-cut`](release-cut.md) | Cut and verify a release |
| [`github-pages`](github-pages.md) | Publish a static site or docs |
| [`add-skill`](add-skill.md) | Create a skill or a proposal |

`project-setup` is different by design: it configures the repository. Use the
[remote setup prompt](../getting-started/remote.md) for that.

## When to configure instead

Use the full setup when you will keep using the skills, when you want the commit
and release policy in `AGENTS.md`, or when the project needs CI and release
automation. The remote runner is for one-off tasks.

## Notes

- The clone is read-only input; only the current repository is modified, as the
  skill instructs.
- Keep the clone until the skill finishes so references and scripts remain
  available.
- On PowerShell, use `$env:TEMP` instead of `mktemp -d`.

## Next

- [Skills index](index.md)
- [GitHub Pages](github-pages.md)
