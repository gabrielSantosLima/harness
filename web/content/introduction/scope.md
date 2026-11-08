---
title: Scope and non-goals
description: What the harness covers and what belongs to projects or future skills.
---

# Scope and non-goals

## Covered

- `AGENTS.md` as the single agent contract.
- Conventional Commits, staging and push policy.
- SemVer, tags, release workflow and generated release notes.
- CI depth, OS matrix, build artifacts and deploy.
- Pull request template, `CODEOWNERS` and local-only ignores.
- The `.agent` skill reference.
- Verification and drift audits.

## Not covered

| Area | Why |
| --- | --- |
| Technology stacks and frameworks | The harness is stack-agnostic by design. |
| Architecture and layering | Planned as an optional skill, not a setup concern. |
| Dependency or package-manager choices | Project-specific and fast-moving. |
| Application code | Setup never writes product code. |
| Hosting providers beyond GitHub Pages | Only the generic deploy question exists. |
| Observability, analytics, telemetry | Out of scope. |

## Boundaries that matter

- The harness never commits, pushes or tags.
- The harness never overwrites `AGENTS.md` content; it merges missing sections.
- The harness never overwrites existing workflows without explicit approval.
- Skills are read-only in projects; changes happen in the harness repository.

## Next

- [Project types](../concepts/project-types.md)
- [Locked decisions](../concepts/decisions.md)
