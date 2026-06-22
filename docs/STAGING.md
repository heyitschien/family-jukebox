# Staging environment

Use **staging** to preview songs, catalog changes, and UI before they go live on **cousinradio.com**.

**Canonical domain reference:** [`docs/DOMAINS-AND-ENVIRONMENTS.md`](./DOMAINS-AND-ENVIRONMENTS.md) — read this first if you are an agent changing deploys or URLs.

## URLs

| Environment | Branch | Domain |
|-------------|--------|--------|
| **Production** | `main` | https://cousinradio.com |
| **Staging** | `staging` | https://staging.cousinradio.com |

Staging shows an amber **STAGING** banner, gold accent colors, and `Family Jukebox · Staging` in the browser title.

The Vercel project is still named `family-jukebox` — that is hosting only. The **public** URLs are cousinradio.com domains above.

## Workflow

```txt
feature branch → PR → staging (optional integration)
                  ↓
            push to staging → Deploy Staging workflow
                  ↓
            verify on staging.cousinradio.com
                  ↓
            merge staging → main → cousinradio.com
```

For small changes you can still go **feature → main** directly. Use staging when you want a shared preview link before production.

## Deploy staging

```bash
git checkout staging
git merge main   # or merge your feature branch
git push origin staging
```

GitHub Actions **Deploy Staging** runs on every push to `staging`.

## Local staging brand

```bash
npm run dev:staging
```

## Vercel setup (verify once)

1. **Domains** on project `family-jukebox`:
   - `cousinradio.com` → Production
   - `staging.cousinradio.com` → Preview / staging branch
2. DNS at your registrar pointed to Vercel.
3. GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

## CI

Pushes to `staging` run the same **Build, lint & smoke** checks as `main`. Auto-merge only applies to PRs into `main`.
