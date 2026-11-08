---
title: Skills
description: Universal, agent-agnostic workflows distributed through .agent/.
---

# Skills

A skill is a Markdown file with instructions for a recurring task. Skills are
stored in the harness repository and exposed to projects through `.agent/`.

## Catalog

| Skill | Purpose | Project default |
| --- | --- | --- |
| [project-setup](project-setup.md) | Configure a repository | Harness only |
| [commit-and-push](commit-and-push.md) | Commit and push safely | Yes |
| [release-summary](release-summary.md) | Write a user-facing release summary | Yes |
| [release-cut](release-cut.md) | Trigger and verify a release | Yes |
| [github-pages](github-pages.md) | Publish a static site or docs to Pages | Optional |
| [readme](readme.md) | Create, standardize or translate a README | Optional |
| [add-skill](add-skill.md) | Create a new skill | Yes |

## Run one skill without setup

Use the [remote runner](remote.md): the agent clones the harness into a
temporary directory, runs the skill and removes the clone.

## How they are loaded

`AGENTS.md` lists the skills and says: before a task that matches a skill, read
`.agent/skills/<id>/SKILL.md` and follow it.

No agent-specific loader is required. Any agent that can read files can use the
library.

## Structure

```text
skills/<id>/
  SKILL.md
  scripts/        optional
  references/     optional
```

## Rules

- English, imperative, numbered steps.
- `name` and `description` in frontmatter.
- No credentials, absolute paths or project-specific details.
- Never write into `.agent/` from a project.

## Next

- [Writing a skill](authoring.md)
- [Skill reference](../concepts/agent-skills.md)
