# {{name}}

{{description}}

## Project type

{{typeText}}

## Commands

{{commandsBlock}}

{{sec_language}}

{{sec_commits}}

{{sec_releases}}

{{sec_build}}

{{#if deployEnabled}}
## Deploy

- Deploy target: {{deployTargetText}}.
- Deploy trigger: {{deployTriggerText}}.
- Published artifact: `{{deployArtifact}}`.
{{/if}}

{{#if isHarness}}
{{sec_harness}}
{{/if}}
{{sec_skills}}

{{sec_safety}}

{{#if isData}}
{{sec_data}}
{{/if}}
