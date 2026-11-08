---
title: readme
description: Create, standardize or translate README files following the harness template.
---

# readme

Writes a README with the same shape used across the harness projects: centered
header, optional logo, title, description, badges, language selector and
consistent sections.

## When to use

- A project has no README.
- An existing README is inconsistent or outdated.
- The user wants Portuguese or Spanish versions.
- Badges, logo or language links need updating.

## What it asks

1. Languages: English only, EN + PT, EN + ES, or all three.
2. Logo: none or a path.
3. Badges: CI, Release, Docs, License.
4. Sections: features, requirements, getting started, usage, configuration,
   development, testing, releasing, contributing, license.

It defaults to what the repository can support with real content.

## What it produces

`README.md` plus `README.pt-BR.md` and/or `README.es.md`, with:

```html
<div align="center">

# project

Description.

[badges]

[English](README.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md)

</div>
```

## Rules

- English is canonical; translations mirror the structure.
- Badges point to real workflows and releases.
- No invented features, commands or screenshots.
- Existing content is preserved and reorganized, not deleted.
- No commit, push or tag unless asked.

The canonical template lives in
[`skills/readme/references/template.md`](https://github.com/gabrielSantosLima/harness/blob/main/skills/readme/references/template.md).

## Next

- [Run a skill remotely](remote.md)
- [Skills index](index.md)
