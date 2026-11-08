## CI and build

- Recorded CI depth: `{{ciDepth}}`.
{{#if hasCI}}- `CI` runs the project checks on {{osList}}.
{{/if}}{{#if hasChecks}}- Checks, in order:

{{checkBullets}}
{{else}}- No checks are configured yet. CI fails on purpose until the check commands are
  added to `.harness.json` and `.github/workflows/ci.yml`.
{{/if}}{{#if hasBuild}}- Build command: `{{buildCommand}}`.
- Build artifacts: {{artifactList}}.
{{/if}}- Run the declared checks before declaring any task done.
{{#if releaseOnly}}- This project uses `release-only`: quality gates are not enforced before
  tagging. Treat that as a known gap.
{{/if}}
