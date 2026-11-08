---
title: Interview overview
description: Rounds, defaults and skip rules for the setup questions.
---

# Interview overview

The agent follows
[`setup/questions.md`](https://github.com/gabrielSantosLima/harness/blob/main/setup/questions.md).
It detects before asking and asks at most four questions per round.

## Rounds

| Round | Topics |
| --- | --- |
| 1 | Identity, project type, license, commit autonomy |
| 2 | Existing `AGENTS.md`, harness source, skills, README, branch |
| 3 | Checks, CI depth, OS matrix, build and artifacts |
| 4 | Version source, release language and notes, deploy |
| 5 | Hygiene files and local-only ignores |

## Rules

- Detection wins over questions.
- Multiple choice when possible, recommended option first.
- Skip questions that do not apply (`deploy` for a library).
- Never ask about stacks, frameworks, architecture or dependencies.
- In `update` mode, load `.harness.json` and ask only what changes.

## Before writing

The agent prints:

1. the detection summary;
2. the answers file;
3. the resulting file tree;
4. diffs for existing files;
5. the exact check, build and release commands.

It waits for explicit approval before writing.

## Next

- [Commits](commits.md)
- [Questions reference](../reference/harness-json.md)
