---
title: Operations
description: Submodule, audits, CI fixes, release recovery, Pages and adoption.
---

# Operations

## Skills delivery

Submodule mode (default): `.agents` is a pinned submodule with a sparse checkout
limited to `skills/`.

```bash
git clone --recurse-submodules <repo>
git submodule update --init --recursive
git submodule update --remote .agents
git -C .agents sparse-checkout set skills
```

Review `git diff --submodule` before committing an update. To pin a specific
commit, fetch, checkout it inside `.agents`, then `git add .agents`.

Copy mode: `.agents/skills/` is a snapshot of the harness library and
`.agents/README.md` marks it as a copy. There is no submodule to initialize.
Refresh it with the renderer:

```bash
node scripts/render.mjs --answers .harness.json --target . --merge --skills-mode copy
```

On Windows, enable long paths, use a real submodule (not a junction) and keep
`* text=auto eol=lf` in `.gitattributes`.

## Auditing drift

Audit is read-only. Run:

```bash
node scripts/verify-setup.mjs .
```

Then compare `.harness.json` with the files on disk: workflows, check commands,
build command, version field, skills and ignore patterns. Report drift as
`file | expected | actual`. For generated files, fix the answer or template and
re-render. For user-edited files, decide whether the edit is intentional.

## CI fails on purpose

With `ci` or `full` and no checks, the generated job exits with an error. That is
intended. Add the real commands to `.harness.json` (or `ci.yml`), run them
locally and verify. If the project is not ready for gates, use `release-only` and
accept the recorded gap.

## Release failures

```bash
gh run list --workflow release.yml --limit 5
gh run view <run-id> --log-failed
```

| Symptom | Fix |
| --- | --- |
| Quality failed | Fix the code and re-run |
| Version resolution failed | Check the previous tag and bump |
| Tag exists | Cut a new patch version |
| Artifacts missing | Fix paths and rebuild |
| Release object missing | Recreate from the tag |

Never move or reuse a published tag. Never force-push to repair a release.

## Pages troubleshooting

| Problem | Fix |
| --- | --- |
| 404 on refresh | Add `404.html` or use hash routing |
| Blank page | Fix the base path for `/<repo>/` |
| Deploy skipped | `workflow_run` needs a successful release |
| Permission denied | Set Pages source to GitHub Actions |

## Adopting existing projects

Adoption merges `AGENTS.md` and `.gitignore`, writes `.harness.json` and skips
existing workflows, release templates and release scripts. The handoff lists
every skipped file.

Recommended sequence:

1. Dry-run and inspect the diffs.
2. Render with `--merge`.
3. Diff existing workflows against a temporary render.
4. Decide per file: keep, replace or merge.
5. Verify.
6. Commit as one configuration change.

Semantic aliases prevent duplicate headings, but conflicting sections are
reported, not rewritten.

## Agent troubleshooting

- **Agent ignores `AGENTS.md`**: confirm it is at the repository root. Claude Code
  reads `CLAUDE.md`, Gemini CLI reads `GEMINI.md`; both generated bridges import
  `AGENTS.md`.
- **A bridge is missing or stale**: re-render. `CLAUDE.md` and `GEMINI.md` are
  generated with `@AGENTS.md`; existing files are never overwritten without
  `--force`.
- **Skill not used**: confirm it is listed in `AGENTS.md` and exists in
  `.agents/skills/<id>/SKILL.md`; mention it explicitly.
- **`.agents` empty**: `git submodule update --init --recursive`.
- **Skills missing after update**: `git -C .agents sparse-checkout set skills`.
- **Agent edits `.agents`**: stop it; the directory is read-only in both modes.
- **Cannot clone the harness**: use a local clone and the local quick start, or
  use `--skills-mode copy`.

## Next

- [Contributing](contributing.md)
- [Skills](../skills/skills.md)
