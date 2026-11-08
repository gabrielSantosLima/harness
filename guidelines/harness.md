## Operating this repository

- This repository is the harness: it configures other repositories and hosts the
  universal skill library. It does not contain application code.
- Follow `setup/SETUP.md` to configure a target repository. It is the only
  supported entry point.
- `setup/decisions.md` is the locked contract. Change it only with the user, and
  update the templates and tests in the same change.
- `setup/questions.md` is the question bank. Keep it in sync with the decisions.
- `templates/` holds deterministic assets; `guidelines/` holds composable
  `AGENTS.md` sections; `skills/` is the skill source of truth.
- After changing templates, guidelines or scripts, run `node tests/run.mjs` and
  `node tests/pilot.mjs`, and keep every test green.
- Never let a template change break rendering for any of the five project types.
- Do not add stack-specific, framework-specific or architecture guidance here.
  Those belong in a future optional skill.
- Keep the renderer deterministic: no timestamps, no environment-dependent
  output, no network calls.
