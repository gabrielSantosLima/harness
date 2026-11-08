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
| Configure a repository | [Getting started](start/getting-started.md) |
| Understand the model | [How it works](start/how-it-works.md) |
| Choose options such as CI depth or versioning | [Configuration](configure/configuration.md) |
| Add CI, build or deploy | [CI, build and deploy](configure/ci-build-deploy.md) |
| Run or write a skill | [Skills](skills/skills.md) |
| Look up a flag, field or workflow | [Reference](reference/reference.md) |
| Operate or contribute | [Operations](maintain/operations.md) and [Contributing](maintain/contributing.md) |

## Configure a project

Paste this into the agent running in the target repository:

```text
Use the harness at https://github.com/gabrielSantosLima/harness to configure this
repository. Read setup/PROMPT.md from that repository and follow it exactly.
```

The agent fetches the public harness into a temporary directory, runs the
interview, renders the files, verifies the result and removes the clone. Nothing
is committed, pushed or tagged.

To run a single skill without configuring the repository, use the
[remote skill runner](skills/skills.md#run-a-skill-remotely).

## What it produces

- a single `AGENTS.md` with commands, language rules, commit policy, release
  policy, CI/build contract, skill access and safety rules;
- Conventional Commits and a safe staging policy;
- Semantic Versioning, a manual `Release` workflow and generated release notes;
- CI, build and deploy workflows chosen per project;
- `.agent/`, a pinned submodule that exposes the skill library;
- `.harness.json`, the committed setup state used for updates and audits.

## Principles

- **Universal**: the same rules for every project, independent of tooling.
- **Deterministic**: templates and a renderer, not free-form generation.
- **Agent-agnostic**: `AGENTS.md` plus files under `.agent/skills`.
- **Safe**: never commits, pushes, tags or overwrites user content on its own.

## Languages

The documentation is English only. The READMEs are also published in
[Portuguese](https://github.com/gabrielSantosLima/harness/blob/main/README.pt-BR.md)
and [Spanish](https://github.com/gabrielSantosLima/harness/blob/main/README.es.md).
