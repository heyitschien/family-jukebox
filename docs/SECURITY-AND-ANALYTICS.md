# Security & analytics

Lightweight protections and play tracking for the public Family Jukebox link. Designed for daily development: nothing blocks local work when Neon is not configured yet.

## What is protected today

| Layer | What it does |
|-------|----------------|
| **Security headers** | `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection, CSP, CORP/COOP via middleware + Next config |
| **Anonymous sessions** | HttpOnly `fj_session` cookie — used for listener counts, not login |
| **API origin guard** | Mutating `/api/*` requires matching `Origin` or `Referer` (blocks curl/bots without same-site headers) |
| **Input validation** | Song slugs must exist in `data/songs.ts` at parse time; event types and sources are allow-listed |
| **Rate limiting** | 40 play events per session per minute; IP limits on `/api/plays`, `/api/stats`, and artwork generation |
| **HTTP 429** | Rate-limited clients receive `Retry-After` instead of silent drops |
| **Staging privacy** | `robots.txt` disallows all crawlers; pages emit `noindex` metadata |
| **Asset headers** | `/assets/*` gets long-cache + `nosniff` (keeps OG/social previews working) |
| **Privacy** | No names, emails, or IPs stored in play events — only song slug, event type, anonymous session id, optional duration |

## What we track (KPIs)

| Metric | Meaning |
|--------|---------|
| **Plays** | `start` events when a song actually begins playing |
| **Completes** | `complete` events when a track finishes |
| **Listeners** | Distinct anonymous `fj_session` cookies |
| **Top songs** | Ranked by play count — shown on the landing Family mix card |

Play counts also appear on individual song pages once data exists.

## Neon + Drizzle setup

**Production project (configured):**

| Item | Value |
|------|--------|
| Neon project | `family-jukebox` |
| Project ID | `cold-snow-21143676` |
| Branch | `main` |
| Tables | `play_events`, `rate_limit_hits` (see `drizzle/`) |

### First-time / new machine

```bash
cp .env.example .env.local
# Paste DATABASE_URL from Neon console or run: ./scripts/setup-neon.sh
npm run db:push    # applies play_events + rate_limit_hits
./scripts/setup-neon.sh   # sync .env.local → Vercel
```

### Vercel environment variables

Set on **Production**, **Preview**, and **Development**:

```bash
DATABASE_URL=postgresql://...   # Neon pooled connection string
PLAY_TRACKING_ENABLED=true
```

Automated sync from local:

```bash
./scripts/setup-neon.sh
```

Or apply manually in Vercel → Project → Settings → Environment Variables.

## Local development without Neon

The app builds and runs normally without `DATABASE_URL`.

- Play tracking API returns `{ tracked: false }` and does nothing harmful
- IP rate limits are skipped when the database is unavailable
- Song pages simply hide play counts until data exists
- CI does not require a database

## Daily workflow

```bash
npm run dev          # develop as usual
npm run ci           # lint + smoke + build before push
npm run db:studio    # inspect play_events when Neon is connected
```

## API reference

### `POST /api/plays`

Records a play event. Called automatically by the global player.

```json
{
  "songSlug": "pink-glasses-everywhere",
  "event": "start",
  "source": "hero",
  "durationMs": 180000
}
```

Returns `429` when session or IP limits are exceeded.

### `GET /api/stats`

Returns site-wide stats, or pass `?slug=` for a single song. Rate-limited per IP (30/min).

## When traffic grows

Consider adding:

- Vercel WAF / bot protection on `/api/*`
- Upstash Redis for cross-region rate limiting (Neon buckets work today)
- Optional shared family PIN for admin stats only

## Files

| Path | Role |
|------|------|
| `db/schema.ts` | Drizzle `play_events` + `rate_limit_hits` tables |
| `lib/security/` | Origin guard, headers, CSP, IP rate limits |
| `lib/analytics/plays.ts` | Record + query helpers |
| `lib/analytics/track-play.ts` | Client beacon from the player |
| `app/api/plays/route.ts` | Write API |
| `app/api/stats/route.ts` | Read API |
| `middleware.ts` | Session cookie + headers + origin guard |
| `contexts/player-context.tsx` | Playback hooks |
