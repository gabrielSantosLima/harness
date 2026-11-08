---
title: Harness
description: A universal, stack-agnostic project setup harness and reusable skill library.
---

<div align="center">

# harness

A universal, stack-agnostic project setup harness and reusable skill library.

[![CI](https://github.com/gabrielSantosLima/harness/actions/workflows/ci.yml/badge.svg)](https://github.com/gabrielSantosLima/harness/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://gabrielSantosLima.github.io/harness/)
[![Release](https://img.shields.io/github/v/release/gabrielSantosLima/harness?label=release)](https://github.com/gabrielSantosLima/harness/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/gabrielSantosLima/harness/blob/main/LICENSE)

</div>

Harness configures any repository with the same foundation: agent guidelines,
commit policy, versioning, release automation, CI/build contracts, deploy and a
shared skill library. It asks a short, structured interview and generates the
files the project needs. No stacks, frameworks or architecture are assumed.

## Start here

| If you want to… | Read |
| --- | --- |
| Configure a repository in one prompt | [Remote quick start](getting-started/remote.md) |
| Understand the model before using it | [How it works](introduction/how-it-works.md) |
| See what a setup produces | [Your first setup](getting-started/first-setup.md) |
| Add or change a skill | [Skills](skills/index.md) |
| Look up a flag or field | [Reference](reference/render.md) |

## Configure a project

Paste this into the agent running in the target repository:

```text
Use the harness at https://github.com/gabrielSantosLima/harness to configure this
repository. Read setup/PROMPT.md from that repository and follow it exactly.
```

The agent fetches the public harness into a temporary directory, runs the
interview, renders the files, verifies the result and removes the clone. Nothing
is committed, pushed or tagged.

## What it produces

- a single `AGENTS.md` with the project commands, language rules, commit policy,
  release policy, CI/build contract, skill access and safety rules;
- Conventional Commits and a safe staging policy;
- Semantic Versioning, a manual `Release` workflow and generated release notes;
- CI, build and deploy workflows chosen per project;
- `.agent/`, a pinned submodule that exposes the skill library to any agent;
- `.harness.json`, the committed setup state used for updates and drift audits.

## Principles

- **Universal**: the same rules for every project, independent of language or
  tooling.
- **Deterministic**: templates and a renderer, not free-form generation.
- **Agent-agnostic**: `AGENTS.md` plus files under `.agent/skills`, readable by
  any agent that can open a file.
- **Safe**: never commits, pushes, tags or overwrites user content on its own.

The documentation is available in English only. The READMEs are also published
in [Portuguese](https://github.com/gabrielSantosLima/harness/blob/main/README.pt-BR.md)
and [Spanish](https://github.com/gabrielSantosLima/harness/blob/main/README.es.md).
