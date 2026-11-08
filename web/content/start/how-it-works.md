---
title: How it works
description: The pipeline, scope, modes, project types and verification.
---

# How it works

## The pipeline

1. **Decisions** — what the harness standardizes and what it leaves out.
2. **Questions** — the agent detects what it can and asks the rest.
3. **Render** — `scripts/render.mjs` writes the files deterministically.
4. **Verify** — `scripts/verify-setup.mjs` checks the result.

| Deterministic | Agent judgment |
| --- | --- |
| Workflows, scripts, release template | Interview answers |
| `AGENTS.md` sections | Mode, type and adoption decisions |
| `.harness.json` shape | Diffs, conflicts and approval |
| Verification checks | Content reconciliation |

## Scope

Covered: agent contract, commit policy, versioning, releases, CI/build/deploy,
hygiene, skill access, verification.

Not covered: technology stacks, frameworks, architecture, dependency choices,
application code, hosting beyond GitHub Pages, analytics.

## Modes

| Mode | When | Behavior |
| --- | --- | --- |
| `new` | Empty or new repository | Create every file |
| `adopt` | Existing repository | Merge, skip existing files, report |
| `update` | `.harness.json` exists | Reuse answers, re-render, merge |
| `audit` | Read-only review | Verify and report drift |

Adoption never deletes `AGENTS.md` content. It appends only missing sections and
maps aliases such as `Committing and pushing` to `Commits and pushes`.

## Project types

| Type | Build artifact | Deploy question |
| --- | --- | --- |
| `web` | static bundle | yes |
| `mobile` | platform package | no |
| `desktop` | installer or archive | no |
| `library` | package or archive | no |
| `data` | none | yes |

The type chooses questions and optional jobs. It never infers a stack, command or
dependency.

## Generated vs owned

**Generated:** `AGENTS.md`, `docs/RELEASE_TEMPLATE.md`, `scripts/release-notes.mjs`,
version scripts, workflows, PR template, `CODEOWNERS`, `.harness.json`.

**Owned by the project:** application code, `README.md`, existing workflows,
existing release scripts, custom `AGENTS.md` sections, `.agent/` (read-only).

## Verification

Thirteen checks cover the state file, `AGENTS.md`, the release template and
engine, version tooling, workflows, commands, skills, `.gitignore` and hygiene.

It does not prove that checks pass, that workflows are valid YAML or that the
project builds. Those are CI and agent responsibilities.

```bash
node scripts/verify-setup.mjs <target>
```

`.agent` not being initialized is a note, not a failure. Existing sections such as
`Tech stack` are reported, not rejected.

## Next

- [Configuration](../configure/configuration.md)
- [Reference](../reference/reference.md)
