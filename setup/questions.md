# Question bank

Rules for the interview:

- Detect before asking. If the repository, its manifests or its workflows answer
  a question, show the detected value and ask only for confirmation.
- **Open every interview with question 1.** The purpose comes before the name,
  the type and every technical choice; never ask for a name first.
- Ask at most four questions per round, using a multiple-choice question when
  possible, with the recommended option first.
- Skip questions that do not apply (for example deploy for a `library`).
- Never ask about stacks, frameworks, architecture or dependencies.
- Record every answer in `.harness.json`.

## Round 1 — Purpose and identity

| # | Question | Default / detection |
| --- | --- | --- |
| 1 | What is the project about? Ask for the problem it solves, who it serves and what it does. | Required; recorded as `project.description` |
| 2 | Project name | Directory name |
| 3 | Slug (lowercase, kebab-case) | Derived from the name |
| 4 | GitHub `owner/repo` | Parsed from `git remote` |

## Round 2 — Project and git policy

| # | Question | Default |
| --- | --- | --- |
| 5 | Project type: `web`, `mobile`, `desktop`, `library`, `data` | Detect web `index.html`; otherwise ask |
| 6 | License | `MIT` |
| 7 | Commit autonomy: commit and push when asked / commit only / strict | Commit and push when asked |
| 8 | Existing `AGENTS.md`: merge / replace / abort | Merge missing sections |

## Round 3 — Skills and README

| # | Question | Default |
| --- | --- | --- |
| 9 | Skills to expose | All default skills; `github-pages`, `readme` and `logo` are optional |
| 10 | Skills delivery: git submodule at `.agents/` / copy the selected skills into `.agents/` / none | Submodule |
| 11 | Harness source URL and pinned commit (only for submodule delivery) | `git@github.com:gabrielSantosLima/harness.git` |
| 12 | README: leave untouched / add standard sections / create if missing | Ask |

## Round 4 — Quality and CI/build

| # | Question | Default |
| --- | --- | --- |
| 13 | Check commands (format, lint, typecheck, tests, validation) | Empty, free text |
| 14 | CI depth: `full` (CI + build), `ci` (checks only), `release-only` | Ask |
| 15 | CI operating systems | `ubuntu-latest` |
| 16 | Build command and artifact paths (only when `full`) | Ask |

## Round 5 — Versioning and release

| # | Question | Default |
| --- | --- | --- |
| 17 | Version source: tags only / file plus field | Tags only |
| 18 | Release-notes language | English (suggested) |
| 19 | Release-notes sections | Features, Fixes, Refactor/Chore/Docs, Other, Known issues |
| 20 | Attach build artifacts to the release | Yes when `full` |

## Round 6 — Deploy and hygiene

| # | Question | Default |
| --- | --- | --- |
| 21 | Deploy target (only for `web` and `data`): GitHub Pages / other / none | None |
| 22 | Deploy trigger (only when a target exists): on release / on push / manual | On release |
| 23 | Hygiene files: pull request template and `CODEOWNERS` | Yes, repository owner |
| 24 | Local-only patterns to ignore | `PLAN.md`, notes, `.env`, secrets, build output, caches |

### Skills delivery

`AGENTS.md` is always generated; the choice only affects how the skill library
reaches `.agents/skills/`.

| Option | What the renderer does | Choose when |
| --- | --- | --- |
| `submodule` | Adds a git submodule at `.agents` pinned to a harness commit, with a sparse checkout limited to `skills/` | The target supports submodules and should track one source of truth |
| `copy` | Copies the selected skill directories into `.agents/skills/` and writes `.agents/README.md` | Submodules are unavailable, blocked or unwanted |
| `none` | Installs no skills and omits the Skills section | The project does not want the library |

`copy` is a snapshot: the update flow re-copies it. `none` requires an empty
skills list.

## Detection sources

- `git remote get-url origin` — owner and repository.
- `git tag --sort=-v:refname | head -n1` — current version and tag style.
- `git log --no-merges --pretty=format:%s -n 30` — existing commit style.
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` — existing agent rules and bridges.
- `docs/RELEASE_TEMPLATE.md`, `scripts/release-notes.*` — existing release notes.
- `.github/workflows/*` — existing CI, build and deploy coverage.
- `.agents` — existing harness skills, delivery mode and pinned commit.
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
