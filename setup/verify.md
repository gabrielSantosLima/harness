# Definition of done

A setup, update or adopt run is complete only when every applicable item passes.
`node scripts/verify-setup.mjs <target>` automates the mechanical checks; the
agent confirms the judgment items.

## Files

- [ ] `AGENTS.md` exists, is self-contained and has no unreplaced `{{tokens}}`.
- [ ] `.harness.json` validates against `setup/harness.schema.json`.
- [ ] `docs/RELEASE_TEMPLATE.md` exists and every placeholder it uses is
      produced by `scripts/release-notes.mjs`.
- [ ] `scripts/release-notes.mjs` exists.
- [ ] `scripts/next-version.mjs` exists when the version source is tags.
- [ ] `scripts/bump-version.mjs` and the declared version file exist when the
      version source is a file.
- [ ] `.github/workflows/release.yml` exists.
- [ ] `ci.yml` exists for `full` and `ci`; `build.yml` exists for `full`.
- [ ] `deploy.yml` exists when a deploy target is configured.
- [ ] `.github/pull_request_template.md` and `.github/CODEOWNERS` exist when
      enabled.
- [ ] `.gitignore` covers the declared local-only patterns.

## Consistency

- [ ] Every `run:` command in a workflow matches `.harness.json`.
- [ ] Every script referenced by a workflow exists.
- [ ] `AGENTS.md` lists exactly the skills present in `.agent/skills/` and
      selected in `.harness.json`.
- [ ] The version file contains the declared field.
- [ ] `.agent` is a submodule pinned to a harness commit and its `skills/`
      directory contains every selected skill.
- [ ] No stack, framework or architecture section leaked into `AGENTS.md`.
- [ ] `AGENTS.md` command list matches the recorded check and build commands.

## Safety

- [ ] No application code was created or modified.
- [ ] Existing `AGENTS.md` content was preserved; only missing sections were
      added.
- [ ] No existing workflow was overwritten without explicit approval.
- [ ] No secret, environment file, build output or local note is tracked.
- [ ] Nothing was committed, pushed or tagged by the setup run.
- [ ] `git status` shows only the intended files.

## Handoff

- [ ] The report lists configured, skipped and manual steps.
- [ ] Manual steps name the exact place to act (repository settings, secrets,
      Pages source, first release command).
- [ ] With `release-only`, the report states that quality gates are not enforced.
