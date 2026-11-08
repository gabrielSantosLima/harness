# Question bank

Rules for the interview:

- Detect before asking. If the repository, its manifests or its workflows answer
  a question, show the detected value and ask only for confirmation.
- Ask at most four questions per round, using a multiple-choice question when
  possible, with the recommended option first.
- Skip questions that do not apply (for example deploy for a `library`).
- Never ask about stacks, frameworks, architecture or dependencies.
- Record every answer in `.harness.json`.

## Round 1 — Identity

| # | Question | Default / detection |
| --- | --- | --- |
| 1 | Project name | Directory name |
| 2 | Slug (lowercase, kebab-case) | Derived from the name |
| 3 | One-line description | Required |
| 4 | GitHub `owner/repo` | Parsed from `git remote` |
| 5 | License | `MIT` |
| 6 | Project type: `web`, `mobile`, `desktop`, `library`, `data` | Detect web `index.html`; otherwise ask |

## Round 2 — Git and agent policy

| # | Question | Default |
| --- | --- | --- |
| 7 | Commit autonomy: commit and push when asked / commit only / strict | Commit and push when asked |
| 8 | Existing `AGENTS.md`: merge / replace / abort | Merge missing sections |
| 9 | Harness source for `.agent` and pinned commit | `git@github.com:gabrielSantosLima/harness.git` |
| 10 | Skills to expose | All four default skills |
| 11 | README: leave untouched / add standard sections / create if missing | Ask |
| 12 | Default branch | `main` |
| 13 | First tag | `v0.1.0` |

## Round 3 — Quality and CI/build

| # | Question | Default |
| --- | --- | --- |
| 14 | Check commands (format, lint, typecheck, tests, validation) | Empty, free text |
| 15 | CI depth: `full` (CI + build), `ci` (checks only), `release-only` | Ask |
| 16 | CI operating systems | `ubuntu-latest` |
| 17 | Build command | Ask when `full` |
| 18 | Build artifact paths | Ask when `full` |
| 19 | Attach build artifacts to the release | Yes when `full` |

## Round 4 — Versioning, release and deploy

| # | Question | Default |
| --- | --- | --- |
| 20 | Version source: tags only / file plus field | Tags only |
| 21 | Release-notes language | English (suggested) |
| 22 | Release-notes sections | Features, Fixes, Refactor/Chore/Docs, Other, Known issues |
| 23 | Deploy target (only for `web` and `data`): GitHub Pages / other / none | None |
| 24 | Deploy trigger (only when a target exists): on release / on push / manual | On release |

## Round 5 — Hygiene

| # | Question | Default |
| --- | --- | --- |
| 25 | Generate pull request template | Yes |
| 26 | Generate `CODEOWNERS` and its owner | Yes, repository owner |
| 27 | Local-only patterns to ignore | `PLAN.md`, notes, `.env`, secrets, build output, caches |

## Detection sources

- `git remote get-url origin` — owner and repository.
- `git tag --sort=-v:refname | head -n1` — current version and tag style.
- `git log --no-merges --pretty=format:%s -n 30` — existing commit style.
- `AGENTS.md` — existing agent rules.
- `docs/RELEASE_TEMPLATE.md`, `scripts/release-notes.*` — existing release notes.
- `.github/workflows/*` — existing CI, build and deploy coverage.
- `.agent` — existing harness submodule and pinned commit.
- `.harness.json` — previous answers; in `update` mode they replace the
  interview except for questions the user explicitly wants to change.
- `index.html` — strong signal for `web`.
- Presence of a version field in any manifest is informational only; it is never
  treated as a stack decision.

## Interview output

Before writing, print:

1. the detection summary;
2. the resulting `.harness.json`;
3. the file tree to create, modify or leave untouched;
4. diffs for modified files;
5. the exact check, build and release commands that will be recorded.
