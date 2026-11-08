# Setup playbook

This is the procedure an agent follows to configure a repository from the
harness. It is deliberately deterministic: the interview decides the answers,
`scripts/render.mjs` writes the files, and `scripts/verify-setup.mjs` proves the
result.

The agent runs this playbook from a harness working tree. The target repository
can be any directory.

## Modes

| Mode | When | Behavior |
| --- | --- | --- |
| `new` | Empty directory or brand-new repository | Create every file. |
| `adopt` | Existing repository | Detect, merge, never overwrite content without approval. |
| `update` | Repository already has `.harness.json` | Reuse the recorded answers; ask only what the user wants to change. |
| `audit` | Read-only review | Run verification and report drift; write nothing. |

## Phase 0 — Detect before asking

Run the checks that apply and record the output:

```bash
git -C <target> rev-parse --is-inside-work-tree
git -C <target> remote get-url origin
git -C <target> branch --show-current
git -C <target> tag --sort=-v:refname | head -n 3
git -C <target> log --no-merges --pretty=format:%s -n 30
```

Then inspect, when present:

- `AGENTS.md`
- `.harness.json`
- `.agent`
- `docs/RELEASE_TEMPLATE.md`
- `scripts/release-notes.*`
- `.github/workflows/*`
- `index.html` (a strong signal for `web`)

Rules:

- Show the detected values and ask only for confirmation.
- Never infer a stack, framework or dependency from the files.
- Never treat the presence of a version field as a stack decision.
- In `adopt`, list the files that would be created, modified or left untouched.
- In `update`, load `.harness.json` and skip every question it answers.

## Phase 1 — Interview

Follow `setup/questions.md`. Ask at most four questions per round. Prefer
multiple-choice questions with the recommended option first. If the agent has a
dedicated question tool, use it; otherwise ask in plain text and wait.

Do not ask about technology stacks, architecture, dependencies, package
managers or file layout.

## Phase 2 — Build the answers file

Write the answers to a temporary JSON file, for example
`<target>/.harness-answers.json` (gitignored or deleted afterwards). The shape is
documented by `setup/harness.schema.json` and shown in
`setup/answers.example.json`.

Before rendering, print:

1. the detection summary;
2. the answers file;
3. the file tree that will result;
4. diffs for files that already exist;
5. the exact check, build and release commands that will be recorded.

Get explicit approval.

## Phase 3 — Render

Always start with a dry run:

```bash
node scripts/render.mjs \
  --answers <answers.json> \
  --target <target> \
  --merge \
  --dry-run
```

Then render for real, adding the submodule when `.agent` is missing:

```bash
node scripts/render.mjs \
  --answers <answers.json> \
  --target <target> \
  --merge \
  --submodule git@github.com:gabrielSantosLima/harness.git \
  --commit "$(git rev-parse HEAD)"
```

Flags:

- `--merge`: merge missing `##` sections into an existing `AGENTS.md`; never
  overwrite existing content.
- `--force`: overwrite generated files. Never use it on `AGENTS.md`, README or
  application files without explicit approval.
- `--dry-run`: print the plan without writing.
- `--submodule <url>`: add `.agent` and restrict it to `skills/`.
- `--commit <hash>`: record the harness commit in `.harness.json`.

The renderer never commits, pushes or tags.

### If the submodule cannot be added

- Target is not a git repository: initialize it first, or add the submodule
  manually later.
- URL not reachable: use the HTTPS URL, or ask the user for credentials.
- `.agent` already exists: keep it; update it with
  `git -C <target> submodule update --remote .agent`.

## Phase 4 — Verify

```bash
node scripts/verify-setup.mjs <target>
```

Every check must pass. When a check fails, fix the input and re-render; do not
edit generated workflows by hand. `.agent` not being initialized is reported as
a note, not a failure, because verification runs from the harness tree.

Also confirm the judgment items in `setup/verify.md`.

## Phase 5 — Handoff

Report a table with three columns: configured, skipped, manual.

Manual steps to name explicitly when they apply:

- Enable GitHub Pages and set the source to **GitHub Actions**.
- Add repository secrets (for example a package registry token).
- Set `CF_PROJECT_ID` / `CF_API_TOKEN` for CurseForge publishing.
- Configure branch protection to require CI.
- Run the first release:
  `gh workflow run release.yml -f bump=minor -f summary="Initial release"`.
- Initialize submodules after cloning:
  `git clone --recurse-submodules <repo>` or
  `git submodule update --init --recursive`.
- For `release-only`, state clearly that quality gates are not enforced.

Do not commit, push or tag during setup. The user decides when to do that.

## Adopt mode specifics

1. Read the existing `AGENTS.md` and compare headings with the generated file.
2. Render with `--merge` and show the resulting diff.
3. Keep project-specific sections that the harness does not generate.
4. Never delete an existing section, even when it conflicts with a house rule;
   instead propose the change and ask.
5. For existing workflows, render into a temporary directory first and diff
   them. Overwrite only with explicit approval.
6. If the repository already has a release script, keep it and record the
   existing behavior in the handoff instead of replacing it silently.

## Update mode specifics

1. Load `<target>/.harness.json`.
2. Run the renderer with `--merge` and the current harness commit.
3. Run verification.
4. Report the harness commit change, new files, changed files and skipped files.
5. Never overwrite user-edited workflows or `AGENTS.md` content.

## Audit mode specifics

1. Run `node scripts/verify-setup.mjs <target>`.
2. Compare `.harness.json` with the files on disk.
3. Report drift as a table: file, expected, actual.
4. Make no changes.
