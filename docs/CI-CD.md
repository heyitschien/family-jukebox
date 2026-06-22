# CI/CD automation

Family Jukebox uses GitHub Actions for CI and relies on Vercel for production deploys.

## Flow

```txt
Open PR → CI runs (lint, smoke, build)
       → if green → auto-merge to main
       → Vercel deploys main automatically
       → CD workflow verifies production is live
```

## Workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| **CI** | PR + push to `main` | `npm run lint`, `npm run smoke`, `npm run build` |
| **CI → auto-merge** | PR only, after CI passes | Checks out the repo, merges the PR, and deletes the branch |
| **CD** | Push to `main` or manual dispatch | Polls production for up to ~10 minutes, then smoke-checks URLs |

## Opt out of auto-merge

Add the **`no-automerge`** label to a PR if you want to review or merge manually.

## Local check (same as CI)

```bash
npm run ci
```

## Branch protection

`main` should require the **Build, lint & smoke** status check before merge. Auto-merge satisfies this because it runs only after that job passes.

## Deploy target

Production: [https://family-jukebox.vercel.app](https://family-jukebox.vercel.app)

Vercel watches the GitHub `main` branch — no manual `vercel deploy` needed after merge.

If **CD** fails but CI passed, Vercel may still be deploying. Re-run the **CD** workflow from the Actions tab (`workflow_dispatch`), or confirm the Vercel project is connected to `main` and the latest deployment succeeded.
