#!/usr/bin/env bash
# Add a new song to Family Jukebox — extract assets, transcribe lyrics, print checklist.
#
# For the full automated pipeline (catalog + album + copyright + CI), use:
#   npm run song:ship -- --author ... --input ... --slug ... --title "..." [--series album-slug] [--featured] [--push]
#
# Usage:
#   ./scripts/add-song.sh <author-slug> <input.mp4> <song-slug>
#
# Example:
#   ./scripts/add-song.sh tio-chien \
#     ../family-music-asset-june-19/Tio-chien-11/Miracle-in-the-sand-모래_속의_기적.mp4 \
#     miracle-in-the-sand

set -euo pipefail

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <author-slug> <input.mp4> <song-slug>"
  echo ""
  echo "Author slugs: marceline, eliana, solene, ocean, tio-chien, evelyn, sam-and-josh"
  exit 1
fi

AUTHOR="$1"
INPUT="$2"
SLUG="$3"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/.venv-transcribe"
MP3="public/assets/$AUTHOR/${SLUG}.mp3"

cd "$ROOT"

echo "==> 1/3 Extract MP3 + cover"
"$(dirname "$0")/process-video.sh" "$AUTHOR" "$INPUT" "$SLUG"

echo ""
echo "==> 2/3 Transcribe lyrics (Whisper)"
if [ ! -d "$VENV" ]; then
  echo "Creating transcription venv (one-time)..."
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q faster-whisper
fi

if grep -q "slug: \"$SLUG\"" data/songs.ts 2>/dev/null; then
  "$VENV/bin/python3" scripts/transcribe-songs.py --slug "$SLUG"
else
  "$VENV/bin/python3" scripts/transcribe-songs.py --slug "$SLUG" --audio "$SLUG" "$MP3"
fi

echo ""
echo "==> 3/4 Copyright registry (after you add data/songs.ts entry)"
echo "    npm run copyright:register -- --slug $SLUG"
echo ""
echo "==> 4/4 Checklist — finish these, then push"
echo ""
cat <<EOF
[ ] data/songs.ts — add song entry (include lyrics: songLyrics["$SLUG"])
[ ] data/albums.ts — if part of a growing series, append "$SLUG" to SERIES_ALBUM_DEFS songSlugs
[ ] npm run copyright:register -- --slug $SLUG
[ ] npm run ci
[ ] git add public/assets/$AUTHOR/${SLUG}.* data/songs.ts data/lyrics.ts data/copyright-registry.ts scripts/transcripts.json
[ ] git commit && git push origin main  (CI + Vercel deploy automatically)

Copy-paste starter for data/songs.ts:

  {
    slug: "$SLUG",
    title: "Your Song Title",
    subtitle: "Short tagline",
    authorSlug: "$AUTHOR",
    dateCreated: "$(date +%Y-%m-%d)",
    audioSrc: "/assets/$AUTHOR/${SLUG}.mp3",
    coverSrc: "/assets/$AUTHOR/${SLUG}.jpg",
    story: "How this song was made.",
    lyrics: songLyrics["$SLUG"],
    tags: ["$AUTHOR"],
  },

Assets ready:
  public/assets/$AUTHOR/${SLUG}.mp3
  public/assets/$AUTHOR/${SLUG}.jpg

Lyrics: data/lyrics.ts → songLyrics["$SLUG"]
Copyright: npm run copyright:register -- --slug $SLUG → data/copyright-registry.ts
Full guides: docs/ADDING_SONGS.md · docs/COPYRIGHT-AND-OWNERSHIP.md
EOF
