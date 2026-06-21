# Security & analytics

Lightweight protections and play tracking for the public Family Jukebox link. Designed for daily development: nothing blocks local work when Neon is not configured yet.

## What is protected today

| Layer | What it does |
|-------|----------------|
| **Security headers** | `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection via middleware + Next config |
| **Anonymous sessions** | HttpOnly `fj_session` cookie — used for listener counts, not login |
| **API origin check** | `POST /api/plays` rejects cross-site writes from other origins |
| **Input validation** | Song slugs must exist in `data/songs.ts`; event types and sources are allow-listed |
| **Rate limiting** | Max 40 play events per session per minute (stored in Neon) |
| **Privacy** | No names, emails, or IPs stored — only song slug, event type, anonymous session id, optional duration |

## What we track (KPIs)

| Metric | Meaning |
|--------|---------|
| **Plays** | `start` events when a song actually begins playing |
| **Completes** | `complete` events when a track finishes |
| **Listeners** | Distinct anonymous `fj_session` cookies |
| **Top songs** | Ranked by play count — shown on the landing Family mix card |

Play counts also appear on individual song pages once data exists.

## Neon + Drizzle setup

1. Create a Neon project at [console.neon.tech](https://console.neon.tech)
2. Copy the connection string
3. Add to Vercel → Project → Settings → Environment Variables:

```bash
DATABASE_URL=postgresql://...
PLAY_TRACKING_ENABLED=true
```

4. Apply the schema (first time only):

```bash
cp .env.example .env.local
# paste DATABASE_URL into .env.local
npm run db:push
```

Or run the SQL in `drizzle/0000_init.sql` from the Neon SQL editor.

## Local development without Neon

The app builds and runs normally without `DATABASE_URL`.

- Play tracking API returns `{ tracked: false }` and does nothing harmful
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

### `GET /api/stats`

Returns site-wide stats, or pass `?slug=` for a single song.

## Intentionally light touch

We are **not** adding auth, CAPTCHA, or heavy WAF rules yet — that would slow down family sharing and daily pushes. When traffic grows, consider:

- Vercel WAF / bot protection on `/api/*`
- Upstash Redis rate limiting (cross-instance)
- Optional shared family PIN for admin stats only

## Files

| Path | Role |
|------|------|
| `db/schema.ts` | Drizzle `play_events` table |
| `lib/analytics/plays.ts` | Record + query helpers |
| `lib/analytics/track-play.ts` | Client beacon from the player |
| `app/api/plays/route.ts` | Write API |
| `app/api/stats/route.ts` | Read API |
| `middleware.ts` | Session cookie + headers + origin guard |
| `contexts/player-context.tsx` | Playback hooks |
