## Versioning and releases

- Releases are cut through the `Release` GitHub Action
  (`.github/workflows/release.yml`, `workflow_dispatch`). Never create release
  tags by hand.
- Use Semantic Versioning and tag releases as `vX.Y.Z`. Pre-releases use a
  suffix such as `vX.Y.Z-alpha.1`.
{{#if versionIsFile}}
- The version is stored in `{{versionFile}}` (field `{{versionPointer}}`) and is
  updated by the release workflow.
{{else}}
- The version comes from the latest `vX.Y.Z` git tag; no file is bumped.
{{/if}}
- Choose a bump type (`patch`, `minor`, `major`, `prerelease`, `premajor`,
  `preminor`, `prepatch`) or provide an explicit version.
- Release notes are generated from Conventional Commits since the previous tag
  by `scripts/release-notes.mjs` using `docs/RELEASE_TEMPLATE.md`.
{{#if versionIsFile}}
- The release commit uses `chore(release): vX.Y.Z` and only touches the version
  file and its lockfile, when one exists.
{{/if}}
- Pre-release versions contain a hyphen and are published as GitHub
  pre-releases.
- Describe user-visible changes. Do not list commits that are not shipped.
- Never move, delete or reuse an existing release tag. Fix problems with a new
  patch release.
- The first release of a new project is `v0.1.0`.
