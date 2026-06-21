# Family Jukebox Album Experience Spec

## 1. Product goal

Turn the existing song library into a more premium, collectible music product by presenting each creator's work as an album, not just a list of separate singles.

The landing page should feel like the "money screen":

- album-first
- instantly playable
- visually rich
- dynamic on refresh
- clearly connected to the real songs that already exist in the app

## 2. Problem statement

Today the app mostly exposes:

- individual songs
- member pages
- rotating featured tracks

That works for playback, but it undersells the perceived value of the content. The same music feels much bigger when it is framed as:

- creator albums
- featured releases
- collectible cover art objects
- playable tracklists
- cohesive album worlds

## 3. Proposed experience

### 3.1 Landing page

The home route (`/`) becomes an album-led listening surface.

#### Core sections

1. **Album hero**
   - Rotating featured album on every refresh
   - Big cover art moment
   - Clear creator attribution
   - Play album CTA
   - View album CTA
   - Secondary "play family mix" CTA
   - Layered side stack of other album covers to give depth / pseudo-3D motion

2. **Album shelf**
   - Horizontal or grid-style album cards
   - Every creator has a collection card
   - Play directly from the album card
   - Open album detail from the card

3. **Tracks inside the albums**
   - Preserve individual-song browsing
   - Keep the current shelf and queue behavior for listeners who still think in tracks

4. **Recent / mix sections**
   - Maintain momentum and replay value
   - Keep the persistent player behavior unchanged

### 3.2 Album library

Add a dedicated `/albums` route that behaves like a release browser:

- browse all creator albums
- see creator, release type, and track count
- play any album directly
- enter the album detail page

### 3.3 Album detail page

Add `/albums/[slug]` pages for each release.

Each album page should include:

- big cover + immersive header
- creator identity
- album subtitle and description
- play album action
- track list with queue playback
- links back to creator pages and individual song pages
- tag summary sourced from the songs already inside the album

### 3.4 Song detail page

Song pages remain first-class, but now each song should show its album context:

- album title
- track number
- link back to the album page

### 3.5 Member page

Member pages should expose the member's album release as their primary collection:

- link to the album
- album card / album summary near the hero or about section

### 3.6 Search

Search should match both:

- songs
- albums

Album results should appear before or alongside song results so the user can enter through the collection view.

## 4. Information architecture

```txt
/                 Album-first landing experience
/albums           Album library
/albums/[slug]    Album detail page
/songs            Track browser
/songs/[slug]     Track detail page
/family           Creator directory
/members/[slug]   Creator page
/search           Search songs + albums
```

## 5. Data model

Introduce a first-class album entity in `data/albums.ts`.

### Album shape

- `slug`
- `title`
- `subtitle`
- `description`
- `memberSlug`
- `releaseDate`
- `coverSrc`
- `kind`
- `songSlugs`
- `palette`

### Why a separate album layer

Do **not** infer album structure only from UI components. A dedicated album model lets the app:

- reuse the same album data across routes
- map songs back to albums
- keep consistent artwork / copy / palette
- support future growth when a creator has multiple releases

## 6. Content strategy

This feature should reuse existing songs rather than requiring new audio.

Initial release plan:

- one curated album per creator
- each album groups that creator's existing tracks
- one-song creators ship as EPs
- multi-song creators ship as albums

This creates a premium presentation immediately while leaving room for future releases later.

## 7. Visual system

### 7.1 Art direction

The experience should feel:

- darker and more cinematic than the current scrapbook feel
- still warm and family-centered
- collectible, like cover art objects you want to tap

### 7.2 Motion / depth

The landing hero should use lightweight depth cues rather than heavy animation libraries:

- layered album stack
- slight rotation and lift on hover
- glow / halo based on album palette
- strong gradients behind cover art

This delivers the "3-D motions or whatever beautiful made album" direction without adding unnecessary runtime complexity.

## 8. Playback behavior

Playback rules:

- tapping play on an album starts the album queue at track 1
- mini player remains global and persistent
- song pages can still play single-track or contextual queues
- album track lists should play in album order
- home hero play should start the featured album immediately

## 9. Validation requirements

Before shipping:

- lint passes
- production build passes
- route generation works for albums and songs
- search renders with album results
- album play buttons create correct queues
- song pages correctly link back to album pages

## 10. Execution plan

1. Add album data model and helpers
2. Build reusable album card + hero components
3. Add album routes
4. Refactor home page to feature albums first
5. Thread album context into songs, member pages, and search
6. Validate with lint + build
7. Ship via PR

## 11. Future extensions

Not required for the first pass, but enabled by this foundation:

- multiple albums per creator
- release chronology
- album-specific artwork assets
- family compilation albums
- animated transitions between album routes
- editorial playlists derived from albums
