# Album Feature — Product & Execution Spec

## Vision

Turn each creator's songs into **albums** — the primary way family music is discovered, played, and remembered. The landing page becomes a **dynamic 3D album showcase** that rotates through creator collections, syncs with playback, and makes "open app → see beautiful albums → tap → hear music" the money moment.

---

## Current State

| What exists | Gap |
|-------------|-----|
| `Song` per track, `FamilyMember` as creator | No `Album` type or grouping |
| `AlbumCard` component (unused) | Only shows single songs, not albums |
| `FeaturedAlbumCard` in shelf | UI metaphor only — not real albums |
| Global `playQueue` player | Works for playlists; no album context |
| Hero shows one featured **song** | Should spotlight a featured **album** |
| Member pages list songs flat | Missing "Albums" section |
| DESIGN-SPOTIFY.md: "Made for [Name]" | Not implemented |

---

## Data Model

### `Album` type (`data/albums.ts`)

```ts
type Album = {
  slug: string;           // e.g. "ocean-album"
  title: string;          // e.g. "Ocean's Adventures"
  subtitle?: string;      // e.g. "Gravity shifts & mountain journeys"
  authorSlug: string;     // links to FamilyMember
  coverSrc: string;       // first song cover or composite
  songSlugs: string[];    // ordered tracklist
  dateCreated: string;    // earliest song date
  story?: string;         // album-level memory
  accentColor?: string;   // per-creator gradient accent
};
```

### Album generation strategy

1. **Creator albums (v1)** — auto-built from `getSongsByAuthor()` for each member with ≥1 song
2. **Slug convention** — `{authorSlug}-album`
3. **Cover** — first song's `coverSrc`
4. **Track order** — songs sorted by `dateCreated`, then title
5. **Future (v2)** — manual `albums` array for themed compilations (e.g. "Garden Stories" spanning tags)

### Helpers

| Function | Purpose |
|----------|---------|
| `getAlbumBySlug(slug)` | Single album lookup |
| `getAlbumsByAuthor(authorSlug)` | Member's albums |
| `getAlbumSongs(album)` | Resolve `songSlugs` → `Song[]` |
| `getAllAlbums()` | Full catalog |
| `getAlbumForSong(song)` | Parent album for a track |

---

## Landing Page — 3D Album Hero

### `AlbumCarousel3D` component

Replace the static song hero with an interactive **CSS 3D carousel** of creator albums.

**Visual design:**
- Perspective container (`perspective: 1200px`)
- 5 album covers arranged in a ring (one per creator with songs)
- Front album: full size, lit, sharp shadow
- Side albums: rotated ±40–72°, scaled down, dimmed
- Subtle ambient glow using per-album accent colors
- Auto-rotate every 6s; pauses on hover/touch

**Interactions:**
| Action | Behavior |
|--------|----------|
| Tap side album | Rotate ring to bring it front |
| Tap play on front album | `playQueue(albumSongs, 0)` |
| Swipe left/right | Rotate carousel |
| Album playing | Front album gets pink ring + pulse |
| "View album" link | Navigate to `/albums/[slug]` |

**Hero copy:**
- Badge: "Today's spotlight · {creator name}"
- Title: "Cousin Radio"
- Subtitle: front album title + track count
- CTAs: Play album · Play family mix · View album

**Rotation logic** (`lib/album-rotation.ts`):
- Daily fair rotation picks spotlight album (mirrors song spotlight)
- Per-refresh seed shifts which album starts front
- Reuses `getDayIndex()` / `createRefreshSeed()` patterns

---

## Album Shelf — "Family Albums"

### `AlbumShelf` component

Horizontal scroll shelf below the hero (replaces or supplements featured song grid).

- Section title: **"Family albums"**
- Subtitle: "One collection per cousin — tap to explore or play"
- Uses updated `AlbumCard` linking to `/albums/[slug]`
- Play button on hover/tap plays full album queue
- Snap scroll on mobile

---

## Album Detail Page — `/albums/[slug]`

Spotify-style album page:

```
┌─────────────────────────────────────┐
│  [← Back]                           │
│  ┌──────┐  Made for Ocean           │
│  │cover │  Ocean's Adventures        │
│  │ art  │  2 songs · age 10         │
│  └──────┘  [▶ Play album]           │
├─────────────────────────────────────┤
│  Tracklist                          │
│  1. Gravity Shift          3:42  ▶  │
│  2. Mountains to the Shore 2:58  ▶  │
├─────────────────────────────────────┤
│  About this album                   │
│  {story / member description}       │
│  [View Ocean →]                     │
└─────────────────────────────────────┘
```

- `generateStaticParams` from all albums
- Share metadata with album title + cover
- Tracklist uses `SongRow` with album as playlist context
- Link to member page and individual song pages

---

## Albums Index — `/albums`

Grid of all family albums:
- Cover grid (2 cols mobile, 4+ desktop)
- Filter chips by member (optional v1: show all)
- "Play all" shuffles fair family mix via existing `getFairRotationQueue`

---

## Integration Points

### Member page (`/members/[slug]`)

Add **Albums** section above Popular:
- Show creator's album(s) as large `AlbumCard`
- "Play album" in header plays album queue (same as all songs today)

### Song page (`/songs/[slug]`)

- Add breadcrumb/link: "From {album title}" → `/albums/[slug]`
- "Play album" action alongside "Play artist mix"

### Search (`/search`)

- Match albums by title, author name, song titles within
- Show album results above song results when query matches

### Navigation

- Sidebar + bottom nav: no new tab (albums surfaced on home + member pages)
- `/albums` reachable from hero "View all albums" link and shelf header

### Player context

No changes required — `playQueue(albumSongs, startIndex)` already handles album playback. Optional future: expose `currentAlbum` in context for mini-player subtitle.

---

## File Plan

| File | Action |
|------|--------|
| `docs/ALBUMS-SPEC.md` | This spec |
| `data/albums.ts` | Album type + auto-generation + helpers |
| `lib/album-rotation.ts` | Hero carousel rotation |
| `components/album-carousel-3d.tsx` | 3D landing hero |
| `components/album-shelf.tsx` | Horizontal album shelf |
| `components/album-card.tsx` | Rewrite for Album type |
| `components/album-play-header.tsx` | Play album button |
| `app/albums/page.tsx` | Albums index |
| `app/albums/[slug]/page.tsx` | Album detail |
| `app/page.tsx` | Wire 3D hero + album shelf |
| `app/members/[slug]/page.tsx` | Albums section |
| `app/songs/[slug]/page.tsx` | Album breadcrumb |
| `components/search-screen.tsx` | Album search results |
| `components/hero-section.tsx` | Deprecated → replaced by carousel |

---

## Visual & Motion Tokens

```css
/* 3D carousel */
--album-carousel-perspective: 1200px;
--album-carousel-duration: 600ms;
--album-carousel-auto-rotate: 6s;

/* Per-creator accents */
--album-ocean: #6cb7ff;
--album-marceline: #ff9ec8;
--album-eliana: #ff6fb1;
--album-solene: #c4b5fd;
--album-tio: #7dd3fc;
```

Animations: CSS `transform` + `transition` only (no Three.js — keeps bundle lean, works on mobile).

---

## Success Criteria

- [ ] Every creator with songs has an auto-generated album
- [ ] Landing hero shows 3D rotating album carousel
- [ ] Tapping play on front album starts full album queue
- [ ] `/albums/[slug]` shows tracklist with working playback
- [ ] Member pages show album section
- [ ] Song pages link back to parent album
- [ ] Search finds albums by name/author
- [ ] Playback persists across album → song navigation
- [ ] Build passes (`next build`)
- [ ] Mobile-friendly at 390px width

---

## Future (v2+)

- Themed compilation albums (tag-based: "Garden", "Space")
- Custom album artwork (collage of song covers)
- Album-level stories editable in data file
- Mini-player shows album name when playing from album context
- `@react-three/fiber` upgrade path if richer 3D is wanted later
