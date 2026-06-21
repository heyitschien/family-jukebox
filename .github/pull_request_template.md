## What changed

<!-- Brief summary of the jukebox change -->

## Automation

- CI runs **lint + smoke + build** on every PR
- When CI is green, the PR **auto-merges** to `main` (add label `no-automerge` to skip)
- Vercel **deploys `main` automatically**; CD verifies production after merge

## Notes

<!-- Anything to watch for in player, albums, or featured rotation logic -->
