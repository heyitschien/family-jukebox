#!/usr/bin/env bash
# Sync Neon + Vercel env vars from .env.local (run after scripts/setup-neon.sh bootstrap or manual .env.local edit)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE — copy .env.example and add DATABASE_URL from Neon."
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is empty in $ENV_FILE"
  exit 1
fi

TRACKING="${PLAY_TRACKING_ENABLED:-true}"

echo "==> Pushing env to Vercel (production, preview, development)"
if command -v vercel >/dev/null 2>&1; then
  cd "$ROOT"
  printf '%s' "$DATABASE_URL" | npx vercel@latest env add DATABASE_URL production --force 2>/dev/null || \
    printf '%s' "$DATABASE_URL" | npx vercel@latest env add DATABASE_URL production
  printf '%s' "$DATABASE_URL" | npx vercel@latest env add DATABASE_URL preview --force 2>/dev/null || \
    printf '%s' "$DATABASE_URL" | npx vercel@latest env add DATABASE_URL preview
  printf '%s' "$DATABASE_URL" | npx vercel@latest env add DATABASE_URL development --force 2>/dev/null || \
    printf '%s' "$DATABASE_URL" | npx vercel@latest env add DATABASE_URL development

  printf '%s' "$TRACKING" | npx vercel@latest env add PLAY_TRACKING_ENABLED production --force 2>/dev/null || \
    printf '%s' "$TRACKING" | npx vercel@latest env add PLAY_TRACKING_ENABLED production
  printf '%s' "$TRACKING" | npx vercel@latest env add PLAY_TRACKING_ENABLED preview --force 2>/dev/null || \
    printf '%s' "$TRACKING" | npx vercel@latest env add PLAY_TRACKING_ENABLED preview
  printf '%s' "$TRACKING" | npx vercel@latest env add PLAY_TRACKING_ENABLED development --force 2>/dev/null || \
    printf '%s' "$TRACKING" | npx vercel@latest env add PLAY_TRACKING_ENABLED development

  echo "Vercel env updated. Redeploy production to pick up secrets:"
  echo "  npx vercel@latest deploy --prod"
else
  echo "Vercel CLI not found — set DATABASE_URL and PLAY_TRACKING_ENABLED manually in Vercel dashboard."
fi

echo ""
echo "==> Verify local DB"
cd "$ROOT"
npm run db:push

echo ""
echo "Done. Local: .env.local | Neon console: https://console.neon.tech/app/projects/cold-snow-21143676"
