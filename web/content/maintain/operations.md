---
title: Operations
description: Submodule, audits, CI fixes, release recovery, Pages and adoption.
---

# Operations

## Submodule operations

`.agent` is a pinned submodule with a sparse checkout limited to `skills/`.

```bash
git clone --recurse-submodules <repo>
git submodule update --init --recursive
git submodule update --remote .agent
git -C .agent sparse-checkout set skills
```

Review `git diff --submodule` before committing an update. To pin a specific
commit, fetch, checkout it inside `.agent`, then `git add .agent`.

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

- **Agent ignores `AGENTS.md`**: confirm it is at the repository root; Claude Code
  needs the global pointer in `~/.claude/CLAUDE.md`.
- **Skill not used**: confirm it is listed in `AGENTS.md` and exists in
  `.agent/skills/<id>/SKILL.md`; mention it explicitly.
- **`.agent` empty**: `git submodule update --init --recursive`.
- **Skills missing after update**: `git -C .agent sparse-checkout set skills`.
- **Agent edits `.agent`**: stop it; the submodule is read-only.
- **Cannot clone the harness**: use a local clone and the local quick start.

## Next

- [Contributing](contributing.md)
- [Skills](../skills/skills.md)
