---
title: Skills
description: Catalog, remote runner, per-skill guide and authoring rules.
---

# Skills

A skill is a Markdown file with instructions for a recurring task. Skills live
in the harness repository and are exposed to projects through `.agent/`.

## Catalog

| Skill | Purpose | Project default |
| --- | --- | --- |
| `project-setup` | Configure a repository | Harness only |
| `commit-and-push` | Commit and push safely | Yes |
| `release-summary` | Write a user-facing release summary | Yes |
| `release-cut` | Trigger and verify a release | Yes |
| `github-pages` | Publish a static site or docs to Pages | Optional |
| `readme` | Create, standardize or translate a README | Optional |
| `add-skill` | Create a new skill or proposal | Yes |

## How projects consume skills

`AGENTS.md` lists the skills and says: before a task that matches a skill, read
`.agent/skills/<id>/SKILL.md` and follow it. No agent-specific loader is
required. Any agent that can read files can use the library.

`.agent/` is read-only. Changes belong in the harness repository; projects write
proposals to `docs/skill-proposals/<id>.md`.

## Run a skill remotely

To use one skill without configuring the repository, paste:

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

The canonical copy lives at `skills/PROMPT.md`. On PowerShell, use
`$env:TEMP` instead of `mktemp -d`.

## Skills in detail

### project-setup

The meta-skill. Chooses the mode, detects the repository, interviews, writes the
answers, shows the plan, renders with `--merge` and `--submodule`, verifies and
reports. Never touches application code, never commits and never writes into
`.agent/`.

### commit-and-push

Reads the policy, inspects the diff, runs the declared checks, stages explicit
paths, writes a Conventional Commit and pushes only when the policy and the user
allow. Never tags or releases.

### release-summary

Asks the language every time (Portuguese, English or Spanish), reads commits since
the latest tag, groups them into 4–7 user-facing bullets and drops internal work.
Never invents features.

### release-cut

Asks for the bump, preid or explicit version and a summary. Dispatches the release
workflow, watches it, then verifies tag, notes, prerelease flag and assets. On
failure, reports and stops; never rewrites a tag.

### github-pages

Asks what to publish: an existing static site, a static folder, a build output or
generated documentation. Creates `pages.yml`, checks the base path and the
artifact, handles SPA fallbacks and tells the user to set the Pages source to
GitHub Actions.

### readme

Asks for languages, logo, badges and sections, resolves `owner/repo` from the
remote and writes `README.md` plus translations. Uses a centered header, badges
and the language selector. Preserves existing content and never invents features.

### add-skill

Creates a skill in the harness or a proposal in a project. Enforces naming,
frontmatter, agent-agnostic wording, boundaries and registration.

## Writing a skill

```text
skills/<id>/
  SKILL.md
  scripts/       optional
  references/    optional
```

```markdown
---
name: Short display name
description: What it does and when to use it, with words a user is likely to type.
---
```

Checklist:

- [ ] `SKILL.md` inside `skills/<id>/`.
- [ ] `name` and `description` present.
- [ ] English, imperative, numbered steps.
- [ ] No agent-specific tool names; say "ask the user".
- [ ] No absolute paths, secrets or project-specific details.
- [ ] Boundaries for git, release or file writes.
- [ ] Registered in `skills/README.md`.
- [ ] Under ~150 lines, or split into references.

## Next

- [Configuration](../configure/configuration.md)
- [Reference](../reference/reference.md)
