---
title: Remote quick start
description: Configure a repository by pointing the agent at the public harness.
---

# Remote quick start

Use this when you do not want to clone the harness yourself.

## The prompt

Paste this into the agent running in the target repository:

```text
Use the harness at https://github.com/gabrielSantosLima/harness to configure this
repository. Read setup/PROMPT.md from that repository and follow it exactly.
```

The canonical prompt lives at
[`setup/PROMPT.md`](https://github.com/gabrielSantosLima/harness/blob/main/setup/PROMPT.md).

## What the agent does

1. Clones the harness into a temporary directory outside the repository.
2. Reads `setup/PROMPT.md`, `setup/SETUP.md`, the decisions and the questions.
3. Detects the repository state and chooses the mode.
4. Interviews you, at most four questions per round.
5. Shows the answers, the file tree and the diffs, then waits for approval.
6. Renders with `--merge` and adds `.agent` as a submodule.
7. Verifies the result until every check passes.
8. Removes the temporary clone and reports configured, skipped and manual items.

## What it never does

- Modify application code.
- Commit, push or tag.
- Overwrite `AGENTS.md` content.
- Write into `.agent/`.

## If the network is blocked

Clone the harness locally and use the
[local quick start](local.md). The playbook is identical; only the path to the
scripts changes.

## Next

- [Your first setup](first-setup.md)
- [After setup](after-setup.md)
