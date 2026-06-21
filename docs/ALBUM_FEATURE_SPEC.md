# Album Feature Landing Spec

## Product goal

Turn the existing family-song catalog into creator albums that make the landing page feel like the main music product: open the app, see beautiful albums, tap one, and immediately hear that creator's songs as a queue.

## Current foundation

- Songs already belong to creators through `authorSlug` in `data/songs.ts`.
- Creator pages at `/members/[slug]` already behave like album detail pages with "Play all" queues.
- The global player in `contexts/player-context.tsx` already supports `playQueue`, skip next/previous, and persistent playback across navigation.
- The current home page already rotates featured songs with `lib/featured-rotation.ts`.

## Album model

Albums are derived from existing static data rather than stored separately:

- One album per family member.
- Album `slug` and `memberSlug` match the member slug.
- Album tracks are all songs where `song.authorSlug === member.slug`.
- Album cover defaults to the creator's first song cover.
- Album tags are the unique tags from the album's songs.
- Album title/subtitle/description can be curated in `lib/albums.ts` while tracks stay automatic.

This keeps future song additions simple: adding a song to `data/songs.ts` automatically updates the creator album, home album cards, and queue playback.

## Landing page experience

### Hero: dynamic album stage

- Replace the single-track hero with a 3D-style album stage.
- Show all creator albums as layered cards using CSS perspective, rotation, scale, and glow.
- Start on the album attached to the daily featured creator.
- Selecting an album brings it forward and updates the hero copy.
- "Play album" plays the selected creator's songs from track one.
- "Play family mix" keeps the existing fair family queue.
- A track strip under the hero lets users jump into any song in the selected album.

### Album shelf

- Add a "Creator albums" shelf below the hero.
- Each album card:
  - Shows cover art, creator, song count, and tags.
  - Links to the existing creator page.
  - Plays or pauses the creator album with one tap.
  - Highlights when any song from that album is the current song.

### Existing shelves

- Keep the featured-song shelf and recent queue below albums.
- This preserves song discovery while making albums the primary landing-page feature.

## Playback behavior

- Album playback uses `playQueue(album.songs, 0)` inside button/click handlers.
- Song rows inside the hero use `useSongPlayback(song, { playlist: album.songs })`.
- The mini player and skip controls require no changes because the queue already tracks songs.
- Empty albums should render as inactive until songs are added.

## Accessibility and mobile criteria

- All playback controls remain buttons with accessible labels.
- Touch targets stay at least 44px.
- The album stage works as a horizontal scroll/select UI on smaller screens.
- Motion is decorative and CSS-driven; core play/select behavior does not depend on animation.

## Validation checklist

- `npm run lint`
- `npm run build`
- Manual smoke path:
  1. Open `/`.
  2. Select at least two album cards in the hero.
  3. Play an album and verify the mini player updates.
  4. Skip to the next track and verify it stays within the queue.
  5. Open a creator page from an album card and verify playback continues.
