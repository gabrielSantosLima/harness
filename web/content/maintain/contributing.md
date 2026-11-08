---
title: Contributing
description: Layout, development, templates, releases, pilots and docs.
---

# Contributing

## Repository layout

```text
setup/           Decisions, questions, playbook, schema, prompt
guidelines/      Composable AGENTS.md sections
templates/       Deterministic assets copied into projects
skills/          Universal skill library
scripts/         render.mjs, verify-setup.mjs, release scripts
tests/           End-to-end tests, pilots and fixtures
web/             Documentation site (builder, theme, content)
docs/            Release template and project documents
```

Source of truth: `setup/decisions.md` for rules, `setup/questions.md` for the
interview, `setup/harness.schema.json` for the state, `guidelines/` and
`templates/` for output, `skills/` for skills.

## Development

```bash
node tests/run.mjs          # end-to-end suite
node tests/pilot.mjs        # new, adopt and update pilots
node web/build.mjs --check  # build docs and verify links
```

Every change to `templates/`, `guidelines/` or `scripts/` must keep both suites
green for all five project types. The renderer stays deterministic: no
timestamps, no network, no environment-dependent output.

## Changing templates

1. Add or edit the template under `templates/`.
2. Use `{{token}}` for harness values; leave GitHub `${{ ... }}` untouched.
3. Add conditional output in `scripts/render.mjs` when needed.
4. Add or update a fixture test.
5. Update this documentation.

For a guideline section: create `guidelines/<name>.md`, start with
`## Heading`, add a `{{sec_<name>}}` slot to `templates/AGENTS.md`, map it in the
renderer and test it.

Changing a locked decision requires updating `setup/decisions.md`, the questions,
the templates and the tests together. Bump the harness version when breaking.

## Skills

Add a skill under `skills/<id>/SKILL.md`, register it in `skills/README.md`, add
it to `setup/harness.schema.json`, the renderer descriptions and this docs page.
Follow the checklist in [Skills](../skills/skills.md#writing-a-skill).

## Releasing the harness

Before releasing:

- [ ] `node tests/run.mjs` green.
- [ ] `node tests/pilot.mjs` green.
- [ ] `node web/build.mjs --check` green.
- [ ] READMEs and docs updated.
- [ ] Working tree clean.

```bash
gh workflow run release.yml -f bump=minor -f summary="Short summary"
```

The workflow runs CI, resolves the version, generates notes, tags and publishes
the release. `-` versions are prereleases. Never move a published tag.

## Pilots

```bash
node tests/pilot.mjs --keep
```

The pilots create real temporary git repositories and exercise new, adopt and
update flows, including the `.agent` submodule and sparse checkout. The real
adoption pilot used `gabrielSantosLima/mimose@949fa11` in a temporary clone and
passed 13/13 checks.

## Documentation

The site is built by `web/build.mjs` from `web/content/`. Rules:

- one Markdown file per page, listed in `web/content/navigation.json`;
- frontmatter with `title` and `description`;
- English only;
- internal links use relative `.md` paths;
- code fences for commands;
- keep the navigation flat: eight pages in five groups.

`node web/build.mjs --check` fails on a missing page or a broken internal link.

## Next

- [Operations](operations.md)
- [Skills](../skills/skills.md)
