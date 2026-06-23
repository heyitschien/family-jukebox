#!/usr/bin/env bash
# Install official cover art for a shipped song (PNG/JPG → 1024 JPG).
# Usage: ./scripts/install-cover.sh <author-slug> <song-slug> <cover.png|jpg>
#
# Example:
#   ./scripts/install-cover.sh tio-chien the-future-in-my-palm ../assets/sand-to-signal.png
#   npm run copyright:register -- --slug the-future-in-my-palm

set -euo pipefail

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <author-slug> <song-slug> <cover-image>"
  exit 1
fi

AUTHOR="$1"
SLUG="$2"
INPUT="$3"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/assets/$AUTHOR/${SLUG}.jpg"

if [ ! -f "$INPUT" ]; then
  echo "Cover image not found: $INPUT"
  exit 1
fi

mkdir -p "$(dirname "$OUT")"
sips -s format jpeg -s formatOptions 88 -Z 1024 "$INPUT" --out "$OUT" >/dev/null

echo "Installed cover → public/assets/$AUTHOR/${SLUG}.jpg"
echo "Next: npm run copyright:register -- --slug $SLUG"
