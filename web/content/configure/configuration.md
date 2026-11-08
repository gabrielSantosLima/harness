---
title: Configuration
description: Interview rounds, commit policy, versioning, release notes, hygiene and AGENTS.md.
---

# Configuration

## Interview

The agent follows `setup/questions.md`, detects before asking and asks at most
four questions per round.

| Round | Topics |
| --- | --- |
| 1 | Identity, project type, license, commit autonomy |
| 2 | Existing `AGENTS.md`, harness source, skills, README, branch |
| 3 | Checks, CI depth, OS matrix, build and artifacts |
| 4 | Version source, release language and notes, deploy |
| 5 | Hygiene files and local-only ignores |

Before writing, the agent shows the detection summary, the answers file, the
resulting tree, diffs for existing files and the exact commands. It waits for
approval.

## Identity

- Project name and slug.
- One-line description.
- License, `MIT` by default.
- `owner/repo`, detected from the remote.
- Default branch, `main` by default.

## Commit policy

| Autonomy | Behavior |
| --- | --- |
| `commit-and-push-when-asked` | Commit and push only when asked (default) |
| `commit-only-when-asked` | Commit when asked; never push separately |
| `strict` | Every git write action needs a direct instruction |

Rules for every project:

- Conventional Commits: `<type>(<scope>): <description>`.
- Imperative, lowercase, no trailing period, at most 72 characters.
- Allowed types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`,
  `build`, `ci`, `style`.
- Stage explicit paths; never `git add -A`, `git add .` or `git commit -a`.
- No AI attribution, co-author trailers or tool mentions.
- No amend, rebase or force-push without an explicit request.

## Versioning

**Tags only (default):** the version is the latest `vX.Y.Z` tag; nothing is bumped.
The workflow resolves the next version with `scripts/next-version.mjs`.

**File plus field:** when the ecosystem requires it.

```json
{ "source": "file", "file": "package.json", "pointer": "version" }
```

The renderer generates `scripts/bump-version.mjs`, the workflow updates the file
and commits `chore(release): vX.Y.Z`.

| Bump | From `1.2.3` |
| --- | --- |
| `patch` | `1.2.4` |
| `minor` | `1.3.0` |
| `major` | `2.0.0` |
| `prerelease` | `1.2.4-alpha.0`, then `.1` |
| `premajor` / `preminor` / `prepatch` | Corresponding pre-release |

The first release is `v0.1.0`.

## Release notes

Generated from Conventional Commits since the previous tag, using
`docs/RELEASE_TEMPLATE.md`.

| Placeholder | Source |
| --- | --- |
| `{features}` | `feat:` |
| `{fixes}` | `fix:` |
| `{chores}` | refactor, chore, docs, style, perf, test, build, ci |
| `{other}` | Unclassified |
| `{version}`, `{date}`, `{summary}`, `{from}` | Release inputs |

English is suggested; Portuguese and Spanish templates ship with the harness.
`chore(release)` commits are ignored. Describe user-visible changes.

## Hygiene

- `.github/pull_request_template.md` with Summary, Changes, How to test, Notes.
- `.github/CODEOWNERS` with a single owner by default.
- `.gitignore` entries for `PLAN.md`/notes, `.env`/secrets, build output and
  caches. Existing content is preserved and only missing entries are appended.

## AGENTS.md anatomy

| Section | Content |
| --- | --- |
| Title and description | Project name and purpose |
| Project type | Deliverable type |
| Commands | Check, build and release commands |
| Language rules | English and localization policy |
| Commits and pushes | Conventional Commits, staging, autonomy |
| Versioning and releases | Tags or file, workflow, tag rules |
| CI and build | Depth, checks, artifacts |
| Deploy | Only when configured |
| Skills | The `.agent/skills` contract |
| Secrets and safety | What must never be committed |
| Data rules | Only for `data` projects |

The file is self-contained and never includes stack, architecture or dependency
guidance.

## Locked decisions

- English for code, comments, docs, commits and release notes, unless another
  release-notes language is configured.
- No AI attribution anywhere.
- Never commit secrets, environment files or build output.
- Never force-push; never move, delete or reuse a tag.
- Releases only through the workflow, after quality gates.
- Never invent data, sources or dependencies.
- Never commit or push unless the user asked.

## Next

- [CI, build and deploy](ci-build-deploy.md)
- [Skills](../skills/skills.md)
