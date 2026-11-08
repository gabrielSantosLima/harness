---
title: AGENTS.md anatomy
description: Every section of the generated agent contract.
---

# AGENTS.md anatomy

The file is self-contained and written in English. It never includes
architecture, stack or dependency guidance.

## Sections

| Section | Content |
| --- | --- |
| Title and description | Project name and one-line purpose |
| Project type | What kind of deliverable it is |
| Commands | Check, build and release commands |
| Language rules | English and localization policy |
| Commits and pushes | Conventional Commits, staging, autonomy |
| Versioning and releases | Tags or file, workflow, tag rules |
| CI and build | Depth, checks, artifacts |
| Deploy | Only when configured |
| Skills | The `.agent/skills` contract |
| Secrets and safety | What must never be committed |
| Data rules | Only for `data` projects |

## Merge behavior

On adoption, the renderer compares headings and appends only missing sections.
Aliases prevent duplicates:

| Generated | Recognized equivalent |
| --- | --- |
| `Commits and pushes` | `Committing and pushing`, `Commits`, `Git workflow`, `Git` |
| `Versioning and releases` | `Releases`, `Release`, `Versioning` |
| `Deploy` | `Deployment`, `Deploying` |
| `Secrets and safety` | `Security`, `Safety`, `Secrets` |
| `CI and build` | `CI`, `Build`, `CI/CD`, `Build and CI` |
| `Language rules` | `Language`, `Languages` |
| `Skills` | `Agent skills` |
| `Commands` | `Command reference`, `Build and test`, `Development` |

Existing content is never deleted. If an existing section conflicts with a
house rule, the agent proposes the change and asks.

## Next

- [Verify a setup](interview.md)
- [Decisions](../concepts/decisions.md)
