# Security posture — Cousin Radio (cousinradio.com)

Living record of what we protect, what we accept, and how we verify it. Update this doc whenever security controls change.

**Last reviewed:** 2026-06-25  
**Production deploy:** PR [#39](https://github.com/heyitschien/family-jukebox/pull/39) → `main` → Vercel  
**Related:** `docs/SECURITY-AND-ANALYTICS.md` (setup + API), `docs/INCIDENTS.md` (outages)

---

## Posture summary

| Area | Status | Notes |
|------|--------|-------|
| User accounts / PII | ✅ Not collected | No login, no emails, no stored IPs |
| Server secrets | ✅ Server-only | `DATABASE_URL` never exposed to browser |
| SQL injection | ✅ Low risk | Drizzle ORM, parameterized queries |
| XSS | ✅ Low risk | React escaping, CSP, no raw HTML injection |
| CSRF / cross-site API abuse | ✅ Mitigated | Same-site Origin/Referer guard on mutating `/api/*` |
| Analytics spam | 👀 Mitigated | Session + IP rate limits, HTTP 429 |
| App crash / takeover | ✅ Low risk | No admin API, no uploads, static catalog |
| Staging leakage | ✅ Mitigated | `robots.txt` disallow + `noindex` metadata |
| Music file copying | ⚠️ Accepted | Public MP3 URLs — see [Music assets](#music-assets-not-like-spotify) |
| Database credential leak | 👀 Monitor | Single Neon role, no RLS — rotate if leaked |

**Overall:** Appropriate for a **public family jukebox**. We protect the **app, database, and analytics integrity**. We do **not** DRM-lock audio files.

---

## Music assets (not like Spotify)

**This is not Spotify.** Cousin Radio works differently:

| | Spotify | Cousin Radio |
|---|---------|--------------|
| How you listen | Stream inside their app | Stream in browser from our site |
| Can you save the file? | No (DRM, encrypted streams) | **Yes** — if someone finds the direct URL |
| Where files live | Spotify's servers, locked down | Our `public/assets/` folder on Vercel |
| Typical URL | Hidden behind their player | e.g. `https://cousinradio.com/assets/eliana/pink-glasses-everywhere.mp3` |

**What “public MP3” means in practice:**

- Right-click → Save, or open DevTools → Network → save the `.mp3` request
- Share the direct link with anyone — no login required
- Bulk download with tools like `wget` or `curl` (same as any public website file)

**That is normal** for a small family site sharing songs with cousins. It is **not** a security bug — it is how static web hosting works.

**What we still protect:**

- Nobody can **change or delete** songs through the website (no upload/admin API)
- **Copyright registry** + SHA-256 fingerprints track what we ship (`docs/COPYRIGHT-AND-OWNERSHIP.md`)
- **Rate limits** reduce automated scraping of APIs and artwork generation
- **Legal ownership** stays with the family; technical DRM would block easy sharing, which is the product goal

**If you ever need stronger copy protection** (unlikely for family sharing): signed/expiring URLs, Cloudflare in front of `/assets/*`, or a paid streaming platform — all trade away simplicity.

---

## Controls in production (2026-06-25)

### Edge & headers

| Control | Where |
|---------|--------|
| Content-Security-Policy | `lib/security/headers.ts`, middleware, `next.config.ts` |
| X-Frame-Options: SAMEORIGIN | middleware |
| X-Content-Type-Options: nosniff | middleware + `/assets/*` |
| Referrer-Policy, Permissions-Policy | middleware |
| Cross-Origin-Opener-Policy: same-origin | headers module |
| Long-cache on `/assets/*` | `next.config.ts` |

### API protection

| Route | Method | Controls |
|-------|--------|----------|
| `/api/plays` | POST | Same-site guard, slug allow-list, session cookie, 40 events/session/min, 100 requests/IP/min, 429 on limit |
| `/api/stats` | GET | 30 requests/IP/min, 30s cache headers |
| `/api/now-playing-artwork` | GET | 60 requests/IP/min, slug from catalog only |
| `/api/brand-artwork` | GET | Static generation, no user input |

### Session cookie (`fj_session`)

| Attribute | Value |
|-----------|--------|
| Purpose | Anonymous play analytics only |
| HttpOnly | yes |
| Secure | yes (production) |
| SameSite | Lax |
| Max-Age | 1 year |

### Data stored (Neon)

| Table | Contents | PII? |
|-------|----------|------|
| `play_events` | song slug, event type, session id, optional duration | No |
| `rate_limit_hits` | bucket key (route + IP hash path), timestamp | IP not stored in play_events; bucket keys include IP for throttling only |

---

## Threat model (simplified)

| Threat | Can it happen? | Impact | Our response |
|--------|----------------|--------|--------------|
| Steal user passwords | No | — | No accounts |
| Steal family emails | No | — | Not collected |
| Inject fake play counts | Yes (limited) | Skewed stats | Rate limits + origin guard |
| Scrape all play stats | Yes | Public metrics | IP rate limit on `/api/stats` |
| Download all MP3s | Yes | Copies of songs | Accepted; copyright registry |
| Delete or replace songs via web | No | — | No write API for content |
| SQL injection | Very unlikely | DB breach | Drizzle ORM |
| XSS | Very unlikely | Session abuse | React + CSP |
| DDoS / cost spike | Possible | Vercel/Neon bill | Vercel edge; rate limits; WAF optional |
| `DATABASE_URL` leak | Possible if mishandled | Full DB access | Secrets in Vercel only; rotate if exposed |

---

## Verification checklist

Run after any security-related deploy:

```bash
# Local full gate
npm run ci

# Production headers (expect CSP, X-Frame-Options, etc.)
curl -sI https://cousinradio.com/ | grep -iE 'content-security|x-frame|x-content'

# Blocked cross-site POST (expect 403)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://cousinradio.com/api/plays \
  -H "Content-Type: application/json" \
  -d '{"songSlug":"pink-glasses-everywhere","event":"start"}'

# Stats still reachable from browser context (open site → Family mix card loads)
curl -s https://cousinradio.com/api/stats | head -c 120

# Production robots allows indexing
curl -s https://cousinradio.com/robots.txt

# Staging robots blocks indexing (when staging is deployed)
curl -s https://staging.cousinradio.com/robots.txt
```

---

## Changelog

| Date | Change | Reference |
|------|--------|-----------|
| 2026-06-25 | Production hardening: CSP, strict API origin guard, IP rate limits (`rate_limit_hits`), HTTP 429, staging noindex, early slug validation | PR #39 |
| 2026-06-22 | Production crash fix; production browser smoke in CI | `docs/INCIDENTS.md`, commit `346f1ea` |
| 2026-06 (earlier) | Neon play tracking, session cookie, basic origin check, 40/session/min limit | commit `70378de`, `docs/SECURITY-AND-ANALYTICS.md` |

---

## Open items (backlog)

| Priority | Item | Why |
|----------|------|-----|
| When traffic grows | Vercel WAF / bot protection on `/api/*` | Edge blocking before serverless |
| Optional | Upstash Redis rate limits | Faster cross-region throttling than Neon buckets |
| Optional | Shared family PIN for `/api/stats` | Hide play counts from casual scrapers |
| Optional | Neon RLS / least-privilege DB role | Limit blast radius if `DATABASE_URL` leaks |
| Not planned | DRM on MP3s | Conflicts with easy family sharing |

---

## Key files

| Path | Role |
|------|------|
| `docs/SECURITY-POSTURE.md` | This document — posture + changelog |
| `docs/SECURITY-AND-ANALYTICS.md` | Neon setup, env vars, API reference |
| `lib/security/` | Headers, origin guard, rate limits, client IP |
| `middleware.ts` | Session cookie + headers + API origin guard |
| `drizzle/0001_rate_limit_hits.sql` | IP rate limit table migration |
