# README template

Canonical shape used by the harness projects. Replace values in angle brackets
and remove optional parts that do not apply.

```markdown
<div align="center">

<img src="<logo-path>" alt="<name>" width="200" />

# <name>

<one-line description>

[![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)](https://github.com/<owner>/<repo>/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://<owner>.github.io/<repo>/)
[![Release](https://img.shields.io/github/v/release/<owner>/<repo>?label=release)](https://github.com/<owner>/<repo>/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md)

</div>

<Short paragraph expanding the one-line description: what it is, who it is for,
and the main value.>

## Key features

- **Feature name** — what it does and why it matters.
- **Feature name** — what it does and why it matters.

## Requirements

- Runtime or tool version.
- External services or credentials.

## Getting started

```bash
<install command>
<run command>
```

## Usage

<Short example, with a code block.>

## Configuration

<Table or list of options. Omit when the project has none.>

## Development

```bash
<install dependencies>
<check / lint / test>
```

## Releasing

<How releases are cut, when the project has automation.>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.
```

## Rules

- The header is centered and contains the logo (optional), title, description,
  badges and language selector.
- Badges: CI only when `ci.yml` exists; Docs only when Pages deploys; Release
  and License always.
- The language selector order is always English, Portuguese (Brazil), Spanish.
- Omit empty sections. Never invent features, commands or screenshots.
- Keep commands in fenced blocks with the correct language.
- Link to `LICENSE`; do not paste the full license text.
- The English file is canonical. Translations mirror the structure.
