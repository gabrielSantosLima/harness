---
title: Changing templates
description: How to add or edit a template, guideline or decision.
---

# Changing templates

## Adding a guideline section

1. Create `guidelines/<name>.md`.
2. Start with a `## Heading`.
3. Use the template tokens supported by the renderer.
4. Include it in `templates/AGENTS.md` with a `{{sec_<name>}}` slot.
5. Map it in `scripts/render.mjs` when it is conditional.
6. Add or update a fixture test.
7. Run `node tests/run.mjs` and `node tests/pilot.mjs`.

## Adding a workflow

1. Create `templates/.github/workflows/<name>.yml`.
2. Use `{{token}}` for harness values and leave `${{ ... }}` untouched.
3. Add the output condition in `buildOutputs`.
4. Add a test that asserts the file exists only when configured.
5. Update `reference/workflows.md`.

## Changing a decision

`setup/decisions.md` is a contract. To change it:

1. Explain the reason and the impact.
2. Update decisions, questions, templates and tests together.
3. Bump the harness version if the change is breaking.
4. Update this documentation.

## Conditional syntax

```text
{{#if flag}}content{{else}}other content{{/if}}
{{#unless flag}}content{{/unless}}
{{value}}
```

Nested same-kind blocks are supported by the parser.

## Next

- [Development](development.md)
- [Scopes and decisions](../concepts/decisions.md)
