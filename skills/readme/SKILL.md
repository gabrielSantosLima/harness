---
name: README
description: Create, standardize, or translate a README following the harness template, with a centered header, badges, language selector and consistent sections. Use when the user asks to write, rewrite, update, standardize or translate a README.
---

# README

Write or restructure a README using the template in
`references/template.md`. The English file is canonical; translations mirror its
structure.

## 1. Inspect the repository

Collect:

- existing `README.md`, `README.pt-BR.md`, `README.es.md`;
- the license file and type;
- logo candidates (`assets/logo.png`, `assets/images/logo.png`, `icon.png`, ...);
- the project description from a manifest, if any;
- the default branch and remote (`git remote get-url origin`);
- existing workflows under `.github/workflows/`.

Never infer features. Use what the repository and the user provide.

## 2. Ask

Ask in one round:

1. **Languages**: English only, English + Portuguese, English + Spanish, or all
   three. Default to the languages that already exist; if none, ask.
2. **Logo**: none, or a path. Suggest a detected candidate.
3. **Badges**: CI, Release, Docs, License. Default: Release and License, plus CI
   when `ci.yml` exists, plus Docs when a Pages workflow exists.
4. **Sections**: Features, Requirements, Getting started, Usage, Configuration,
   Development, Testing, Releasing, Contributing, License. Default to the ones
   the repository can support with real content.

Do not add a section you cannot fill truthfully.

## 3. Resolve the metadata

- `owner/repo` from the remote. Accept SSH and HTTPS URLs.
- Project name from the user or the manifest. Use the display name, not the
  package slug.
- One-line description from the user or the manifest.
- License: use the file name (`LICENSE`) and the detected type
  (`MIT`, `Apache-2.0`, ...).

## 4. Write the English README

Follow `references/template.md`:

```html
<div align="center">

<img src="<logo>" alt="<name>" width="200" />

# <name>

<description>

[badges]

[language selector]

</div>
```

Then the chosen sections.

## 5. Write translations

Create `README.pt-BR.md` and/or `README.es.md` only when chosen.

- Mirror the section order and links.
- Translate prose; keep commands, code, file names and URLs unchanged.
- Keep the same language selector in every file, in this order:
  `[English](README.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md)`
- Do not translate badges, version numbers or brand names.

## 6. Preserve existing content

- Read the current README before writing.
- Keep useful commands, features and notes; move them into the new structure.
- Do not delete content without explicit approval.
- Show a diff before writing when a README already exists.

## 7. Validate

- Title matches the project display name.
- Badge URLs point to the real repository and existing workflows.
- The license badge points to `LICENSE`.
- Every language link points to an existing file.
- Section headings are consistent across languages.
- No secret, token, local path or agent attribution appears.
- Relative links resolve.

## 8. Hand off

Report the files created or changed, the chosen languages, the badges, the
sections included and anything the user must fill in. Do not commit, push or tag
unless the user asks.

## Boundaries

- Never invent features, commands or screenshots.
- Never add a language file without the matching selector entry.
- Never overwrite unrelated sections without approval.
- Never add AI attribution or tool mentions.
