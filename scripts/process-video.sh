#!/usr/bin/env bash
# Extract lightweight MP3 + cover JPG from a music video for the family jukebox.
# Usage: ./scripts/process-video.sh <author-slug> <input.mp4> <song-slug>
# Example: ./scripts/process-video.sh solene ../family-music-asset-june-19/Solene-8/Foxes_of_the_Garden.mp4 foxes-of-the-garden

set -euo pipefail

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <author-slug> <input.mp4> <song-slug>"
  echo "Example: $0 ocean ../family-music-asset-june-19/Ocean-10/Gravity_Shift.mp4 gravity-shift"
  echo ""
  echo "Author slugs: marceline, eliana, solene, ocean, tio-chien"
  exit 1
fi

AUTHOR="$1"
INPUT="$2"
SLUG="$3"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/public/assets/$AUTHOR"

mkdir -p "$OUT_DIR"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required. Install with: brew install ffmpeg"
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "Input file not found: $INPUT"
  exit 1
fi

echo "Author: $AUTHOR"
echo "Extracting cover from $INPUT ..."
ffmpeg -y -i "$INPUT" -ss 00:00:03 -vframes 1 -q:v 5 "$OUT_DIR/${SLUG}.jpg" 2>/dev/null

echo "Extracting audio (128k MP3) ..."
ffmpeg -y -i "$INPUT" -vn -acodec libmp3lame -b:a 128k -ar 44100 "$OUT_DIR/${SLUG}.mp3" 2>/dev/null

echo ""
echo "Done!"
echo "  Audio:  public/assets/$AUTHOR/${SLUG}.mp3"
echo "  Cover:  public/assets/$AUTHOR/${SLUG}.jpg"
echo ""
echo "Next:"
echo "  1. Add member in data/members.ts (if new person)"
echo "  2. Add song in data/songs.ts with authorSlug: \"$AUTHOR\""
echo "  3. Push to GitHub"
