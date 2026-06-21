# Adding a New Song

Simple workflow — files + two data entries (member + song).

## Quick steps

1. Put the source MP4 in `family-music-asset-june-19/<Name-Age>/` (or anywhere local)
2. Run the process script with **author slug** + **song slug**
3. Add or update the person in `data/members.ts` (if new)
4. Add the song in `data/songs.ts` with matching `authorSlug`
5. Push to GitHub → Vercel updates

## Family members (author slugs)

| Slug | Name | Age | Role |
|------|------|-----|------|
| `marceline` | Marceline | 3 | our girls |
| `eliana` | Eliana | 6 | our girls |
| `solene` | Solene | 8 | our girls |
| `ocean` | Ocean | 10 | our guy |
| `tio-chien` | Tio Chien | 35 | Tio |

Edit bios in `data/members.ts` anytime.

## Starting from an MP4

```bash
./scripts/process-video.sh solene ../family-music-asset-june-19/Solene-8/Foxes_of_the_Garden.mp4 foxes-of-the-garden
```

Creates:

- `public/assets/solene/foxes-of-the-garden.mp3`
- `public/assets/solene/foxes-of-the-garden.jpg`

Cover art is pulled from the video — no separate image needed.

## Asset folders (by author)

```txt
public/assets/marceline/
public/assets/eliana/
public/assets/solene/
public/assets/ocean/
public/assets/tio-chien/
```

Each folder holds that person's `.mp3` and `.jpg` files.

## Copy-paste song example

```ts
{
  slug: "foxes-of-the-garden",
  title: "Foxes of the Garden",
  subtitle: "Sneaky foxes and secret garden adventures",
  authorSlug: "solene",
  dateCreated: "2026-06-19",
  audioSrc: "/assets/solene/foxes-of-the-garden.mp3",
  coverSrc: "/assets/solene/foxes-of-the-garden.jpg",
  story: "Made during family music day with Gemini.",
  tags: ["animals", "garden", "solene"],
  featured: false,
},
```

## Copy-paste member example

Only needed for a **new** family member:

```ts
{
  slug: "new-name",
  name: "New Name",
  age: 7,
  role: "girl", // or "boy" or "tio"
  emoji: "🎵",
  description: "A short warm bio for the family page.",
},
```

## Tips

- **Search** — site searches by name, age (`6`, `age 6`), tags, and titles
- **Member page** — each person gets `/members/[slug]` automatically
- **Keep it light** — audio + cover only in the repo; skip big videos
