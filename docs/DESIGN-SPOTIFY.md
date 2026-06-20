# Family Jukebox → Spotify-style UX Spec

## Current problems (v1)

| Issue | Why it hurts on phone |
|-------|----------------------|
| Long marketing hero | Pushes music below the fold |
| Full family bio grid on home | Feels like a website, not a player |
| Tag + age + member filters on home | Too much chrome before listening |
| Card grid layout | Slow to scan; not thumb-friendly |
| Native `<audio>` blocks per page | No persistent playback |
| Light scrapbook theme | Doesn't match "open app → play" habit |
| Footer + big header | Wastes vertical space |

## Target experience

**One thumb rule:** open app → see music → tap → hear it. Everything else is one tap deeper.

### Information architecture

```
Home (/)           → listen now, carousels, song rows
Search (/search)   → find by name, age, tag
Family (/family)   → all members (artist library)
/members/[slug]    → artist page (Spotify artist)
/songs/[slug]      → track detail + story/memory
```

### Home (Spotify Home tab)

1. **Greeting** — one line ("Good evening" / "Family Jukebox")
2. **Jump back in** — 2×2 gradient tiles, tap = instant play
3. **Family artists** — horizontal circles → member page
4. **Popular** — compact song rows, tap = play
5. **Made for [Name]** — horizontal album cards per kid

**Remove from home:** bios, filters, footer, inline audio players, long copy.

### Global player

- **Mini bar** (sticky above nav): cover · title · artist · play/pause
- Tap bar → full song page
- Audio persists across navigation

### Bottom nav (mobile)

| Tab | Icon | Purpose |
|-----|------|---------|
| Home | house | Main feed |
| Search | magnifier | Filters + search |
| Family | users | Member directory |

### Member page (Spotify Artist)

- Blurred cover gradient header
- Name + "N songs · age X"
- Green **Play** (plays all their songs)
- Song list rows
- **About** — bio, role, memory (collapsed feel)

### Song page (Spotify Track / Now Playing)

- Large cover art
- Title + artist link
- Play / pause (synced with mini player)
- Tags as chips
- Story / prompt below (secondary)

### Visual system

| Token | Value |
|-------|-------|
| Background | `#121212` |
| Surface | `#181818` / `#282828` |
| Text primary | `#ffffff` |
| Text muted | `#b3b3b3` |
| Accent (play) | `#1ed760` |
| Radius cards | `4px` (Spotify-tight) |
| Radius tiles | `8px` |

Typography: bold titles, 14px metadata, minimal uppercase.

### What we keep (family flavor)

- Member names & ages on artist pages
- Story / prompt on song detail (not on home)
- Warm copy only on detail screens
- Emoji avatars where no photo exists

### Success criteria

- [ ] Home loads to playable content in <1 scroll
- [ ] Any song playable in ≤2 taps from home
- [ ] Playback continues when browsing
- [ ] Search/filter moved off home
- [ ] Feels native on 390px width (iPhone)
