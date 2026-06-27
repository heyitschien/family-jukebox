# Ambient Visual Sync — Spec & Proposal

**Status:** Proposed  
**App:** Cousin Radio / Family Jukebox  
**Date:** 2026-06-24  
**Related:** `MOBILE-PLAYER-UX-SPEC.md`, `MUSIC-INTELLIGENCE-SPEC.md`, `ALBUMS-SPEC.md` (§ “syncs with playback”)

---

## 1. One-line vision

When someone is **listening** but **not actively browsing**, the app should quietly rearrange itself around the music — and keep up when the song changes — so the screen always feels like it belongs to what’s playing.

---

## 2. Problem statement

Today playback and visuals are **partially connected**:

| Surface | Synced to `currentSong`? | Gap |
|---------|--------------------------|-----|
| Mini player | ✅ Yes | — |
| `/now-playing` | ✅ Yes | Only if user navigates there |
| Song rows (`isCurrent` highlight) | ✅ Per-row | Lists don’t scroll; highlight easy to miss off-screen |
| Home 3D carousel | ⚠️ Partial | Shows pink ring if *that* album is playing, but **does not rotate** to the playing album |
| Album cover rotator | ❌ No | Rotates on a 4.5s timer unrelated to playback |
| Carousel auto-advance | ❌ No | Rotates every 6s on a timer, fights playback context |
| Featured / recent shelves | ⚠️ Partial | Highlight only; no scroll-into-view |
| Album / member / songs pages | ⚠️ Partial | Track highlight exists; no auto-scroll |
| Route / page | ❌ No | User can sit on `/family` while Marceline plays — page never catches up |

**User story:** Dad starts Cousin Radio, taps play on the hero carousel, then puts the phone down or reads lyrics on another page. Two songs later the mini player shows a new track, but the hero still spotlights the album he started from (or keeps auto-rotating through unrelated artists). The app feels like two apps — audio in one lane, visuals in another.

**What we want:** Spotify-style “the UI follows the music” without hijacking someone who is actively exploring.

---

## 3. Design principles

1. **Music leads, UI follows** — `currentSong` (+ `queueContext`) is the source of truth for ambient sync.
2. **Never fight the user** — any touch, scroll, or navigation resets a guard; no sync while the user is clearly in control.
3. **In-place before navigate** — prefer scrolling, highlighting, and carousel rotation over hard route changes.
4. **Soft motion** — 400–600ms transitions; no flash cuts. Sync should feel like the app “noticed” what’s playing.
5. **Progressive depth** — quick reactions on track change; deeper sync only after idle.
6. **Deterministic & testable** — pure helpers for “which album/shelf should reflect this song?”; smoke tests lock behavior.
7. **Family-first** — sync surfaces artist/album context (who made this, which collection) — not generic “now playing” chrome.

---

## 4. Two sync tiers

### Tier A — **Live follow** (on every track change)

Fires when `currentSong.slug` changes (auto-advance, skip, radio continuation, or new play).

| Action | Delay | Notes |
|--------|-------|-------|
| Update row highlights | 0ms | Already exists via `isCurrent` |
| Rotate home carousel to playing album | 300ms debounce | Skip if user interacted in last 2s |
| Set cover rotator to current track’s cover | 300ms debounce | Overrides timer while “following” |
| Scroll current row into view (if on list page) | 500ms debounce | `scrollIntoView({ block: 'nearest', behavior: 'smooth' })` |
| Update hero glow / accent to album color | 300ms | CSS transition on `--hero-accent-glow` |

**Does not:** change route, open modals, or steal focus.

### Tier B — **Ambient mode** (after idle)

Fires when **all** are true:

- `currentSong !== null`
- `isPlaying === true` (or was playing within last 30s — covers brief buffering)
- No user interaction for **≥ 8 seconds** (configurable)
- User is not focused in an input / search field
- Ambient sync not explicitly disabled (future setting)

| Action | Notes |
|--------|-------|
| Everything in Tier A | Catch up if Tier A was suppressed during interaction cooldown |
| Scroll home shelves so playing song/album is visible | Horizontal scroll for carousels |
| Optional: gentle “listening” banner | Small chip above mini player: “Following playback · tap anywhere to browse” |
| **Route policy** (conservative v1) | **Do not** auto-navigate between top-level tabs. Only sync visuals on the **current** page. |

**v2 route policy (optional, longer idle ≥ 20s):**

- If on a page unrelated to current queue (`/family`, `/search`, stale song page), soft-navigate to the best context:
  - `queueContext.href` when it matches the playing queue (album, favorites, artist)
  - else `/now-playing`
- Use `router.push` with a fade transition; never replace history silently.

---

## 5. Interaction guard

New hook: **`useInteractionGuard`**

```ts
type InteractionGuard = {
  /** True if user touched/ scrolled/ navigated recently */
  isUserActive: boolean;
  /** True if ambient sync is allowed right now */
  canAmbientSync: boolean;
  /** True if live follow (Tier A) is allowed */
  canLiveFollow: boolean;
  /** Call from pointerdown, keydown, scroll (throttled), route change */
  signalInteraction: () => void;
};
```

**Events that reset idle timer:**

- `pointerdown`, `keydown`, `touchstart`
- `scroll` (throttled 200ms — intentional browsing)
- Next.js `pathname` change (user navigation)
- Focus into `input`, `textarea`, `[contenteditable]`

**Cooldowns:**

| Constant | Default | Purpose |
|----------|---------|---------|
| `IDLE_MS` | 8000 | Time before Tier B |
| `LIVE_FOLLOW_SUPPRESS_MS` | 2000 | After interaction, skip Tier A carousel/route |
| `TRACK_CHANGE_DEBOUNCE_MS` | 400 | Batch rapid radio transitions |

**Storage:** session-only (no localStorage). Ambient mode resets on refresh — acceptable.

---

## 6. Sync target matrix

### 6.1 Home (`/`)

| Element | Tier A | Tier B |
|---------|--------|--------|
| `AlbumCarousel3D` `activeIndex` | Rotate to album containing `currentSong` via `getAlbumForSong()` | Pause carousel auto-timer while following; resume 8s after user interaction |
| `AlbumCoverRotator` | Show `currentSong` cover when that album is front | Same |
| Hero spotlight text | Show current track title under artist when following | Same |
| `HomeAlbumShelf` | — | Scroll horizontal shelf to playing album card |
| `HomeFeaturedShelf` / `RecentQueue` | Highlight current row | Scroll into view |

**Carousel conflict fix (important):**

Today two timers fight each other:

- Carousel rotates albums every **6s**
- Cover rotator cycles tracks every **4.5s**

**Proposal:** When `canLiveFollow || canAmbientSync`:

- Pause both timers
- Drive carousel index from `getAlbumForSong(currentSong)`
- Drive rotator index from `currentSong` index in `getAlbumSongs(album)`

When user interacts → unpause timers after cooldown.

### 6.2 Album page (`/albums/[slug]`)

| Element | Behavior |
|---------|----------|
| Track list | Scroll to `SongRow` where `isCurrent`; pink highlight (exists) |
| Play header | Already reflects queue play state |
| If playing song from **different** album | Tier B only: show subtle footer chip “Now playing: {title} · from {other album}” linking to correct album — **no auto-leave** in v1 |

### 6.3 Member page (`/members/[slug]`)

| Element | Behavior |
|---------|----------|
| Song list | Scroll to current track if author matches or song is in view |
| If current song is another member | Highlight “Now playing elsewhere” chip in play header |

### 6.4 Songs index / favorites

| Element | Behavior |
|---------|----------|
| Flat lists | Scroll current into view (Tier A if list page is active) |
| Favorites | Same; respect compact row layout |

### 6.5 Song detail (`/songs/[slug]`)

| Element | Behavior |
|---------|----------|
| If detail matches `currentSong` | No-op (already correct) |
| If another song is playing | Tier B: optional banner “Playing {other} — go to track” (v1); auto-redirect (v2 only, long idle) |

### 6.6 `/now-playing`

Always fully synced — no ambient logic needed. Becomes the “sink” page when user taps mini player or context link.

### 6.7 Search

**Never** auto-sync or navigate while search input is focused or query non-empty.

---

## 7. Architecture

### 7.1 New modules

```
lib/ambient-sync/
  resolve-playback-visual.ts   # pure: song → { album, albumIndex, songIndexInAlbum, accentColor }
  sync-policy.ts               # pure: given guard + page + song → SyncAction[]

hooks/
  use-interaction-guard.ts     # idle + cooldown state
  use-ambient-visual-sync.ts   # subscribes to player, emits actions

contexts/
  ambient-sync-context.tsx     # optional: exposes isFollowingPlayback, signalInteraction
```

### 7.2 Player integration

**Option A (recommended):** `useAmbientVisualSync` subscribes to `usePlayer()` — no player changes required for v1.

**Option B (cleaner long-term):** Extend `PlayerContext` with:

```ts
trackRevision: number;  // increments on each startPlayback
lastChangeSource: 'manual' | 'auto-advance' | 'radio';
```

This lets sync policy treat manual skips (user may be listening *and* skipping quickly) differently from radio auto-advance.

### 7.3 Pure resolver (testable)

```ts
// lib/ambient-sync/resolve-playback-visual.ts

export type PlaybackVisualTarget = {
  songSlug: string;
  albumSlug: string | null;
  carouselIndex: number | null;   // index in visible carousel album list
  songIndexInAlbum: number | null;
  accentColor: string | null;
  queueContext: QueueContext | null;
};

export function resolvePlaybackVisual(
  song: Song,
  carouselAlbums: Album[],
): PlaybackVisualTarget;
```

Smoke tests:

- Known song → correct album + index
- Song not in carousel (supplementary series) → `carouselIndex: null`, still resolves album
- Radio continuation with `COUSIN_RADIO_CONTEXT` → home carousel still rotates to song’s album

### 7.4 Component changes (by file)

| File | Change |
|------|--------|
| `components/album-carousel-3d.tsx` | Accept optional `followSongSlug`; pause auto-rotate when following; `useEffect` on `currentSong` |
| `components/album-cover-rotator.tsx` | Accept optional `forcedSongIndex`; pause timer when set |
| `components/song-row.tsx` | Add `ref` + `data-current-track` for scroll targeting |
| `components/home-curated-content.tsx` | Wire `useAmbientVisualSync` at home level |
| `components/app-shell.tsx` | Mount `InteractionGuardProvider` + global pointer listeners |
| `components/horizontal-scroll.tsx` | Helper `scrollChildIntoView(selector)` |
| New: `components/ambient-sync-banner.tsx` | Optional Tier B chip |

---

## 8. UX details & motion

### Carousel rotation to playing album

- Use existing 600ms `cubic-bezier(0.34, 1.2, 0.64, 1)` transform — already feels on-brand
- If target album is more than half the ring away, rotate the **shortest path** (already handled by `rotateTo`)

### Cover crossfade

- Reuse rotator’s 700ms opacity transition
- When following, jump index without animating through intermediate covers if user wasn’t watching (Tier B catch-up)

### Scroll into view

- Use `block: 'nearest'` to avoid jarring full-page jumps
- Max one scroll action per track change

### “Following playback” indicator

- Subtle pulsing dot on hero or mini player context line
- Disappears on first interaction
- Copy: “Synced to what’s playing” — not “Autopilot” (too robotic for a family app)

---

## 9. Edge cases

| Case | Behavior |
|------|----------|
| Pause | Tier B stops; Tier A highlights remain |
| Queue ends, radio off | Exit ambient mode; resume normal carousel timers |
| Cousin Radio auto-advance | Tier A on each new song; carousel follows each artist change |
| Shuffle / repeat | Follow `currentSong`, not queue order display |
| User on `/now-playing` and skips | Queue list scrolls to new current (already partially there) |
| Listener age curation hides album | If playing song’s album not in curated carousel, don’t force rotate; highlight in shelf instead |
| Two tabs open | sessionStorage guard optional v2; v1: each tab independent |
| Reduced motion (`prefers-reduced-motion`) | Instant index set, no smooth scroll |

---

## 10. Phased implementation

| Phase | Scope | Effort | Risk |
|-------|-------|--------|------|
| **P0** | `useInteractionGuard` + home carousel follow on track change | 1–2 days | Low |
| **P1** | Cover rotator follow + pause competing timers | 0.5 day | Low |
| **P2** | Scroll-into-view on album/member/favorites lists | 1 day | Low |
| **P3** | Tier B idle sync (shelves scroll, banner) | 1 day | Medium |
| **P4** | `resolve-playback-visual` + smoke tests | 0.5 day | Low |
| **P5** | v2 soft route to `queueContext.href` / now-playing (20s idle) | 1 day | Medium — needs UX QA |

**Recommended first PR:** P0 + P1 + P4 — biggest perceived win on the home “money moment” with minimal navigation risk.

---

## 11. Acceptance criteria

### P0 — Home carousel live follow

- [ ] Start album A, wait for track 2 (or skip). Within 500ms (and when user idle ≥ 2s), carousel rotates to the album containing the new song.
- [ ] While user is swiping carousel, playback follow is suppressed for 2s.
- [ ] When paused, carousel auto-rotate resumes normal behavior after idle.

### P1 — Cover rotator

- [ ] Front cover shows the **playing** track’s artwork when following.
- [ ] Timer-based cover cycling pauses while following.

### P2 — List scroll

- [ ] On album page with 5+ tracks, auto-advance scrolls the playing row into view (nearest, smooth).
- [ ] Manual scroll resets guard; no fight for 2s.

### P3 — Ambient idle

- [ ] After 8s idle on home, featured shelf scrolls to current song if off-screen.
- [ ] Interaction anywhere clears ambient state within 100ms.

### Regression

- [ ] Existing smoke + carousel/album tests pass.
- [ ] Play/pause from hero still works on first tap (mobile gesture contract unchanged).

---

## 12. Analytics (optional)

Extend play events or add lightweight client events:

| Event | When |
|-------|------|
| `ambient_sync:live_follow` | Tier A carousel rotate |
| `ambient_sync:idle_enter` | Tier B activated |
| `ambient_sync:suppressed` | User interaction blocked sync |

Use to tune `IDLE_MS` — don’t ship analytics in P0.

---

## 13. Out of scope (v1)

- Cross-device sync of “ambient mode”
- Picture-in-picture / background tab sync
- Replacing page content with a full-screen screensaver
- Auto-navigating away from search, settings, or share sheets
- ML-based prediction of what user wants to see

---

## 14. Open questions for product

1. **Idle duration:** 8s vs 12s vs 15s — shorter feels responsive; longer feels less surprising. Recommend **8s** on mobile, **12s** on desktop (`matchMedia`).
2. **Auto-route (v2):** Should long idle ever change the URL, or is in-place sync enough? Recommend **in-place only for v1**; family users may leave app on `/family` intentionally.
3. **Now Playing as default sink:** When idle on unrelated page, is `/now-playing` the right destination vs the song’s album page? Recommend **`queueContext.href` first**, then `/now-playing`.
4. **Visual branding:** Should “following” state tint the hero with the playing album’s accent? Recommend **yes** — low-cost, high delight.

---

## 15. Summary

Cousin Radio already has strong playback intelligence (queue, radio, resume, context). The missing layer is **visual intelligence**: the app should behave like a living radio station where the room decor matches the song on the speakers — but only when nobody’s actively redecorating.

**Smallest high-impact patch:** interaction guard + pause carousel timers + rotate hero to `getAlbumForSong(currentSong)` on track change. That alone closes the gap described in `ALBUMS-SPEC.md` (“syncs with playback”) for the landing experience.
