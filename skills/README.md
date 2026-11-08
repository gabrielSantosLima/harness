# Skills

Universal, agent-agnostic skills. Each skill is a directory with a `SKILL.md`
file; supporting scripts and references live beside it.

Agents read `.agent/skills/<id>/SKILL.md` in generated projects. In this
repository, the source of truth is `skills/`.

| Skill | Purpose | Project default |
| --- | --- | --- |
| `commit-and-push` | Review, stage, commit and push with Conventional Commits. | Yes |
| `release-summary` | Write a short user-facing summary of the latest release. | Yes |
| `release-cut` | Trigger, watch and verify a release. | Yes |
| `add-skill` | Create a new skill or a proposal for one. | Yes |
| `project-setup` | Configure a repository from the harness. | Harness only |

## Conventions

- ID = lowercase kebab-case directory name.
- Frontmatter: `name` and `description`; the description says when to use it.
- English, imperative, numbered steps.
- No agent-specific tool names. If the agent has a question tool, it may use
  it; otherwise it asks in plain text.
- Supporting files stay inside the skill directory and are referenced by
  relative path.
- Never write into `.agent/`.

See `skills/add-skill/SKILL.md` for the full checklist.
