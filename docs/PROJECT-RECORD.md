# Family Jukebox — Project Record

**Last validated:** 2026-06-23 (against `main` @ `e21ce0c`)  
**Live:** [cousinradio.com](https://cousinradio.com) · **Staging:** [staging.cousinradio.com](https://staging.cousinradio.com)  
**Domains doc:** [docs/DOMAINS-AND-ENVIRONMENTS.md](./DOMAINS-AND-ENVIRONMENTS.md)  
**Repo:** `heyitschien/family-jukebox`

This document is the **source-of-truth snapshot** for architecture, features, design principles, and work history — cross-checked against the codebase, not aspirational specs alone.

---

## 1. What this app is

A **family music jukebox**: Spotify-inspired UX, warm cousin/family branding, static catalog in git, global audio player, album collections, optional Neon play analytics.

**Core habit we optimize for:** open link → see music → tap → hear it. Playback persists while browsing.

---

## 2. Work log (recent shipped history)

| Commit / PR | What shipped |
|-------------|--------------|
| `e21ce0c` | **The Future in My Palm** — Tio Chien single + Sand to Signal cover art |
| `b15a541` | Song ship pipeline hardening — auto series subtitles, data-driven smoke tests |
| `726d65d` | Song ship CLI (`npm run song:ship`) + pipeline spec |
| **#18** | CD production smoke check → Cousin Radio branding (fixes false CD failures) |
| **#17** | Tia Evelyn / Tio Sam & Josh display names |
| **#14** | Seamless ambient gradient + floating glass panels (`jb-float-panel`) |
| `07eb12f`–`2bfa660` | Printing Intelligence on Sand — Morning Sun Neon Light, The City Breathing |
| **#13** | Cousin Radio branding unification (shell, share surfaces, icons) |
| **#11** | Age-based content curation + remembered listener preference |
| **#12** | PWA install-sized Cousin Radio app icons |
| **#9** | Music intelligence — Cousin Radio radio, smart shuffle, session-aware queues |
| **#8** | 3D album carousel — per-album song rotation, unlimited family scaling |
| **#7** | Link previews for iMessage/social (cousinradio.com OG metadata) |
| **#5–#6** | Celebration song 404 fixes, mobile tracklist overflow |
| `6c95669` | Album phases 2–4: browse sections (series vs collection), member page grouping, unified hero badges, supplementary series shelf on home, album detail “more from artist”, smoke tests |
| `ab52efb` | Album catalog dedup, 3D carousel spacing (6 primary albums, side scale-down) |
| `b622e14` | Evelyn — **Silver Pan Morning** |
| `2a906c7` | Evelyn — **Orange Sweater Sun** (K-pop) |
| `2dba1c1` | Evelyn — **Gold in the Tile**, featured album |
| `2a290c4` | Neon analytics + Vercel env sync script |
| `0164f2f` | Miracle in the Sand lyrics + add-song pipeline docs |
| `85b8bba` | Tio Chien — **Miracle in the Sand** series album |
| `4419c4c` | CI/CD auto-merge + production smoke |
| `df367ab` | Album feature merge — 3D carousel, `/albums` |
| `70378de` | Neon play tracking + security guards |
| `1d2b07d` | Album collections + 3D landing carousel |
| `01ea204` | Live hero player landing |
| `b8d452c` | Auto-transcribed lyrics on song pages (Whisper) |
| `9b28ea5` | Tio Chien — **Crayon Planets** |

---

## 3. Current catalog (code-validated)

Run `npx tsx -e "..."` or inspect `data/songs.ts` / `data/albums.ts` to refresh these numbers after adds.

| Metric | Count | Source |
|--------|-------|--------|
| **Songs** | 12 | `data/songs.ts` |
| **Members** | 6 | `data/members.ts` |
| **Albums (browse)** | 7 | `data/albums.ts` → `getAllAlbums()` |
| **Hero carousel slots** | 6 | `getPrimaryAlbums()` — one per artist |

### Members

| Slug | Name | Role |
|------|------|------|
| `marceline` | Marceline | girl, age 3 |
| `eliana` | Eliana | girl, age 6 |
| `solene` | Solene | girl, age 8 |
| `ocean` | Ocean | boy, age 10 |
| `tio-chien` | Tio Chien | tio, age 35 |
| `evelyn` | Evelyn | family |

### Songs by artist

| Artist | Tracks |
|--------|--------|
| Marceline | Dash and Go |
| Eliana | Pink Glasses Everywhere |
| Solene | Foxes of the Garden, Solene's Painted Trail |
| Ocean | Gravity Shift, Mountains to the Shore |
| Tio Chien | Pixels into Magic, Crayon Planets, Miracle in the Sand |
| Evelyn | Gold in the Tile, Orange Sweater Sun, Silver Pan Morning |

### Album layout (browse vs carousel)

**Browse (`/albums`) — 7 albums in 2 sections:**

| Section | Albums |
|---------|--------|
| **Growing series** | `gold-in-the-tile-album`, `miracle-in-the-sand-album` |
| **Full collections** | `marceline-album`, `eliana-album`, `solene-album`, `ocean-album`, `tio-chien-album` |

**Hero 3D carousel — 6 primary albums (no duplicates):**

`marceline-album`, `eliana-album`, `solene-album`, `ocean-album`, `tio-chien-album`, `gold-in-the-tile-album`

**Off-carousel series surfaced on home:** `miracle-in-the-sand-album` (Tio’s studio collection is carousel primary; series gets its own “Growing series” shelf).

---

## 4. Architecture overview

```txt
┌─────────────────────────────────────────────────────────────┐
│  app/layout.tsx → AppShell (PlayerProvider)                 │
│    ├── Sidebar (desktop lg+)                                │
│    ├── BottomNav (mobile)                                   │
│    ├── MiniPlayer (global, sticky)                          │
│    └── {page routes}                                        │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐    ┌──────────────────┐    ┌─────────────┐
│  data/           │    │  lib/            │    │  db/        │
│  songs.ts        │    │  featured-       │    │  Neon       │
│  albums.ts       │    │  rotation.ts     │    │  play_events│
│  members.ts      │    │  album-rotation  │    │  (optional) │
│  lyrics.ts       │    │  analytics/      │    └─────────────┘
└──────────────────┘    │  security/       │
                        └──────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  contexts/player-context.tsx — single HTMLAudioElement       │
│  hooks/use-song-playback.ts — tap-safe play/toggle           │
└──────────────────────────────────────────────────────────────┘
```

### Tech stack

- **Next.js 16** (App Router, SSG for songs/albums/members)
- **TypeScript**, **Tailwind CSS 4**, **shadcn/ui** primitives
- **Static assets:** `public/assets/{author}/{slug}.mp3|.jpg`
- **Source videos:** stay outside repo in `family-music-asset-june-19/`
- **Analytics:** Neon Postgres + Drizzle (`DATABASE_URL` optional locally)
- **Deploy:** Vercel (auto on `main` push)

---

## 5. Routes & page logic

| Route | Type | Purpose | Key data / logic |
|-------|------|---------|------------------|
| `/` | dynamic (`force-dynamic`) | **Home** — 3D album hero, album shelf, song shelf, family queue | `getHeroFeaturedAlbum`, `getRotatedAlbumCarousel`, `getRotatedFeaturedShelf`, `getFairRotationQueue`, `getSupplementarySeriesAlbums` |
| `/songs` | static | All songs shelf | `getRotatedFeaturedShelf` |
| `/songs/[slug]` | SSG | Track detail — cover, lyrics, story, album link, play count | `getAlbumForSong`, `isSpotlightSong`, `SongPlayCount` |
| `/albums` | static | Browse — **series** then **discography** sections | `getBrowseAlbumSections` |
| `/albums/[slug]` | SSG | Album detail — tracklist, play header, related albums | `getAlbumSongs`, `getAlbumKindLabel` |
| `/members/[slug]` | SSG | Artist page — hero, **series shelf** + **studio shelf**, song list | `groupAlbumsByKind(getAlbumsByAuthor)` |
| `/family` | static | Cousin Radio directory | `members` grouped by role |
| `/favorites` | dynamic | Today’s spotlight — one song per member | `getRotatedSpotlightSongs` |
| `/search` | static | Advanced search + filters (tags, members, ages) | `SearchScreen` + shared `lib/search.ts` |
| `/api/plays` | API | POST play events | `recordPlayEvent` |
| `/api/stats` | API | GET aggregate stats | `getSitePlayStats` |

### Navigation (validated)

| Surface | Links |
|---------|-------|
| **Topbar** | Embedded **inline search combobox** on all pages — results dropdown under the field; `/` focuses search |
| **Bottom nav (mobile)** | Home, Songs, Favs, Family |

> **Note:** Original `DESIGN-SPOTIFY.md` listed Search as a bottom tab. **Current code** uses search in the Topbar instead; bottom nav has Songs + Favorites.

---

## 6. Album system — design principles (validated)

**Source:** `data/albums.ts` — not auto-duplicated compilations anymore.

### Album kinds

| Kind | Meaning | Config |
|------|---------|--------|
| `series` | Themed / growing release | Manual `SERIES_ALBUM_DEFS[]` — append `songSlugs` as singles drop |
| `discography` | “Made for {Name}” collection | Auto-built from songs **not** already in any series |

### Rules (enforced in code + smoke tests)

1. **Each song → at most one album** (`getSongAlbumAssignmentMap`, test in `smoke.test.ts`)
2. **Series wins** when resolving parent album for a track (`getAlbumForSong`)
3. **No duplicate artist in hero carousel** — `getPrimaryAlbums()` returns exactly one per member with songs
4. **Primary album pick** — latest growing series per artist (newest tracks win); solo collections count as growing series when no themed series exists
5. **Growing series includes everyone** — `getGrowingSeriesAlbums()` lists all series plus solo full collections; supplementary shelf surfaces extra themed albums without hiding cousins

### Helpers

| Function | Use |
|----------|-----|
| `getPrimaryAlbums()` | 3D carousel + spotlight names |
| `getBrowseAlbumSections()` | `/albums` page sections |
| `getGrowingSeriesAlbums()` | Browse + inclusive growing-series set (every artist with songs) |
| `getSupplementarySeriesAlbums()` | Home “Growing series” shelf — extra themed albums, newest first |
| `groupAlbumsByKind()` | Member pages |
| `getAlbumHeroBadge(album, hero)` | Carousel badge copy |

### Adding a song (workflow)

See `docs/ADDING_SONGS.md`. Summary:

```bash
./scripts/add-song.sh <author> <video.mp4> <slug>
# → edit data/songs.ts
# → if series: append slug in SERIES_ALBUM_DEFS in data/albums.ts
# → npm run ci && git push main
```

---

## 7. Rotation & featured logic

Two parallel systems — **albums** (hero/carousel) and **songs** (shelves/queue).

### Song rotation (`lib/featured-rotation.ts`)

| Function | Behavior |
|----------|----------|
| `getDayIndex()` | Day-of-year for fair daily rotation |
| `createRefreshSeed()` | Random 0–9999 per page load — shifts order on refresh |
| `getSpotlightSongPerMember()` | One song per member, rotates daily through their catalog |
| `getHeroFeaturedSong(seed)` | Picks from spotlight pool (legacy hero — home now uses albums) |
| `getRotatedFeaturedShelf(seed)` | Spotlight songs first, then rest |
| `getFairRotationQueue(seed)` | Interleaves by author — everyone in the mix |
| `isSpotlightSong(song)` | Used on song detail badge |

### Album rotation (`lib/album-rotation.ts`)

| Function | Behavior |
|----------|----------|
| `getHeroFeaturedAlbum(seed)` | Featured albums first (Evelyn), else daily rotation across primary albums |
| `getRotatedAlbumCarousel(seed)` | Hero first if featured; else rotate all 6 primaries |
| `getAlbumHeroBadge(album, hero)` | 💛 Featured · ✨ Today's spotlight · 🎵 From the collection |
| `getSpotlightAlbumAuthorNames()` | Lists all primary album artists |

---

## 8. Global player

**Source:** `contexts/player-context.tsx`

| Principle | Implementation |
|-----------|----------------|
| Persistent playback | Single hidden `<audio>` in provider |
| Mobile tap safety | `play()` called inside click handler, not deferred `useEffect` |
| Queue support | `playQueue(songs, startIndex)` — albums use full tracklist |
| Toggle same song | `toggleSong` — pause/resume or switch track |
| Auto-advance | `onEnded` → next in queue + `complete` analytics event |
| Analytics | `trackPlayEvent` fire-and-forget via `sendBeacon` / `fetch keepalive` |

**Mini player:** cover, title, artist, progress bar, skip prev/next, tap → song page.

---

## 9. Analytics & security

**Posture (tracking):** `docs/SECURITY-POSTURE.md`  
**Setup & API:** `docs/SECURITY-AND-ANALYTICS.md`

| Layer | Status |
|-------|--------|
| Neon project | `family-jukebox` (`cold-snow-21143676`) |
| Tables | `play_events`, `rate_limit_hits` |
| Vercel env | `DATABASE_URL`, `PLAY_TRACKING_ENABLED` synced |
| Privacy | No names, emails, IPs in play events — slug + anonymous session cookie only |
| Local without DB | App works; tracking returns `{ tracked: false }` |

**Security (2026-06-25):** CSP + security headers, same-site API origin guard, IP + session rate limits with HTTP 429, staging noindex, slug validation at parse time. Music MP3s are public static files (not DRM) — see posture doc.

---

## 10. UI & design principles

### Product principles (implemented)

| Principle | Where validated |
|-----------|-----------------|
| **All-inclusive family culture** | Every artist in growing series + one primary hero slot; fair song queue rotation — `data/albums.ts`, `lib/featured-rotation.ts` |
| **Love & celebration** | Birthday/Father's Day heroes, featured release badges, musical portraits — `lib/celebrations.ts`, `lib/album-rotation.ts` |
| **Listen first** | Home leads with 3D album hero + play buttons, not bios |
| **≤2 taps to play** | Hero play, shelf cards, mini player |
| **Playback persists** | `PlayerProvider` wraps entire app |
| **Family flavor on detail** | Stories, lyrics, prompts on song pages — not on home hero |
| **Fair rotation** | Every member gets spotlight song + primary album slot |
| **Mobile-first** | Bottom nav, safe-area padding, tap targets ≥44px, play buttons visible on mobile (opacity 100) |
| **Public link ready** | No auth; lightweight API guards only |

North-star values: `docs/COUSIN-RADIO-DIRECTION.md` §3 · `BRAND_DESIGN_PRINCIPLES` in `lib/brand.ts`.

### Visual system (actual tokens — `app/globals.css`)

| Token | Value | Usage |
|-------|-------|--------|
| `--jb-bg` | `#0b0f14` | Page background |
| `--jb-panel` | `#111821` | Cards, panels |
| `--jb-text` | `#f7fbff` | Primary text |
| `--jb-muted` | `#a7b3c2` | Secondary text |
| `--family-pink` | `#ff6fb1` | Primary accent, active nav, playing state |
| `--family-ocean` | `#6cb7ff` | Secondary accent, gradients |
| `--family-lilac` | `#c4b5fd` | Solene / ambient |
| `--family-glow` | `#ffb8d9` | Badge text |

**Background:** layered radial gradients (pink top-left, ocean top-right, lilac bottom) — warm dark, **not** pure Spotify `#121212`, but same *dark player app* feel.

**Typography:** Inter 400–900, extrabold headings, tight tracking on titles.

**Shape language:** generous radius (`rounded-[28px]` panels, `rounded-2xl` cards) — softer than Spotify’s 4px spec in `DESIGN-SPOTIFY.md`. We evolved toward **family-mock warmth** over strict Spotify clone.

**Per-album accents:** `accentColor` on albums drives hero glow and card shadows.

### Component patterns

| Pattern | Components |
|---------|------------|
| Horizontal shelves | `AlbumShelf`, `FeaturedShelf`, `RecentQueue` — snap scroll, hidden scrollbar |
| Play affordance | `PlayIconButton` — visible on mobile, hover on desktop |
| Cover art | `CoverImage` — consistent aspect-square |
| Playing state | Pink ring + pink title text |
| Sections | `rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)]` |

### 3D album carousel (`AlbumCarousel3D`)

| Spec | Value |
|------|-------|
| Items | 6 primary albums max |
| Perspective | `1200px` |
| Auto-rotate | 6s, pauses on hover/touch |
| Swipe | ±40px threshold |
| Side covers | `scale(0.82)`, opacity 0.5 |
| Front cover | `scale(1.05)`, accent glow shadow |

---

## 11. CI/CD & quality gates

**Detail:** `docs/CI-CD.md`

```bash
npm run ci   # lint + smoke (12 tests) + build
```

Smoke tests cover: catalog integrity, album assignment rules, carousel dedup, rotation, play payload validation.

**Deploy path:** push `main` → Vercel auto-deploy → CD workflow hits production URLs.

---

## 12. File map (key paths)

| Path | Role |
|------|------|
| `data/songs.ts` | Song catalog |
| `data/albums.ts` | Album catalog + primary/browse helpers |
| `data/members.ts` | Family members |
| `data/lyrics.ts` | Whisper transcriptions |
| `lib/featured-rotation.ts` | Song-level rotation |
| `lib/album-rotation.ts` | Album-level rotation + badges |
| `contexts/player-context.tsx` | Global audio |
| `components/album-carousel-3d.tsx` | Landing hero |
| `middleware.ts` | Session cookie + security headers + API origin guard |
| `scripts/add-song.sh` | Add-song pipeline |
| `scripts/smoke.test.ts` | CI catalog/rotation tests |

---

## 13. Related docs

| Doc | Contents |
|-----|----------|
| `docs/ADDING_SONGS.md` | Add-song checklist |
| `docs/ALBUMS-SPEC.md` | Original album feature spec (some IA evolved) |
| `docs/DESIGN-SPOTIFY.md` | Original Spotify UX target (partially superseded) |
| `docs/SECURITY-POSTURE.md` | Security posture, threat model, changelog |
| `docs/SECURITY-AND-ANALYTICS.md` | Neon setup + analytics API |
| `docs/CI-CD.md` | GitHub Actions + Vercel |
| **`docs/PROJECT-RECORD.md`** | **This file — living architecture record** |

---

## 14. Spec vs code drift (intentional)

| Spec said | Code does | Why |
|-----------|-----------|-----|
| Spotify `#121212` + 4px radius | Warm dark gradients + 28px panels | Family mock aesthetic |
| Search in bottom nav | **Inline combobox in Topbar** — live grouped results (Artists / Albums / Songs), keyboard nav, pink highlight | No page navigation while typing |
| Green `#1ed760` play | Pink/ocean gradient accent | Family brand colors |
| 5 albums in carousel | 6 (one per member) | Evelyn added to family |
| Auto `{slug}-album` for everyone | Series + discography split | Avoid duplicate albums/tracks |
| Hero featured **song** | Hero featured **album** | Album feature shipped |

When in doubt, **trust the code** and update this record after meaningful changes.

---

## 15. Quick validation commands

```bash
# Catalog snapshot
npx tsx -e "
import { songs } from './data/songs';
import { albums, getPrimaryAlbums, getBrowseAlbumSections } from './data/albums';
console.log({ songs: songs.length, albums: albums.length, carousel: getPrimaryAlbums().map(a=>a.slug), browse: getBrowseAlbumSections() });
"

# Full CI
npm run ci

# Production stats (when Neon has data)
curl -s https://cousinradio.com/api/stats | jq
```

---

*Update this file when adding members, changing album rules, or shifting home IA.*
