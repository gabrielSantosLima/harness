---
name: Project setup
description: Configure a repository from the harness, including agent guidelines, commit policy, versioning, release notes, CI, build, deploy, and the .agent skill reference. Use when the user asks to set up a new project, adopt or audit an existing repository, or update harness configuration.
---

# Project setup

Configure a repository from the harness. The user-facing rules live in the
`setup/` directory of the harness; this skill is the operating procedure.

Read these files before starting:

- `setup/SETUP.md` - the full playbook.
- `setup/decisions.md` - locked decisions and non-negotiable house rules.
- `setup/questions.md` - the question bank.
- `setup/verify.md` - the definition of done.
- `setup/harness.schema.json` - the shape of `.harness.json`.

Run everything from the harness working tree. The target repository can be any
directory.

## 1. Choose the mode

- `new`: empty directory or brand-new repository.
- `adopt`: existing repository; merge, never overwrite silently.
- `update`: `.harness.json` already exists; reuse its answers.
- `audit`: read-only drift report.

## 2. Detect

Collect and show:

```bash
git -C <target> rev-parse --is-inside-work-tree
git -C <target> remote get-url origin
git -C <target> branch --show-current
git -C <target> tag --sort=-v:refname | head -n 3
git -C <target> log --no-merges --pretty=format:%s -n 30
```

Inspect `AGENTS.md`, `.harness.json`, `.agent`, `docs/RELEASE_TEMPLATE.md`,
`scripts/release-notes.*`, `.github/workflows/*` and `index.html`.

Never infer a stack, framework, architecture, dependency or package manager.

## 3. Interview

Follow `setup/questions.md`: at most four questions per round, multiple choice
when possible, recommended option first. Skip questions already answered by
detection or by `.harness.json`.

If your agent has a dedicated question tool, use it; otherwise ask in plain text
and wait for the answer.

## 4. Write the answers

Create a temporary JSON file following `setup/answers.example.json`. Print the
answers, the resulting file tree, the diffs of existing files and the recorded
commands. Wait for approval.

## 5. Render

Dry run first:

```bash
node scripts/render.mjs --answers <answers.json> --target <target> --merge --dry-run
```

Then:

```bash
node scripts/render.mjs \
  --answers <answers.json> \
  --target <target> \
  --merge \
  --submodule git@github.com:gabrielSantosLima/harness.git \
  --commit "$(git rev-parse HEAD)"
```

Use `--merge` for `AGENTS.md`. Never use `--force` on `AGENTS.md`, the README or
application files without explicit approval. The renderer never commits, pushes
or tags.

## 6. Verify

```bash
node scripts/verify-setup.mjs <target>
```

All checks must pass. Fix the answers and re-render instead of editing generated
workflows by hand. Then confirm the judgment items in `setup/verify.md`.

## 7. Hand off

Report configured, skipped and manual items. Name the manual steps that apply:
Pages source, repository secrets, branch protection, first release command,
submodule initialization, and the absence of quality gates with `release-only`.

Do not commit, push or tag. The user decides when.

## Boundaries

- Never modify application code.
- Never invent answers; ask.
- Never change the locked decisions in `setup/decisions.md` from this skill.
- Never write into `.agent/`; it is read-only.
- To add a skill, use the `add-skill` skill and apply it in the harness
  repository.
