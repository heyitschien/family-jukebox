# Mobile Player UX — Spec & Plan

**Branch:** `feature/mobile-player-ux`  
**Status:** Implementing  
**Scope:** Lock-screen artwork, compact favorites, player heart, queue context, resume position

---

## 1. Lock-screen / Now Playing artwork

### Problem
When the phone sleeps, iOS/Android show Media Session metadata. Today we only send the Cousin Radio brand mark — not the song cover — so lock screen looks generic.

### Solution
- Set `navigator.mediaSession.metadata.artwork` to song cover URLs (128–1024px) via `/api/now-playing-artwork?song={slug}&size={n}`.
- Artwork route composites the song cover with a soft vignette and small CR badge (Apple Music–style polish until a final logo ships).
- Wire `mediaSession.setActionHandler` for play / pause / previoustrack / nexttrack.
- Sync `navigator.mediaSession.playbackState` with `isPlaying`.

### Acceptance
- [ ] Lock screen shows current song artwork (not only brand icon).
- [ ] Lock-screen transport controls drive the in-app player.
- [ ] Falls back to brand artwork if cover is missing.

---

## 2. Compact favorites list (mobile-first)

### Problem
Favorites uses the full `SongGrid` card layout — large tiles, few songs visible on phone.

### Solution
- Replace grid with a dense `FavoriteSongRow` list: ~52px rows, small cover, title + artist, inline play + heart.
- Keep “Play favorites” / “Play in order” actions at top.
- Drop heavy filters on favorites (optional: keep search later); focus on scannable list.

### Acceptance
- [ ] Favorites shows many songs per screen on mobile.
- [ ] Rows match existing play / heart behavior.
- [ ] Play-all still queues favorites with correct context.

---

## 3. Heart on mini player

### Problem
Users must open song detail or browse to favorite — no heart in the sticky player.

### Solution (mobile)
- **Top row:** heart button on the right (near elapsed time).
- **Transport row:** heart at far left; radio / shuffle / transport unchanged to the right.

Desktop: heart in the left track-info column.

### Acceptance
- [ ] Heart toggles local favorites from mini player.
- [ ] Filled state reflects `useFavoriteSongs`.
- [ ] Does not steal focus from play/pause.

---

## 4. Queue context — “where am I listening?”

### Problem
Starting playback from an album, favorites, or shelf gives no persistent cue about the active queue. Tapping the player only opens the song page.

### Solution
- Add `QueueContext` to player state: `{ kind, label, href }`.
- Pass context from play entry points (album, favorites, artist, shelf, queue, radio).
- Mini player shows tappable **“From {label}”** under the artist line → navigates to source (album page, favorites, artist, `/now-playing`).
- New **`/now-playing`** page: large art, context chip, scrollable queue with current track highlighted; tap row to jump.

### Acceptance
- [ ] Context label visible while something is playing.
- [ ] Context link opens the correct playlist/source.
- [ ] `/now-playing` shows full queue and current index.

---

## 5. Resume playback position

### Problem
Leaving mid-song and returning restarts from 0:00.

### Solution
- `localStorage` map `slug → seconds` (throttled saves on timeupdate + on pause).
- On `startPlayback`, if saved position is between 8s and `duration - 12s`, seek there once metadata loads.
- Clear saved position when track completes.

### Acceptance
- [ ] Returning to a half-played song resumes near last position.
- [ ] Near-start and near-end positions do not resume (avoid awkward jumps).
- [ ] Storage failures are silent (playback still works).

---

## Implementation order

| Phase | Work | Risk |
|-------|------|------|
| 1 | `queue-context`, `playback-position` libs + player context | Low |
| 2 | Media Session artwork + action handlers | Medium (device QA) |
| 3 | Mini player heart + context UI | Low |
| 4 | Favorites compact list | Low |
| 5 | `/now-playing` page | Low |
| 6 | Smoke tests for new libs | Low |

---

## Out of scope (future)

- Cross-device favorites sync
- Expanded full-screen player sheet (can evolve from `/now-playing`)
- Final Cousin Radio logo in artwork composite
