---
title: Project types
description: The five types and what each one changes.
---

# Project types

| Type | Meaning | Build artifact | Deploy |
| --- | --- | --- | --- |
| `web` | Runs in a browser and is deployed | static bundle | yes |
| `mobile` | Ships as a mobile application | platform package | no |
| `desktop` | Ships as an installer or archive | installer/archive | no |
| `library` | Ships as a package, CLI or archive | package/archive | no |
| `data` | Data files are the product | none | yes |

## What the type controls

- Which extra questions are asked (deploy for `web` and `data`, artifacts for
  `desktop`, `mobile` and `library`).
- Which optional jobs are generated.
- The wording of the generated `AGENTS.md`.

## What the type does not control

- Language, framework, package manager or dependencies.
- Architecture or directory layout.
- Commands. Those come from your answers, not from the type.

## Choosing

Choose by **delivery**, not by technology. A browser game and a marketing site
are both `web`. A CLI written in any language is `library`. A repository whose
YAML/JSON/Markdown files are the product is `data`.

## Next

- [`.harness.json`](harness-json.md)
- [Questions](../setup/interview.md)
