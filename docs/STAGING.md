# Staging environment

Use **staging** to preview songs, catalog changes, and UI before they hit production.

## URLs

| Environment | Branch | URL |
|-------------|--------|-----|
| **Production** | `main` | https://family-jukebox.vercel.app |
| **Staging** | `staging` | https://family-jukebox-staging.vercel.app |

Staging shows an amber **STAGING** banner, gold accent colors, and `Family Jukebox · Staging` in the browser title.

## Workflow

```txt
feature branch → PR → staging (optional integration)
                  ↓
            push to staging → Deploy Staging workflow
                  ↓
            verify on family-jukebox-staging.vercel.app
                  ↓
            merge staging → main → production deploy
```

For small changes you can still go **feature → main** directly. Use staging when you want a shared preview link before production.

## Deploy staging

```bash
git checkout staging
git merge main   # or merge your feature branch
git push origin staging
```

GitHub Actions **Deploy Staging** runs on every push to `staging` (same Vercel secrets as production).

## Local staging brand

Run with staging env vars to see the banner and gold theme locally:

```bash
NEXT_PUBLIC_APP_ENV=staging NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run dev
```

## Vercel setup (one time)

1. In Vercel → **family-jukebox** → **Settings → Domains**, add `family-jukebox-staging.vercel.app` if it is not already listed.
2. Ensure **Preview** deployments are enabled for the `staging` branch.
3. Optional: add `NEXT_PUBLIC_APP_ENV=staging` under **Settings → Environment Variables** for the **Preview** environment only.

## CI

Pushes to `staging` run the same **Build, lint & smoke** checks as `main`.
