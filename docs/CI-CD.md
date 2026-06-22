# CI/CD automation

Family Jukebox uses GitHub Actions for CI and relies on Vercel for production deploys.

## Flow

```txt
Open PR → CI runs (lint, smoke, build)
       → if green → auto-merge to main
       → Deploy workflow pushes to Vercel production
       → CD workflow verifies production is live
```

## Workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| **CI** | PR + push to `main` | `npm run lint`, `npm run smoke`, `npm run build` |
| **CI → auto-merge** | PR only, after CI passes | Merges the PR and deletes the branch |
| **Deploy** | Push to `main` | Builds and deploys to Vercel production |
| **CD** | After Deploy succeeds | Smoke-checks production URLs (no `__next_error__`) |

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

GitHub Actions deploys `main` to Vercel. Add these repository secrets once:

| Secret | Value |
|--------|--------|
| `VERCEL_TOKEN` | Vercel account token |
| `VERCEL_ORG_ID` | Team / user id from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Project id from `.vercel/project.json` |

Optional: keep Vercel Git integration connected as a backup trigger.
