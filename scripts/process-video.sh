#!/usr/bin/env bash
# Extract lightweight MP3 + cover JPG from a music video for the family jukebox.
# Usage: ./scripts/process-video.sh input.mp4 song-slug

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <input.mp4> <song-slug>"
  echo "Example: $0 ../my-video.mp4 dinosaur-kitchen-dance"
  exit 1
fi

INPUT="$1"
SLUG="$2"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SONGS_DIR="$ROOT/public/assets/songs"
COVERS_DIR="$ROOT/public/assets/covers"

mkdir -p "$SONGS_DIR" "$COVERS_DIR"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required. Install with: brew install ffmpeg"
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "Input file not found: $INPUT"
  exit 1
fi

echo "Extracting cover from $INPUT ..."
ffmpeg -y -i "$INPUT" -ss 00:00:03 -vframes 1 -q:v 5 "$COVERS_DIR/${SLUG}.jpg" 2>/dev/null

echo "Extracting audio (128k MP3) ..."
ffmpeg -y -i "$INPUT" -vn -acodec libmp3lame -b:a 128k -ar 44100 "$SONGS_DIR/${SLUG}.mp3" 2>/dev/null

echo ""
echo "Done!"
echo "  Audio:  public/assets/songs/${SLUG}.mp3"
echo "  Cover:  public/assets/covers/${SLUG}.jpg"
echo ""
echo "Next: add an entry to data/songs.ts and push to GitHub."
