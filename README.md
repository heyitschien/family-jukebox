# Family Jukebox

A warm, playful family music archive — songs made together with kids, cousins, and family. No backend, no database, no auth. Just add files to the repo and push.

## Run locally

```bash
cd family-jukebox
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to add a new song

1. Add audio file to `public/assets/songs/`
2. Add cover image to `public/assets/covers/`
3. Optional: add video to `public/assets/videos/` (keep it small)
4. Add a new object to `data/songs.ts`
5. Commit and push to GitHub
6. Vercel redeploys automatically

### Asset folders

```txt
public/assets/songs/   -> .mp3 or .m4a files
public/assets/covers/  -> .jpg, .png cover images
public/assets/videos/  -> optional .mp4 videos
data/songs.ts          -> song metadata
```

### Naming convention

Use lowercase filenames with dashes instead of spaces:

```txt
dinosaur-kitchen-dance.mp3
dinosaur-kitchen-dance.jpg
```

See [docs/ADDING_SONGS.md](./docs/ADDING_SONGS.md) for a copy-paste example.

## Compress from a music video (MP4)

If you start with an MP4, **do not commit the raw video** unless it is tiny. Extract audio + cover instead:

```bash
./scripts/process-video.sh path/to/your-song.mp4 song-slug-name
```

This creates:

- `public/assets/songs/song-slug-name.mp3` (128 kbps — good for web)
- `public/assets/covers/song-slug-name.jpg` (frame from the video)

You do **not** need to send a separate image — the cover is pulled from the video automatically.

## File size warning

Keep files small. GitHub does not allow files over **100 MB**. For larger videos, use unlisted YouTube, Google Drive, Cloudflare R2, or Supabase Storage later.

**Recommended for the repo:**

- Audio: MP3 at 128 kbps (~2–4 MB per song)
- Covers: JPG under ~300 KB
- Videos: skip for V1, or keep under ~10 MB

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repo
4. Deploy (no env vars needed)

Every push to `main` redeploys the site.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Local assets in `/public`
