---
title: After setup
description: Review, commit and cut the first release.
---

# After setup

The setup run stops before any git write. What happens next is yours.

## 1. Review the changes

```bash
git status --short
git diff
```

Check that only generated files changed. Application code must be untouched.

## 2. Confirm the policy

Open `AGENTS.md` and `.harness.json` and confirm:

- the check commands are the real ones;
- the commit autonomy matches your intent;
- the version source is correct;
- the deploy target is correct;
- the selected skills are the ones you want.

## 3. Commit

Follow the project's own policy. Usually:

```bash
git add AGENTS.md .harness.json docs scripts .github .gitignore .gitmodules .agent
git commit -m "chore: configure project from harness"
```

Never use `git add -A` if the working tree has unrelated changes.

## 4. Manual GitHub steps

- Enable Actions.
- Set Pages source to **GitHub Actions** if you deploy.
- Add required secrets.
- Configure branch protection to require CI.

## 5. First release

```bash
gh workflow run release.yml -f bump=minor -f summary="Initial release"
```

The first release is `v0.1.0`. The workflow runs CI, generates notes from the
commits since the previous tag, creates the tag and publishes the release.

## Next

- [Updates](updates.md)
- [Release failures](../operations/release-failures.md)
