---
title: Release failures
description: Recover from a failed release without rewriting history.
---

# Release failures

## Diagnose

```bash
gh run list --workflow release.yml --limit 5
gh run view <run-id> --log-failed
```

## Common causes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Quality job failed | Checks failed | Fix the code and re-run |
| Version resolution failed | No previous tag or bad bump | Check the input |
| Tag already exists | Version collision | Choose a new patch version |
| Release exists | Partial previous run | Delete only the release, keep the tag, or cut a new patch |
| Artifacts missing | Wrong paths or build failed | Fix the build and re-run |

## Rules

- Never delete or move a tag that has been published.
- Never force-push to repair a release.
- If the tag is wrong, cut a new patch release.
- If only the release object is missing, recreate it from the existing tag:

```bash
gh release create <tag> --title "<tag>" --notes-file NOTES.md
```

## After recovery

- Confirm the release notes.
- Confirm the prerelease flag.
- Confirm the assets.
- Record the incident in the next release notes if it affected users.

## Next

- [release-cut](../skills/release-cut.md)
- [Workflows](../reference/workflows.md)
