---
title: Agent compatibility
description: How different agents read the harness and its skills.
---

# Agent compatibility

The contract is two things: `AGENTS.md` and files under `.agent/skills/`.

| Agent | Reads `AGENTS.md` | Skills | Setup |
| --- | --- | --- | --- |
| Codex | Yes | Read on demand | None |
| OpenCode | Yes | Read on demand; optional native config | None |
| Cursor | Usually | Read on demand | None |
| Claude Code | No, reads `CLAUDE.md` | Read on demand | Global pointer |
| Generic | If instructed | Read on demand | None |

## Why this works

Skills are plain Markdown. The only requirement is that the agent can read a
file when `AGENTS.md` points to it.

## OpenCode

The harness repository includes `.opencode/opencode.json` pointing at `./skills`.
Generated projects do not need it; the `AGENTS.md` instruction is enough. Native
discovery can be added with a `skills` entry in the project config.

## Cursor

Add the project `AGENTS.md` to the rules or instruct the agent to read it. No
generated files are required.

## Claude Code

See [Claude Code](claude-code.md) for the global pointer.

## Next

- [Troubleshooting](troubleshooting.md)
- [Skills](../skills/index.md)
