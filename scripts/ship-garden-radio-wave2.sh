#!/usr/bin/env bash
# Garden Radio Wave 2 — ships remaining fruit + vegetable tracks.
# Usage: ./scripts/ship-garden-radio-wave2.sh [--push]
# Suggested run date: 2026-06-28 (see docs/garden-radio-release.md)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSET_ROOT="$ROOT/../family-music-asset-june-19/garden-radio"
BRANCH="feat/garden-radio-wave-2"
PUSH=false

if [[ "${1:-}" == "--push" ]]; then
  PUSH=true
fi

cd "$ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree not clean. Commit or stash changes first."
  exit 1
fi

git fetch origin
git checkout main
git pull origin main
git checkout -B "$BRANCH"

ship() {
  local input="$1"
  local slug="$2"
  local title="$3"
  local subtitle="$4"
  local story="$5"
  local series="$6"
  local tags="$7"

  npm run song:ship -- \
    --author tio-chien \
    --input "$input" \
    --slug "$slug" \
    --title "$title" \
    --subtitle "$subtitle" \
    --story "$story" \
    --tags "$tags" \
    --series "$series" \
    --skip-ci
}

echo "==> Garden Radio Wave 2 — 9 tracks"

ship "$ASSET_ROOT/vegetables/Bocado_de_Sol.mp4" \
  bocado-de-sol "Bocado de Sol" \
  "Track five · Garden Radio: Vegetable Grooves" \
  "A bite of sunlight — bilingual joy from the vegetable aisle." \
  vegetable-grooves-album \
  "garden-radio,vegetable,kids,earth,bilingual,family-friendly,tio-chien"

ship "$ASSET_ROOT/vegetables/Gather_At_The_Gate.mp4" \
  gather-at-the-gate "Gather at the Gate" \
  "Track six · Garden Radio: Vegetable Grooves" \
  "Everyone meets at the garden gate — community, soil, and shared harvest." \
  vegetable-grooves-album \
  "garden-radio,vegetable,kids,earth,bilingual,family-friendly,tio-chien"

ship "$ASSET_ROOT/vegetables/King_of_the_School.mp4" \
  king-of-the-school "King of the School" \
  "Track seven · Garden Radio: Vegetable Grooves" \
  "Vegetable royalty in the lunch line — playful power and kid energy." \
  vegetable-grooves-album \
  "garden-radio,vegetable,kids,earth,bilingual,family-friendly,tio-chien"

ship "$ASSET_ROOT/vegetables/Piquete_de_colores.mp4" \
  piquete-de-colores "Piquete de Colores" \
  "Track eight · Garden Radio: Vegetable Grooves" \
  "A burst of color from the produce section — bilingual celebration." \
  vegetable-grooves-album \
  "garden-radio,vegetable,kids,earth,bilingual,family-friendly,tio-chien"

ship "$ASSET_ROOT/vegetables/Turning_Silver_Dreams.mp4" \
  turning-silver-dreams "Turning Silver Dreams" \
  "Track nine · Garden Radio: Vegetable Grooves" \
  "Moonlight on the garden rows — dreamy vegetables and quiet wonder." \
  vegetable-grooves-album \
  "garden-radio,vegetable,kids,earth,bilingual,family-friendly,tio-chien"

ship "$ASSET_ROOT/fruits/Dorado_Heart.mp4" \
  dorado-heart "Dorado Heart" \
  "Track three · Garden Radio: Fruit Frequency" \
  "Golden fruit, warm heart — sunshine you can hold in your hand." \
  fruit-frequency-album \
  "garden-radio,fruit,kids,earth,bilingual,family-friendly,tio-chien"

ship "$ASSET_ROOT/fruits/Gold_In_My_Hand.mp4" \
  gold-in-my-hand "Gold in My Hand" \
  "Track four · Garden Radio: Fruit Frequency" \
  "Treasure from the orchard — small hands, big golden moments." \
  fruit-frequency-album \
  "garden-radio,fruit,kids,earth,bilingual,family-friendly,tio-chien"

ship "$ASSET_ROOT/fruits/One_Snap_And_A_Bite.mp4" \
  one-snap-and-a-bite "One Snap and a Bite" \
  "Track five · Garden Radio: Fruit Frequency" \
  "Crisp fruit energy — one snap, one bite, pure summer joy." \
  fruit-frequency-album \
  "garden-radio,fruit,kids,earth,bilingual,family-friendly,tio-chien"

ship "$ASSET_ROOT/fruits/Peel_Back_the_Sun.mp4" \
  peel-back-the-sun "Peel Back the Sun" \
  "Track six · Garden Radio: Fruit Frequency" \
  "Peel back the rind and let the sunlight in — bright fruit anthem." \
  fruit-frequency-album \
  "garden-radio,fruit,kids,earth,bilingual,family-friendly,tio-chien"

echo "==> Running CI"
npm run ci

git add public/assets/tio-chien/*.mp3 public/assets/tio-chien/*.jpg \
  data/songs.ts data/albums.ts data/lyrics.ts data/copyright-registry.ts scripts/transcripts.json

git commit -m "$(cat <<'EOF'
Ship Garden Radio wave 2 — complete Fruit Frequency and Vegetable Grooves.

Nine remaining produce tracks from garden-radio assets.
EOF
)"

if [[ "$PUSH" == true ]]; then
  git push -u origin HEAD
  echo ""
  echo "Branch pushed. Open PR:"
  echo "  gh pr create --title \"Garden Radio wave 2 — complete produce albums\" --base main"
else
  echo ""
  echo "Committed locally on $BRANCH."
  echo "Push and open PR:"
  echo "  git push -u origin HEAD"
  echo "  gh pr create --title \"Garden Radio wave 2 — complete produce albums\" --base main"
fi
