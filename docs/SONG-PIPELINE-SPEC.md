# Song shipping pipeline — spec & hardening plan

> How Cousin Radio adds songs today, what is intentionally manual, and the small upgrades that keep the system robust without over-building.

**Commands:** `npm run song:ship` · `docs/ADDING_SONGS.md` · `docs/COPYRIGHT-AND-OWNERSHIP.md`

---

## Goals

1. **One command** ships a song for an existing author + existing growing album.
2. **CI must pass** before deploy — lint, smoke, copyright fingerprints, build, production browser smoke.
3. **No silent gaps** — copyright registry, playable assets, album assignment.
4. **Do not break what works** — cover art from video frame extract stays as-is (Gemini output → MP4 → ffmpeg cover).

---

## Pipeline today (happy path)

```
MP4 (family-music-asset-june-19/)
  → process-video.sh     MP3 + JPG cover (frame @ 3s)
  → transcribe-songs.py  lyrics → data/lyrics.ts
  → data/songs.ts        catalog entry
  → data/albums.ts       append to SERIES_ALBUM_DEFS[].songSlugs + refresh subtitle
  → copyright:register   SHA-256 → data/copyright-registry.ts
  → npm run ci           full gate
  → git push main        Deploy workflow → cousinradio.com
```

**Entry point:**

```bash
npm run song:ship -- \
  --author tio-chien \
  --input ../path/to/song.mp4 \
  --slug the-future-in-my-palm \
  --title "The Future in My Palm" \
  --subtitle "Track five · Printing Intelligence on Sand" \
  --story "..." \
  --tags single,indie,tio-chien,series,featured \
  --series miracle-in-the-sand-album \
  --featured \
  --push
```

---

## What is automated (do not regress)

| Step | Owner |
|------|--------|
| Audio + cover extract | `scripts/process-video.sh` |
| Lyrics transcription | `scripts/transcribe-songs.py` |
| Catalog insert | `scripts/ship-song.ts` |
| Series album track append | `scripts/ship-song.ts` |
| Series album subtitle refresh | `lib/series-album-subtitle.ts` + `ship-song.ts` |
| Copyright fingerprint | `scripts/register-copyright.ts` |
| CI gate | `npm run ci` |
| Deploy | GitHub `Deploy` workflow on `main` |

---

## What stays manual (by design, for now)

| Situation | You edit |
|-----------|----------|
| New family member | `data/members.ts` + album accent in `data/albums.ts` |
| New growing album series | `SERIES_ALBUM_DEFS` block in `data/albums.ts` |
| Song about multiple people | `SUBJECT_MEMBER_OVERRIDES` in `lib/copyright-constants.ts` |
| 10-track album songbook prompts | `docs/printing-intelligence-on-sand-kpop-album.md` |
| Official cover art (when not from video) | Replace JPG manually, then `copyright:register --slug …` |

**Not planned:** custom cover flags in `song:ship` — current Gemini → MP4 → ffmpeg cover path works well.

---

## Hardening done (fragility fixes)

### 1. Album subtitle auto-update

When `--series` is set, `song:ship` rebuilds the album `subtitle` from shipped track **titles** in order:

`Miracle in the Sand · Tap on the Glass · … · more coming`

Implemented in `lib/series-album-subtitle.ts`.

### 2. Smoke tests derive from catalog data

Album tracklist tests no longer hard-code every slug. They verify:

- No duplicate slugs on the album
- Every slug resolves to a song on that album
- Author matches (e.g. `tio-chien` for Printing Intelligence on Sand)
- Anchor track order (track 1 stays `miracle-in-the-sand`)

New tracks do **not** require smoke test edits.

### 3. `--push` stages all ship artifacts

Commit includes assets, `songs.ts`, `albums.ts`, `lyrics.ts`, `copyright-registry.ts`, `transcripts.json`.

---

## CI / CD map

| Workflow | When | What |
|----------|------|------|
| **CI** | push / PR | lint, smoke, copyright verify, build, production smoke |
| **Copyright Registry** | push `main` | `copyright:verify` |
| **Deploy** | push `main` | Vercel production |
| **CD** | after Deploy | curl + homepage checks |

---

## Copyright tracking (summary)

Every song in `data/songs.ts` must exist in `data/copyright-registry.ts`:

- `registryId` — `CR-2026-<slug>`
- `audioSha256` / `coverSha256` — file integrity
- `subjectMemberSlugs` — who the song is about
- AI disclosure — Google Gemini

`npm run copyright:verify` fails CI if any song is missing or hashes are stale.

Full policy: `docs/COPYRIGHT-AND-OWNERSHIP.md`

---

## Future upgrades (only if pain returns)

Priority order — **do not build until needed:**

1. **`song.manifest.json`** next to source MP4 (author, slug, title, series, track #) — reduces CLI flags
2. **`--track N --songbook docs/…`** — pre-fill title/subtitle from album songbook
3. **`--new-series`** scaffold — new `SERIES_ALBUM_DEFS` entry
4. **`--new-member`** scaffold — `members.ts` + asset folder

---

## Adding track N to Printing Intelligence on Sand

| Field | Value |
|-------|--------|
| Album slug | `miracle-in-the-sand-album` |
| Author | `tio-chien` |
| Songbook | `docs/printing-intelligence-on-sand-kpop-album.md` |
| Asset folder | `family-music-asset-june-19/Tio-chien-11/printing-intelligent-on-sand/` |

After ship, verify:

- `/albums/miracle-in-the-sand-album` lists the new track
- `/songs/<slug>` plays and shows copyright notice
- Share link shows cover art (og:image)
