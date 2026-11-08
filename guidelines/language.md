## Language rules

- All code, identifiers, comments, documentation, commit messages and release
  notes are written in English.
- User-facing strings follow the project's own localization approach. Never
  hardcode a second language in code; keep locales in sync.
{{#if notesNotEnglish}}
- Release notes are user-facing text and are written in `{{notesLanguage}}`.
{{/if}}
