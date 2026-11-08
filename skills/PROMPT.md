# Run a single skill remotely

Use this when you want one skill from the harness without configuring the
project: no `AGENTS.md`, no `.harness.json`, no `.agent` submodule.

The agent clones the harness into a temporary directory, reads the skill, runs
it, and removes the clone when done. The temporary clone may live anywhere
outside the repository and is deleted after the skill finishes.

## Prompt

```text
Use the harness at https://github.com/gabrielSantosLima/harness to run the skill
"<skill-id>" in this repository, without configuring the project.

Task: <what you want the skill to do>

Steps:

1. Clone the harness into a temporary directory outside this repository:

   HARNESS_DIR="$(mktemp -d)/harness"
   git clone --depth 1 https://github.com/gabrielSantosLima/harness.git "$HARNESS_DIR"

   On PowerShell:

   $HARNESS_DIR = Join-Path $env:TEMP "harness-skill"
   git clone --depth 1 https://github.com/gabrielSantosLima/harness.git $HARNESS_DIR

2. Read "$HARNESS_DIR/skills/<skill-id>/SKILL.md" and every file it references
   (scripts and references are relative to that directory).

3. Execute the skill against the current repository. Use the skill's scripts
   from the temporary clone; do not copy them into the repository.

4. Keep the temporary clone until the skill finishes. Do not add `.agent`, do
   not create `.harness.json`, and do not install the skill permanently.

5. Remove the temporary clone when the skill is done.

6. Do not commit, push or tag unless I explicitly ask for it.

Rules:

- Follow the skill exactly, including its boundaries.
- Never modify application files the skill does not own.
- If the skill needs a decision, ask me before acting.
- If the network is blocked, stop and ask me for a local harness path.
```

## Available skills

| Skill | Use when |
| --- | --- |
| `commit-and-push` | Commit and push the current changes |
| `release-summary` | Write a user-facing release summary |
| `release-cut` | Cut and verify a release |
| `github-pages` | Publish a static site or docs to GitHub Pages |
| `readme` | Create, standardize or translate a README |
| `logo` | Design a logo with five versions before SVG |
| `add-skill` | Create a skill or a proposal for one |

`project-setup` is the exception: it configures the project by design, so use
`setup/PROMPT.md` instead.

## Notes

- The clone is read-only input. The only writes happen in the current
  repository, as the skill instructs.
- Keeping the clone until the end lets the agent read references and rerun
  scripts without fetching again.
- For repeated use, use the project setup so the skill is available at
  `.agent/skills/<id>/SKILL.md`.
