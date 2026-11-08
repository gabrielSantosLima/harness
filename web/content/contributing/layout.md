---
title: Repository layout
description: Every directory in the harness and what it does.
---

# Repository layout

```text
setup/           Decisions, questions, playbook, schema, prompt
guidelines/      Composable AGENTS.md sections
templates/       Deterministic assets copied into projects
  AGENTS.md
  docs/          Release note templates
  scripts/       release-notes, next-version, bump-version
  .github/       CI, build, release, deploy, PR template
skills/          Universal skill library
scripts/         render.mjs, verify-setup.mjs, harness release scripts
tests/           End-to-end tests, pilots and fixtures
web/             Documentation site (builder, theme, content)
docs/            Release template and project documents
```

## Source of truth

| Concern | File |
| --- | --- |
| House rules | `setup/decisions.md` |
| Interview | `setup/questions.md` |
| State shape | `setup/harness.schema.json` |
| Agent contract | `guidelines/*.md` + `templates/AGENTS.md` |
| Skills | `skills/` |
| Verification | `scripts/verify-setup.mjs` |
| Docs | `web/content/` |

## Next

- [Development](development.md)
- [Templates](templates.md)
