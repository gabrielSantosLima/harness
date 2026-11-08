## Secrets and safety

- Never commit secrets, API keys, tokens, credentials, `.env` files, local
  environment configuration, build output or local planning notes.
- Never log secrets, prompts or private data.
- Never force-push and never rewrite published history unless the user
  explicitly requests it on a branch they own.
- Never invent data, sources or dependencies. Verify that a dependency exists
  before using it, and cite the source of any external data.
- Handle errors explicitly. Never fail silently.
- Remove dead code, commented-out code and unused imports before committing.
- Do not add comments that restate the code. Use comments only for non-obvious
  decisions.
