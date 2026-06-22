# CI/CD automation

Family Jukebox uses GitHub Actions for CI and relies on Vercel for production deploys.

## Flow

```txt
Open PR → CI runs (lint, smoke, build)
       → if green → auto-merge to main (PRs targeting main only)
       → Deploy workflow pushes to Vercel production
       → CD workflow verifies production is live

Push to staging → Deploy Staging → family-jukebox-staging.vercel.app
```

See [`docs/STAGING.md`](./STAGING.md) for the staging branch workflow.

## Workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| **CI** | PR + push to `main` or `staging` | `npm run lint`, `npm run smoke`, `npm run build`, production browser smoke |
| **CI → auto-merge** | PR to `main` only, after CI passes | Merges the PR and deletes the branch |
| **Deploy** | Push to `main` | Builds and deploys to Vercel production |
| **Deploy Staging** | Push to `staging` | Builds and deploys to Vercel staging preview |
| **CD** | After Deploy succeeds | Smoke-checks production URLs (no `__next_error__`) |

## Opt out of auto-merge

Add the **`no-automerge`** label to a PR if you want to review or merge manually.

## Local check (same as CI)

```bash
npm run ci
```

`npm run ci` ends with **production browser smoke** — it starts the built app and opens `/`, `/songs`, `/favorites`, and `/family` in headless Chrome. This catches client-side React crashes that plain HTTP checks miss. See `docs/INCIDENTS.md` for why this exists.

## When production breaks

1. Log the incident in [`docs/INCIDENTS.md`](./INCIDENTS.md) (symptoms, root cause, fix, prevention).
2. Add a test or CI step so the same failure cannot merge again.
3. Run `npm run ci` before pushing.

## Branch protection

`main` should require the **Build, lint & smoke** status check before merge. Auto-merge satisfies this because it runs only after that job passes.

## Deploy targets

| Environment | URL |
|-------------|-----|
| **Production** | [https://family-jukebox.vercel.app](https://family-jukebox.vercel.app) |
| **Staging** | [https://family-jukebox-staging.vercel.app](https://family-jukebox-staging.vercel.app) |

GitHub Actions deploys `main` to Vercel production and `staging` to the staging preview. Add these repository secrets once:

| Secret | Value |
|--------|--------|
| `VERCEL_TOKEN` | Vercel account token |
| `VERCEL_ORG_ID` | Team / user id from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Project id from `.vercel/project.json` |

Optional: keep Vercel Git integration connected as a backup trigger.
