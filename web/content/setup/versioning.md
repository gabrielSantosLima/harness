---
title: Versioning
description: Tags-only versus a version file, and bump semantics.
---

# Versioning

## Tags only (default)

The version is the latest `vX.Y.Z` tag. Nothing is bumped in the repository.

- Works for every project type.
- The release workflow resolves the next version with
  `scripts/next-version.mjs`.
- The release commit is not needed.

## A version file

Use this when the ecosystem requires the version in a file, for example a
manifest or a `VERSION` file.

```json
"version": { "source": "file", "file": "package.json", "pointer": "version" }
```

- The renderer generates `scripts/bump-version.mjs`.
- The workflow updates the file and commits `chore(release): vX.Y.Z`.
- Only the declared file is staged.
- JSON files use a dotted pointer; other files use a `key=value` or `key: value`
  line.

## Bump types

| Type | Example from `1.2.3` |
| --- | --- |
| `patch` | `1.2.4` |
| `minor` | `1.3.0` |
| `major` | `2.0.0` |
| `prerelease` | `1.2.4-alpha.0`, then `1.2.4-alpha.1` |
| `premajor` | `2.0.0-alpha.0` |
| `preminor` | `1.3.0-alpha.0` |
| `prepatch` | `1.2.4-alpha.0` |

An explicit `version` overrides the bump type.

## First release

`v0.1.0`.

## Next

- [Release notes](release-notes.md)
- [release-cut skill](../skills/release-cut.md)
