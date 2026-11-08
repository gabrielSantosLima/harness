# Bootstrap prompt

Use this to configure a target repository without cloning the harness first. The
agent reads the public harness repository, follows the playbook, and writes the
configuration into the current repository.

## Short instruction for the user

Paste this into the agent running in the target repository:

```text
Use the harness at https://github.com/gabrielSantosLima/harness to configure this
repository. Read setup/PROMPT.md from that repository and follow it exactly.
```

## Full prompt

```text
You are configuring the repository in the current working directory using the
public harness at https://github.com/gabrielSantosLima/harness.

Goal: apply the harness setup (agent guidelines, commit policy, versioning,
release notes, CI, build, deploy and the .agent skill reference) to this
repository, without touching application code.

Step 1. Fetch the harness outside this repository.

  HARNESS_DIR="$(mktemp -d)/harness"
  git clone --depth 1 https://github.com/gabrielSantosLima/harness.git "$HARNESS_DIR"

  On PowerShell:
  $HARNESS_DIR = Join-Path $env:TEMP "harness-bootstrap"
  git clone --depth 1 https://github.com/gabrielSantosLima/harness.git $HARNESS_DIR

Step 2. Read, in this order:

  $HARNESS_DIR/setup/PROMPT.md
  $HARNESS_DIR/setup/SETUP.md
  $HARNESS_DIR/setup/decisions.md
  $HARNESS_DIR/setup/questions.md
  $HARNESS_DIR/setup/verify.md
  $HARNESS_DIR/setup/harness.schema.json
  $HARNESS_DIR/setup/answers.example.json

Step 3. Follow setup/SETUP.md exactly.

  - Choose the mode: new, adopt, update or audit.
  - Detect first: git remote, branch, tags, recent commits, AGENTS.md,
    .harness.json, .agent, docs/RELEASE_TEMPLATE.md, scripts/release-notes.*,
    .github/workflows/*, index.html.
  - Never infer a stack, framework, architecture, dependency or package manager.
  - Interview using setup/questions.md: at most four questions per round,
    multiple choice when possible, recommended option first.
  - Write the answers JSON following setup/answers.example.json.
  - Print the answers, the resulting file tree, the diffs of existing files and
    the recorded commands. Wait for explicit approval before writing.

Step 4. Render.

  Always dry-run first:

  node "$HARNESS_DIR/scripts/render.mjs" \
    --answers <answers.json> \
    --target . \
    --merge \
    --dry-run

  Then for real:

  node "$HARNESS_DIR/scripts/render.mjs" \
    --answers <answers.json> \
    --target . \
    --merge \
    --submodule https://github.com/gabrielSantosLima/harness.git \
    --commit "$(git -C "$HARNESS_DIR" rev-parse HEAD)"

  Use --merge so an existing AGENTS.md keeps its content and only missing
  sections are appended. Never use --force on AGENTS.md, the README or
  application files without explicit approval.

Step 5. Verify until green.

  node "$HARNESS_DIR/scripts/verify-setup.mjs" .

Step 6. Clean up the temporary harness clone. Do not add it to this repository.

Step 7. Report the configured, skipped and manual items. Name the manual steps
that apply: GitHub Pages source, repository secrets, branch protection, the first
release command, and the absence of quality gates when CI depth is release-only.

Rules:

  - Never modify application code.
  - Never commit, push or tag. The user decides when.
  - Never invent answers; ask.
  - Never write into .agent/; it is read-only.
  - Never change the locked decisions in setup/decisions.md from this repository.
  - If the network blocks the clone, ask the user to clone the harness and
    provide its path.
```

## Notes

- The prompt works with any agent that can run shell commands and read files.
- The harness clone is temporary and lives outside the target repository.
- `.agent` is added as a submodule pinned to the same commit recorded in
  `.harness.json` when that commit is reachable.
- The canonical playbook is `setup/SETUP.md`; this file only bootstraps it.

## Command reference

| Purpose | Command |
| --- | --- |
| Fetch the harness | `git clone --depth 1 https://github.com/gabrielSantosLima/harness.git "$HARNESS_DIR"` |
| Dry run | `node "$HARNESS_DIR/scripts/render.mjs" --answers <answers> --target . --merge --dry-run` |
| Render | `node "$HARNESS_DIR/scripts/render.mjs" --answers <answers> --target . --merge --submodule https://github.com/gabrielSantosLima/harness.git --commit "$(git -C "$HARNESS_DIR" rev-parse HEAD)"` |
| Verify | `node "$HARNESS_DIR/scripts/verify-setup.mjs" .` |
| Raw prompt URL | `https://raw.githubusercontent.com/gabrielSantosLima/harness/main/setup/PROMPT.md` |
