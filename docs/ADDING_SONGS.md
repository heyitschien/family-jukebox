# Adding a New Song

This is the simple workflow for the family jukebox. No uploads, no admin panel — just files + one data entry.

## Quick steps

1. **Audio** — drop your `.mp3` into `public/assets/songs/`
2. **Cover** — drop your `.jpg` into `public/assets/covers/`
3. **Optional video** — only if small; put in `public/assets/videos/`
4. **Metadata** — add an entry in `data/songs.ts`
5. **Push** — commit and push to GitHub; Vercel updates the site

## Starting from an MP4?

Run this from the project root (requires [ffmpeg](https://ffmpeg.org/)):

```bash
./scripts/process-video.sh ../family-music-asset-june-19/My_Song.mp4 my-song-slug
```

That extracts:

- MP3 audio (light, Spotify-style playback)
- JPG cover art (from ~3 seconds into the video)

You do **not** need to send a separate image file.

## Naming convention

Use lowercase filenames. Use dashes instead of spaces.

```txt
dinosaur-kitchen-dance.mp3
dinosaur-kitchen-dance.jpg
dinosaur-kitchen-dance.mp4   (optional)
```

The `slug` in `data/songs.ts` should match the filename (without extension).

## Copy-paste example

Add this to the `songs` array in `data/songs.ts`:

```ts
{
  slug: "dinosaur-kitchen-dance",
  title: "Dinosaur Kitchen Dance",
  subtitle: "A silly cousin song from our family music day",
  people: ["Ocean", "Euro", "Cousins"],
  dateCreated: "2026-06-19",
  audioSrc: "/assets/songs/dinosaur-kitchen-dance.mp3",
  coverSrc: "/assets/covers/dinosaur-kitchen-dance.jpg",
  // videoSrc: "/assets/videos/dinosaur-kitchen-dance.mp4",  // optional — skip for lighter repo
  prompt: "Make a silly song about cousins turning into dinosaurs and dancing in the kitchen.",
  story: "Made during a family hangout after we created games and music together using Gemini.",
  lyrics: "",
  tags: ["silly", "cousins", "dance", "dinosaur"],
  featured: false,
},
```

## Tips

- **Featured song** — set `featured: true` on one song to highlight it on the homepage
- **Tags** — use tags you might search later (`cousins`, `silly`, `Solane`, etc.)
- **Keep it light** — audio + cover is enough for a Spotify-like family player
- **Big videos** — host on YouTube (unlisted) and add the link in `story` for now

## File size limits

- GitHub: **100 MB max per file**
- Aim for MP3s around 2–4 MB and covers under 300 KB
