---
title: Writing a skill
description: Structure, naming and the validation checklist.
---

# Writing a skill

## Layout

```text
skills/<id>/
  SKILL.md
  scripts/...
  references/...
```

The directory name is the ID. Supporting files are referenced by relative path
and are not loaded automatically.

## Frontmatter

```markdown
---
name: Short display name
description: What it does and when to use it, with words a user is likely to type.
---
```

The `description` drives discovery. Include the trigger, not just the topic.

## Body

1. When to use.
2. Steps, numbered.
3. Commands, copy-pasteable.
4. Boundaries.
5. Source link, when relevant.

## Checklist

- [ ] `SKILL.md` inside `skills/<id>/`.
- [ ] `name` and `description` present.
- [ ] English, imperative.
- [ ] No agent-specific tools.
- [ ] No absolute paths or secrets.
- [ ] Boundaries for git, release or file writes.
- [ ] Registered in `skills/README.md`.
- [ ] Under ~150 lines, or split into references.

## Next

- [add-skill](add-skill.md)
- [Contributing: skills](../contributing/templates.md)
