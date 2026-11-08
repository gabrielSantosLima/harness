## Skills

{{#if isHarness}}This repository is the source of the skill library. Skills live in
`{{skillsRoot}}/<id>/SKILL.md`; add or change them there and update
`{{skillsRoot}}/README.md`.
{{else}}Universal skills live in `{{skillsRoot}}/<id>/SKILL.md`, a read-only git submodule
pinned to the harness repository.
{{/if}}
Before a task that matches a skill, read its `SKILL.md` and follow it:

{{skillBullets}}

{{#if isHarness}}Never include credentials, absolute paths or project-specific details in a skill.
{{else}}Do not copy or edit files under `{{skillsRoot}}/`. To add or change a skill, write a
proposal to `docs/skill-proposals/<id>.md` and apply it in the harness repository.
{{/if}}
