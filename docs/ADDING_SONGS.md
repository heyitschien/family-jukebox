# Adding a New Song

**Full pipeline (recommended)** — extract, transcribe, catalog, series album, copyright, CI:

```bash
cd family-jukebox

npm run song:ship -- \
  --author tio-chien \
  --input ../family-music-asset-june-19/Tio-chien-11/printing-intelligent-on-sand/song.mp4 \
  --slug morning-sun-neon-light \
  --title "Morning Sun Neon Light" \
  --subtitle "Track three · Printing Intelligence on Sand" \
  --story "Third single from the series." \
  --tags single,indie,tio-chien,series,featured \
  --series miracle-in-the-sand-album \
  --featured \
  --push
```

**Manual steps** — extract + transcribe only, then edit files by hand:

```bash
./scripts/add-song.sh <author-slug> <path-to.mp4> <song-slug>
```

**Example — Tio Chien single:**

```bash
./scripts/add-song.sh tio-chien \
  ../family-music-asset-june-19/Tio-chien-11/Miracle-in-the-sand-모래_속의_기적.mp4 \
  miracle-in-the-sand
```

The script automatically:

1. Extracts **MP3 + cover JPG** → `public/assets/<author>/<song-slug>.*`
2. **Transcribes lyrics** (Whisper) → `data/lyrics.ts` + `scripts/transcripts.json`
3. Prints a **checklist** for the remaining edits

Then you:

1. Add the song block in **`data/songs.ts`** (include `lyrics: songLyrics["<song-slug>"]`)
2. If it's part of a **growing album series**, append the slug in **`data/albums.ts`** → `SERIES_ALBUM_DEFS`
3. Run **`npm run ci`**, commit, push → GitHub CI + Vercel deploy run automatically

---

## Checklist (every new song)

| Step | File / action |
|------|----------------|
| ✅ Assets | `./scripts/add-song.sh` (or `./scripts/process-video.sh` + transcribe) |
| ✅ Lyrics | Auto → `data/lyrics.ts` |
| ☐ Catalog | `data/songs.ts` — song entry with `lyrics: songLyrics["slug"]` |
| ☐ Series album | `data/albums.ts` — add slug to `SERIES_ALBUM_DEFS[].songSlugs` (or use `--series`; subtitle auto-updates) |
| ☐ **Copyright** | `npm run copyright:register -- --slug <slug>` → `data/copyright-registry.ts` |
| ☐ **Custom cover** (optional) | `npm run song:cover -- <author> <slug> <art.png>` — or `--cover` on `song:ship` |
| ☐ New person | `data/members.ts` (only for a new family member) |
| ☐ Ship | `npm run ci` → commit → `git push origin main` |

**Copyright & family rights:** [docs/COPYRIGHT-AND-OWNERSHIP.md](./COPYRIGHT-AND-OWNERSHIP.md) — every song gets a registry ID + SHA-256 fingerprint. CI fails if missing.

Lyrics appear on the song detail page under **Lyrics** (auto-transcribed, may not be word-perfect).

---

## Family members (author slugs)

| Slug | Name | Age | Role |
|------|------|-----|------|
| `marceline` | Marceline | 3 | our girls |
| `eliana` | Eliana | 6 | our girls |
| `solene` | Solene | 8 | our girls |
| `ocean` | Ocean | 10 | our guy |
| `tio-chien` | Tio Chien | 35 | Tio |
| `evelyn` | Evelyn | — | Family (wife) |

Edit bios in `data/members.ts` anytime.

---

## Manual steps (if you prefer)

### 1. Extract audio + cover from MP4

```bash
./scripts/process-video.sh <author-slug> <input.mp4> <song-slug>
```

Creates:

- `public/assets/<author>/<song-slug>.mp3`
- `public/assets/<author>/<song-slug>.jpg`

### 2. Transcribe lyrics

One-time setup:

```bash
python3 -m venv .venv-transcribe
. .venv-transcribe/bin/activate
pip install faster-whisper
```

Transcribe one song (after it's in `data/songs.ts`):

```bash
. .venv-transcribe/bin/activate
python3 scripts/transcribe-songs.py --slug your-song-slug
```

Transcribe **all** songs (refresh full catalog):

```bash
python3 scripts/transcribe-songs.py
```

Transcribe only **missing** lyrics:

```bash
python3 scripts/transcribe-songs.py --missing-only
```

### 3. Add song to catalog

```ts
{
  slug: "miracle-in-the-sand",
  title: "Miracle in the Sand",
  subtitle: "모래 속의 기적 · the first single from an ongoing album",
  authorSlug: "tio-chien",
  dateCreated: "2026-06-21",
  audioSrc: "/assets/tio-chien/miracle-in-the-sand.mp3",
  coverSrc: "/assets/tio-chien/miracle-in-the-sand.jpg",
  story: "How this song was made.",
  lyrics: songLyrics["miracle-in-the-sand"],
  tags: ["single", "indie", "tio-chien"],
},
```

Import at top of `data/songs.ts` (already there):

```ts
import { songLyrics } from "@/data/lyrics";
```

### 4. Growing album series (optional)

For albums that gain tracks over time (singles rollout), edit **`SERIES_ALBUM_DEFS`** in `data/albums.ts`:

```ts
songSlugs: ["miracle-in-the-sand", "next-single-slug"],
```

Creator albums (`tio-chien-album`, etc.) auto-include all songs by that person.

---

## Asset folders

```txt
public/assets/marceline/
public/assets/eliana/
public/assets/solene/
public/assets/ocean/
public/assets/tio-chien/
public/assets/evelyn/
```

Keep **MP3 + JPG only** in git — source MP4s stay in `family-music-asset-june-19/`.

---

## New family member (rare)

```ts
{
  slug: "new-name",
  name: "New Name",
  age: 7,
  role: "girl", // or "boy" or "tio"
  emoji: "🎵",
  description: "A short warm bio for the family page.",
},
```

---

## CI / deploy

After push to `main`:

- **CI** — lint, smoke, build
- **CD** — verifies [cousinradio.com](https://cousinradio.com)

See `docs/CI-CD.md`.

---

## Tips

- **Search** — titles, tags, artist names, ages
- **Album pages** — `/albums/<slug>` auto-generated from `data/albums.ts`
- **Re-transcribe** — re-run `transcribe-songs.py --slug …` anytime; overwrites that entry in `lyrics.ts`
