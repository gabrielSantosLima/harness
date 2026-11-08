---
title: How it works
description: The four-step pipeline behind every setup.
---

# How it works

Every setup follows the same pipeline. The decisions are fixed in the harness;
the answers are per project; the output is deterministic.

## 1. Decisions

[`setup/decisions.md`](https://github.com/gabrielSantosLima/harness/blob/main/setup/decisions.md)
records what the harness standardizes and what it deliberately leaves out. These
are house rules, not project choices.

## 2. Questions

[`setup/questions.md`](https://github.com/gabrielSantosLima/harness/blob/main/setup/questions.md)
is the question bank. The agent detects what it can from the repository and asks
only what is missing. Answers are stored in `.harness.json`.

## 3. Render

`scripts/render.mjs` reads the answers, renders the templates and writes the
generated files. `AGENTS.md` is composed from `guidelines/`. Existing files are
merged, skipped or overwritten only with explicit flags.

## 4. Verify

`scripts/verify-setup.mjs` checks the result: files, workflow commands, version
source, skills, `.gitignore`, hygiene and unreplaced tokens. The setup is done
only when every check passes.

## What is deterministic and what is not

| Deterministic | Agent judgment |
| --- | --- |
| Workflows, scripts, release template | Interview answers |
| `AGENTS.md` sections | Which mode and project type |
| `.harness.json` shape | Adoption diffs and approval |
| Verification checks | Conflict resolution with existing files |

## Next

- [Scope and non-goals](scope.md)
- [Modes](../concepts/modes.md)
- [Your first setup](../getting-started/first-setup.md)
