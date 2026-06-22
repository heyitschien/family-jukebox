# Cousin Radio

A warm, playful family music archive — songs by Marceline, Eliana, Solene, Ocean, and Tio Chien. Static song catalog in the repo; optional Neon analytics for play counts. See `docs/SECURITY-AND-ANALYTICS.md`.

## Run locally

```bash
cd family-jukebox
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Family members

| Person | Age | Role |
|--------|-----|------|
| Marceline | 3 | our girls |
| Eliana | 6 | our girls |
| Solene | 8 | our girls |
| Ocean | 10 | our guy |
| Tio Chien | 35 | Tio |

Bios and ages live in `data/members.ts`. Each person has a page at `/members/[slug]`.

## How to add a new song

```bash
./scripts/add-song.sh <author-slug> <video.mp4> <song-slug>
```

Extracts MP3 + cover, transcribes lyrics, then follow the printed checklist (`data/songs.ts`, optional series album). Push to `main` → CI + Vercel deploy automatically.

See [docs/ADDING_SONGS.md](./docs/ADDING_SONGS.md) for the full checklist and examples.

## Project record

Architecture, features, design principles, and work history (validated against code): [docs/PROJECT-RECORD.md](./docs/PROJECT-RECORD.md).

## Analytics (Neon)

Play tracking uses Neon Postgres. Local setup:

```bash
cp .env.example .env.local   # add DATABASE_URL from Neon
./scripts/setup-neon.sh      # sync secrets to Vercel + verify schema
```

See [docs/SECURITY-AND-ANALYTICS.md](./docs/SECURITY-AND-ANALYTICS.md).

## Compress from a music video (MP4)

```bash
./scripts/process-video.sh ocean ../family-music-asset-june-19/Ocean-10/Gravity_Shift.mp4 gravity-shift
```

Creates `public/assets/ocean/gravity-shift.mp3` and `.jpg`. Cover is extracted from the video automatically.

## File size warning

Keep files small. GitHub max is **100 MB** per file. Audio + cover only in the repo — skip big videos.

## Deploy

**Production:** [cousinradio.com](https://cousinradio.com) (`main` branch)  
**Staging:** [staging.cousinradio.com](https://staging.cousinradio.com) (`staging` branch)

Domains, branches, and agent rules: [docs/DOMAINS-AND-ENVIRONMENTS.md](./docs/DOMAINS-AND-ENVIRONMENTS.md).

## Tech stack

Next.js · TypeScript · Tailwind · shadcn/ui · local assets in `/public`
