# Family Jukebox Album-First Experience Spec

## 1) Product Intent

Turn the existing creator songs into album experiences so the app feels like a music product, not just a song directory.

### Core outcomes

1. Landing page is album-led and immediately playable.
2. Every creator has an album built from existing songs.
3. Album surfaces appear across the app (home, member, songs, album library, album detail).
4. Playback remains instant and queue-aware.

## 2) Information Architecture

### Primary routes

- `/` Home (Album-first hero + shelves)
- `/albums` Album library
- `/albums/[slug]` Album detail with playable track list
- `/songs` Song library with album discovery
- `/members/[slug]` Artist page with linked album

### Navigation changes

- Replace legacy Favorites tab in global nav with Albums tab.
- Keep existing Songs and Family routes.

## 3) Data Model

### `data/albums.ts`

New album domain generated from existing content:

- `slug`
- `title`
- `subtitle`
- `artistSlug`
- `coverSrc`
- `releaseDate`
- `songSlugs`
- `accentFrom` / `accentTo` (visual theme for gradients and glow)

### Rules

- One album per creator using that creator's existing songs.
- Album cover defaults to the creator's most recent song cover.
- Album ordering: newest release first, then higher track count.

## 4) Landing Experience (Album Hero)

### New hero module behavior

`AlbumHeroShowcase` should:

1. Render a stacked 3-card "3D-like" album motion treatment using CSS perspective.
2. Auto-rotate featured album every ~7 seconds.
3. Allow manual switching with chips/buttons.
4. Show selected album metadata and CTA:
   - Play album
   - Open album page
5. Show top tracks from selected album with direct track playback.

### Motion constraints

- Keep movement subtle and performant (transform + opacity only).
- Respect reduced visual clutter: no heavy particle effects or canvas.
- Focus on interactive polish, not GPU-heavy scenes.

## 5) Album Library and Detail

### Album library (`/albums`)

- Grid/list of all creator albums.
- Each card includes:
  - Cover
  - Album title + artist
  - Track count
  - Play album action
  - "Open album" link

### Album detail (`/albums/[slug]`)

- Hero section with gradient + cover.
- Album-level play action (queue all tracks).
- Track list with row-level play/pause and links to song pages.
- Link back to artist page.

## 6) Cross-App Album Surfaces

### Home (`/`)

- Album hero at top.
- Album spotlight grid/shelf under hero.
- Existing song shelf and queue remain, but album-first priority.

### Songs (`/songs`)

- Add compact album shelf under main songs section.

### Member page (`/members/[slug]`)

- Add creator album card/shelf with play/open actions.

### Song detail (`/songs/[slug]`)

- Add "From album" card linking to album page and artist.

## 7) Playback and Queue Behavior

- Album play should queue all songs in album order.
- Track play in album context should continue to next track in that album.
- Existing global mini-player stays unchanged.
- No backend dependency: all playback uses current local asset metadata.

## 8) UX Acceptance Criteria

1. A user can play any creator album within 1 tap from Home.
2. A user can open album detail within 1 tap from Home or Albums.
3. Song pages always expose album context when available.
4. Member pages expose creator album context when available.
5. App compiles and lints cleanly.

## 9) Technical Validation Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Home, Albums, Album Detail routes render
- [ ] Play/pause controls work from hero and album cards
- [ ] No regressions in existing song/member navigation

## 10) Release and Deployment

1. Implement spec in feature branch.
2. Run lint/build validation.
3. Commit and push.
4. Open PR targeting `main` for deployment pipeline.
