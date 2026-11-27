## Skills

{{#if isHarness}}This repository is the source of the skill library. Skills live in
`{{skillsRoot}}/<id>/SKILL.md`; add or change them there and update
`{{skillsRoot}}/README.md`.
{{else}}{{#if skillsSubmodule}}Universal skills live in `{{skillsRoot}}/<id>/SKILL.md`, a read-only git
submodule pinned to the harness repository.
{{else}}Universal skills live in `{{skillsRoot}}/<id>/SKILL.md`, a snapshot copied by the
harness. Re-run the harness update to refresh it; never edit the copy.
{{/if}}{{/if}}
Before a task that matches a skill, read its `SKILL.md` and follow it:

{{skillBullets}}

{{#if isHarness}}Never include credentials, absolute paths or project-specific details in a skill.
{{else}}{{#if skillsSubmodule}}Do not copy or edit files under `{{skillsRoot}}/`. To add or change a skill, write a
proposal to `docs/skill-proposals/<id>.md` and apply it in the harness repository.
{{else}}{{#if skillsCopy}}Do not edit files under `{{skillsRoot}}/`. To add or change a skill, write a
proposal to `docs/skill-proposals/<id>.md` and apply it in the harness repository.
{{/if}}{{/if}}{{/if}}
