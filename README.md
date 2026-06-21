# Family Jukebox

A warm, playful family music archive — songs by Marceline, Eliana, Solene, Ocean, and Tio Chien. No backend, no database, no auth. Just add files to the repo and push.

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

1. Put source MP4 in `family-music-asset-june-19/<Name-Age>/` (local, not committed)
2. Run `./scripts/process-video.sh <author> <video.mp4> <song-slug>`
3. Add song to `data/songs.ts` with `authorSlug`
4. Push to GitHub → Vercel redeploys

### Asset folders (by author)

```txt
public/assets/marceline/
public/assets/eliana/
public/assets/solene/
public/assets/ocean/
public/assets/tio-chien/
data/members.ts    -> family bios, ages, roles
data/songs.ts      -> song metadata + authorSlug
```

See [docs/ADDING_SONGS.md](./docs/ADDING_SONGS.md) for copy-paste examples.

## Compress from a music video (MP4)

```bash
./scripts/process-video.sh ocean ../family-music-asset-june-19/Ocean-10/Gravity_Shift.mp4 gravity-shift
```

Creates `public/assets/ocean/gravity-shift.mp3` and `.jpg`. Cover is extracted from the video automatically.

## File size warning

Keep files small. GitHub max is **100 MB** per file. Audio + cover only in the repo — skip big videos.

## Deploy to Vercel

Live at [family-jukebox.vercel.app](https://family-jukebox.vercel.app). Push to `main` on GitHub to redeploy.

## Tech stack

Next.js · TypeScript · Tailwind · shadcn/ui · local assets in `/public`
