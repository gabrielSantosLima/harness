<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gabrielSantosLima/harness/main/web/assets/logo-dark.svg">
  <img src="https://raw.githubusercontent.com/gabrielSantosLima/harness/main/web/assets/logo.svg" alt="harness" width="112" />
</picture>

# harness

A universal, stack-agnostic project setup harness and reusable skill library.

[![CI](https://github.com/gabrielSantosLima/harness/actions/workflows/ci.yml/badge.svg)](https://github.com/gabrielSantosLima/harness/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://gabrielSantosLima.github.io/harness/)
[![Release](https://img.shields.io/github/v/release/gabrielSantosLima/harness?label=release)](https://github.com/gabrielSantosLima/harness/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md)

</div>

It configures any repository with the same foundation:

- a single `AGENTS.md` with the project commands, language rules, commit policy,
  release policy, CI/build contract, skill access and safety rules;
- Conventional Commits and a safe staging policy;
- Semantic Versioning, a manual `Release` GitHub Action and generated release
  notes;
- CI, build and deploy workflows chosen per project;
- `.agents/`, the skill library as a pinned submodule or a copy;
- `.harness.json`, the committed setup state used for updates and drift audits.

It deliberately does not cover technology stacks, frameworks, dependencies or
architecture. Those belong to the projects or to future optional skills.

## Use it in a project

From the target repository, paste this into the agent:

```text
Use the harness at https://github.com/gabrielSantosLima/harness to configure this
repository. Read setup/PROMPT.md from that repository and follow it exactly.
```

The agent fetches the public harness into a temporary directory, runs the
interview, renders the files, verifies the result and removes the clone. Nothing
is committed, pushed or tagged.

If you prefer to work from a local clone:

```bash
git clone https://github.com/gabrielSantosLima/harness.git
cd harness
node scripts/render.mjs \
  --answers <answers.json> \
  --target <path-to-project> \
  --merge \
  --skills-mode submodule \
  --submodule https://github.com/gabrielSantosLima/harness.git \
  --commit "$(git rev-parse HEAD)"
node scripts/verify-setup.mjs <path-to-project>
```

Use `--skills-mode copy` instead of `--submodule` when the target cannot use a
submodule. The interview asks which mode to use.

See [`setup/PROMPT.md`](setup/PROMPT.md) for the remote bootstrap and
[`setup/SETUP.md`](setup/SETUP.md) for the full playbook.

## Run a single skill

To use one skill without configuring the repository, read
[`skills/PROMPT.md`](skills/PROMPT.md) and paste the prompt with the skill ID.
The agent clones the harness into a temporary directory, runs the skill and
removes the clone. Nothing is installed permanently.

## Repository layout

```text
setup/
  PROMPT.md              Remote bootstrap prompt
  SETUP.md               The interactive playbook
  decisions.md           Locked decisions and house rules
  questions.md           Question bank
  verify.md              Definition of done
  harness.schema.json    Shape of .harness.json
  answers.example.json   Complete answers example
guidelines/              Composable AGENTS.md sections
templates/               Deterministic assets copied into projects
  AGENTS.md
  docs/RELEASE_TEMPLATE.*.md
  scripts/               release-notes, next-version, bump-version
  .github/               CI, build, release, deploy, PR template
skills/                  Universal, agent-agnostic skill library
  project-setup/         Harness only
  commit-and-push/
  release-summary/
  release-cut/
  add-skill/
scripts/
  render.mjs             Renders templates into a target
  verify-setup.mjs       Verifies a generated repository
tests/
  run.mjs                End-to-end tests
  pilot.mjs              New/adopt/update pilots
  fixtures/              Answers for the five project types
```

## Project types

| Type | Build artifact | Deploy question |
| --- | --- | --- |
| `web` | static bundle | yes |
| `mobile` | platform package | no |
| `desktop` | installer or archive | no |
| `library` | package or archive | no |
| `data` | none | yes |

The type only selects which questions are asked and which generic jobs are
generated. No stack is inferred.

## Agent instructions and skills

`AGENTS.md` is the single instruction file. It works natively in Codex, Cline,
OpenCode, Cursor and GitHub Copilot. The renderer also writes two thin bridges so
the same content loads in tools with their own file name:

- `CLAUDE.md` imports `AGENTS.md` and is what Claude Code reads;
- `GEMINI.md` imports `AGENTS.md` and is what Gemini CLI reads by default.

Skills live at `.agents/skills/<id>/SKILL.md`, the interoperable Agent Skills
path. Codex, Cline, Gemini CLI, OpenCode, Cursor and Copilot discover it
natively. Claude Code does not scan it, so `AGENTS.md` still tells the agent to
read the matching `SKILL.md` on demand; that works for any agent that can read
files.

Generated projects reference the library through the `.agents/` submodule with a
sparse checkout limited to `skills/`, or receive a copy when the submodule is
not wanted. In this repository, run OpenCode with the included
`.opencode/opencode.json`, or read the skill files directly. Add a skill with
[`skills/add-skill/SKILL.md`](skills/add-skill/SKILL.md).

## Requirements

- Node.js 20 or newer (renderer, verifier and release scripts).
- Git, and the GitHub CLI (`gh`) for releases.
- `git` submodule support in the target repository when using submodule mode.

## Development

```bash
node tests/run.mjs        # run the end-to-end suite
node tests/pilot.mjs      # run the new/adopt/update pilots
node web/build.mjs --check # build the documentation site and verify links
```

Every change to `templates/`, `guidelines/` or `scripts/` must keep the suite
green for all five project types.

The documentation is published at <https://gabrielSantosLima.github.io/harness/>.
See [`docs/pilots.md`](docs/pilots.md) for the recorded pilots, including the
adoption of a real public repository.

## Releasing the harness

The harness follows its own contract:

```bash
gh workflow run release.yml -f bump=minor -f summary="..."
```

The workflow runs the tests, resolves the next version from the latest `vX.Y.Z`
tag, generates notes from Conventional Commits and creates the GitHub release.
The first release is `v0.1.0`.

## License

MIT. See [LICENSE](LICENSE).
