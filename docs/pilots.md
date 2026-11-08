# Pilots

Record of the end-to-end pilots run against real git repositories. The automated
pilots live in `tests/pilot.mjs`; the adoption pilot uses a public repository.

Harness revision used: the commit that introduced this file.

## Automated pilots

Run:

```bash
node tests/pilot.mjs
```

| Pilot | Scenario | Result |
| --- | --- | --- |
| 1 | Brand-new repository, `--submodule` with a local harness path, sparse checkout | Passed |
| 2 | Existing repository with `AGENTS.md`, `package.json` and a custom section, `--merge` | Passed |
| 3 | Re-render (update) of pilot 1 | Passed, idempotent, no commits |

What the pilots assert:

- `.agent/skills/<id>/SKILL.md` exists and `.agent/templates` is hidden by the
  sparse checkout;
- `.harness.json` records the pinned harness commit;
- `verify-setup` passes with 13/13 checks;
- the pilot creates no commit, push or tag;
- an existing `AGENTS.md` keeps its introduction and custom sections, and gains
  only the missing harness sections;
- application files such as `package.json` are untouched;
- a second render is idempotent.

## Adoption pilot: mimose

Public repository: `gabrielSantosLima/mimose` at `949fa11`, cloned shallow into a
temporary directory. Nothing was pushed.

Inputs: `web`, CI depth `ci`, no checks configured yet, tags-only versioning,
GitHub Pages on release, all four skills, PR template and `CODEOWNERS`.

```bash
git clone --depth 1 https://github.com/gabrielSantosLima/mimose.git mimose-pilot
node scripts/render.mjs \
  --answers mimose-pilot-answers.json \
  --target mimose-pilot \
  --merge \
  --submodule "C:/Users/limag/projects/gabriel/harness" \
  --commit "$(git rev-parse HEAD)"
node scripts/verify-setup.mjs mimose-pilot
```

Result: 13/13 checks passed.

| Action | Files |
| --- | --- |
| Merged | `AGENTS.md` (existing content preserved) |
| Created | `scripts/release-notes.mjs`, `scripts/next-version.mjs`, `.github/workflows/ci.yml`, `.github/pull_request_template.md`, `.github/CODEOWNERS`, `.harness.json` |
| Appended | `.gitignore` |
| Skipped | `docs/RELEASE_TEMPLATE.md`, `.github/workflows/release.yml`, `.github/workflows/deploy.yml` (already existed) |
| Submodule | `.agent` added, sparse checkout limited to `skills/` |

Observations:

- The existing `Tech stack` section is preserved. Verification reports it as an
  existing project section, not as a harness failure.
- The first run produced semantic duplicates because the repository uses
  `Committing and pushing`, `Releases` and `Deployment` instead of the harness
  headings. The merge now maps these aliases, so the second run added only
  `Project type`, `Commands`, `CI and build`, `Skills` and `Secrets and safety`.
- Existing workflows are never overwritten. Their content is reported as
  skipped and must be reconciled with the agent during adoption.
- With no check commands, the generated CI fails on purpose until the commands
  are added to `.harness.json` and `.github/workflows/ci.yml`. This is the
  intended guard against a silent pass.

## Remote bootstrap pilot

`setup/PROMPT.md` was validated by cloning the harness into a temporary
directory and running the same render and verify commands used by the prompt.
The public clone and the local clone behave identically; only the clone path
differs.

The prompt itself was not executed by a remote agent in this run.

## Known limitations

- Adoption does not merge existing workflow content; it skips the file and
  reports it. Reconciling is an agent task.
- The `.agent` submodule was added from a local path in the pilots. The remote
  HTTPS URL follows the same commands and is used by `setup/PROMPT.md`.
- The Claude Code global pointer is documented but not exercised here.
- `verify-setup` runs from the harness tree, not from the target, because
  `.agent` contains only `skills/`.

## Reproducing

```bash
node tests/run.mjs
node tests/pilot.mjs
```

Use `--keep` to preserve the temporary repositories and inspect the output.
