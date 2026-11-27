---
title: Skills
description: Catalog, remote runner, per-skill guide and authoring rules.
---

# Skills

A skill is a Markdown file with instructions for a recurring task. Skills live
in the harness repository and are exposed to projects through `.agents/`.

## Catalog

| Skill | Purpose | Project default |
| --- | --- | --- |
| `project-setup` | Configure a repository | Harness only |
| `commit-and-push` | Commit and push safely | Yes |
| `release-summary` | Write a user-facing release summary | Yes |
| `release-cut` | Trigger and verify a release | Yes |
| `github-pages` | Publish a static site or docs to Pages | Optional |
| `readme` | Create, standardize or translate a README | Optional |
| `logo` | Design a logo with an HTML preview of five versions | Optional |
| `add-skill` | Create a new skill or proposal | Yes |

## How projects consume skills

Skills live at `.agents/skills/<id>/SKILL.md`, the interoperable path of the
Agent Skills standard. Codex, Cline, Gemini CLI, OpenCode, Cursor and GitHub
Copilot discover that folder natively. Claude Code scans `.claude/skills`
instead, so `AGENTS.md` also instructs every agent to read
`.agents/skills/<id>/SKILL.md` on demand. That instruction works for any agent
that can read files.

`AGENTS.md` is the instruction source. `CLAUDE.md` and `GEMINI.md` are generated
bridges that import it, so Claude Code and Gemini CLI load the same rules without
a second copy.

The library reaches `.agents/` as a pinned submodule or as a copy, chosen in the
interview. Both modes produce the same paths, so the agent instructions do not
change.

`.agents/` is read-only. Changes belong in the harness repository; projects write
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

4. Keep the clone until the skill finishes. Do not add .agents, do not create
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

Every skill below starts with the prompt that runs it remotely. Use it when the
project is not configured with the harness.

### project-setup

**Configure remotely**

```text
Use the harness at https://github.com/gabrielSantosLima/harness to configure this
repository. Read setup/PROMPT.md from that repository and follow it exactly.
```

The meta-skill. Chooses the mode, detects the repository, interviews, writes the
answers, shows the plan, renders with `--merge` and `--submodule`, verifies and
reports. Never touches application code, never commits and never writes into
`.agents/`.

### commit-and-push

**Run remotely**

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"commit-and-push" in this repository, without configuring the project.

Task: commit the current changes and push to the current branch.
```

Reads the policy, inspects the diff, runs the declared checks, stages explicit
paths, writes a Conventional Commit and pushes only when the policy and the user
allow. Never tags or releases.

### release-summary

**Run remotely**

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"release-summary" in this repository, without configuring the project.

Task: summarize the latest release for end users.
```

Asks the language every time (Portuguese, English or Spanish), reads commits since
the latest tag, groups them into 4–7 user-facing bullets and drops internal work.
Never invents features.

### release-cut

**Run remotely**

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"release-cut" in this repository, without configuring the project.

Task: cut a new release and verify the tag, notes and assets.
```

Asks for the bump, preid or explicit version and a summary. Dispatches the release
workflow, watches it, then verifies tag, notes, prerelease flag and assets. On
failure, reports and stops; never rewrites a tag.

### github-pages

**Run remotely**

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"github-pages" in this repository, without configuring the project.

Task: publish the site in this repository to GitHub Pages.
```

Asks what to publish: an existing static site, a static folder, a build output or
generated documentation. Creates `pages.yml`, checks the base path and the
artifact, handles SPA fallbacks and tells the user to set the Pages source to
GitHub Actions.

### readme

**Run remotely**

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"readme" in this repository, without configuring the project.

Task: standardize the README using the harness template.
```

Asks for languages, logo, badges and sections, resolves `owner/repo` from the
remote and writes `README.md` plus translations. Uses a centered header, badges
and the language selector. Preserves existing content and never invents features.

### logo

**Run remotely**

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"logo" in this repository, without configuring the project.

Task: design a logo for this project and show me five versions before creating
any SVG.
```

Interactive logo design. It asks about purpose, audience, tone and constraints;
offers 6–8 concept directions when there is no initial idea; then builds a
self-contained `logo-preview.html` with five distinct versions, light and dark
surfaces, a 16–200 px size strip and a comparison table. It waits for approval
before writing any final SVG. After approval it builds the mark, dark, monochrome,
favicon and optional wordmark variants and validates them at 16–200 px.

### add-skill

**Run remotely**

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"add-skill" in this repository, without configuring the project.

Task: create a new skill from this workflow.
```

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
