---
title: release-cut
description: Trigger the release workflow, watch it and verify the result.
---

# release-cut

## When to use

The user asks to cut, publish or ship a release.

## Steps

1. Read `AGENTS.md` and `.harness.json`.
2. Confirm the branch is clean; stop if it is not.
3. Ask for the bump type, preid or explicit version, and a summary.
4. Dispatch:

```bash
gh workflow run release.yml \
  -f bump=<bump> \
  -f preid=<preid> \
  -f version="<explicit-or-empty>" \
  -f summary="<summary>"
```

5. Watch the run:

```bash
gh run list --workflow release.yml --limit 1
gh run watch <run-id> --exit-status
```

6. Verify tag, notes, prerelease flag and assets:

```bash
git fetch --tags
gh release view <tag> --json tagName,isPrerelease,assets
```

## On failure

- Read `gh run view <run-id> --log-failed`.
- Report and stop.
- Never move or reuse a tag. Cut a new patch release with the fix.
- Never force-push to repair a release.

## Source

[`skills/release-cut/SKILL.md`](https://github.com/gabrielSantosLima/harness/blob/main/skills/release-cut/SKILL.md)

## Next

- [Release failures](../operations/release-failures.md)
