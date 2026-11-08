---
title: Hygiene
description: Pull request template, CODEOWNERS and local-only ignores.
---

# Hygiene

## Pull request template

Generated at `.github/pull_request_template.md`:

```markdown
## Summary
## Changes
## How to test
## Notes
```

Short, English, no emoji.

## CODEOWNERS

Generated with a single owner for every path:

```text
* @gabrielSantosLima
```

Change it when the repository has more maintainers.

## Local-only ignores

Default patterns:

- `PLAN.md`, `NOTES.md`, `*.local.md`;
- `.env`, `.env.*`, `client_secrets.json`, `secrets.json`, `*.pem`, `*.key`;
- `dist/`, `build/`, `node_modules/`, `target/`, `.venv/`, `__pycache__/`;
- `.DS_Store`, `Thumbs.db`.

Add project-specific patterns during the interview. Existing `.gitignore`
content is preserved and only missing entries are appended.

## Next

- [AGENTS.md anatomy](agents-md.md)
- [Generated files](../concepts/generated-files.md)
