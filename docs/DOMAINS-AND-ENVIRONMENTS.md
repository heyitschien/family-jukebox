# Domains, environments & agent handoff

**Read this before changing deploy config, URLs, or branch workflows.** Other agents may be working in parallel — use this doc to avoid clashes.

## Canonical domains (source of truth)

| Role | Domain | Git branch | Deploy workflow |
|------|--------|------------|-----------------|
| **Production** | **https://cousinradio.com** | `main` | `.github/workflows/deploy.yml` |
| **Staging** | **https://staging.cousinradio.com** | `staging` | `.github/workflows/deploy-staging.yml` |
| **Local dev** | `http://localhost:3000` | any | `npm run dev` |
| **Local staging brand** | `http://localhost:3000` | any | `npm run dev:staging` |

Code constants live in **`lib/site-env.ts`** (`PRODUCTION_SITE_URL`, `STAGING_SITE_URL`).  
Do **not** hardcode domains elsewhere — import from `site-env` or use env vars below.

## Names (don’t confuse these)

| Name | Meaning |
|------|---------|
| **cousinradio.com** | Public **domain** — production site |
| **staging.cousinradio.com** | Public **domain** — staging preview |
| **Cousin Radio** | Public brand — production domain, OG metadata, and `/family` artists |
| **Family Jukebox** | In-app product title in sidebar and player UI |
| **family-jukebox** | GitHub repo + Vercel **project** name (hosting only, not the public URL) |

Legacy Vercel URLs (`family-jukebox.vercel.app`, etc.) may still redirect; **cousinradio.com** is what we ship and document.

## Environment variables

Set in GitHub Actions deploy workflows **and** optionally in Vercel dashboard:

| Variable | Production | Staging |
|----------|------------|---------|
| `NEXT_PUBLIC_APP_ENV` | `production` | `staging` |
| `NEXT_PUBLIC_SITE_URL` | `https://cousinradio.com` | `https://staging.cousinradio.com` |

Vercel project secrets (GitHub): `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

## Branch & deploy rules (avoid conflicts)

```txt
feature/*  ──PR──►  main  ──deploy──►  cousinradio.com
                │
feature/*  ──PR──►  staging  ──deploy──►  staging.cousinradio.com
```

1. **`main`** → production only. Do not point staging domain at `main` deploys.
2. **`staging`** → staging only. Do not merge staging into production DNS without merging to `main`.
3. **One deploy workflow per branch** — do not add a second production deploy without team agreement.
4. **CD checks** (`.github/workflows/cd.yml`) hit **cousinradio.com** after production deploy.
5. **Auto-merge** runs only for PRs **into `main`**, not into `staging`.
6. Before changing `lib/site-env.ts`, workflows, or Vercel domains — **update this file in the same PR**.

## Vercel dashboard (one-time / verify)

1. **Domains** on project `family-jukebox`:
   - `cousinradio.com` (+ `www` if used) → **Production**
   - `staging.cousinradio.com` → **Preview** or branch alias for `staging`
2. DNS at your registrar → Vercel (see Vercel domain settings).
3. Optional: keep `family-jukebox.vercel.app` as redirect to `cousinradio.com`.

Staging deploy workflow runs `vercel alias set … staging.cousinradio.com` after each staging push (needs domain attached in Vercel).

## What agents should NOT do

- ❌ Change production URL to a `*.vercel.app` hostname in code or docs  
- ❌ Deploy `staging` branch with `--prod`  
- ❌ Change domain constants in one file without updating `lib/site-env.ts` + this doc + workflows  
- ❌ Add a second staging branch name without documenting it here  
- ❌ Force-push `main` or `staging` without coordination  

## What agents SHOULD do

- ✅ Import domains from `lib/site-env.ts`  
- ✅ Run `npm run ci` before pushing  
- ✅ Log production incidents in `docs/INCIDENTS.md`  
- ✅ Song/catalog work: see `docs/ADDING_SONGS.md`  
- ✅ Copyright / ownership: see `docs/COPYRIGHT-AND-OWNERSHIP.md` — register every new song  
- ✅ Staging workflow details: `docs/STAGING.md`  
- ✅ CI/CD overview: `docs/CI-CD.md`  

## Quick verification

```bash
# Production
curl -sI https://cousinradio.com | head -1

# Staging (after deploy)
curl -sI https://staging.cousinradio.com | head -1
```

Browser: staging shows amber **STAGING** banner and gold accents (`NEXT_PUBLIC_APP_ENV=staging`).
