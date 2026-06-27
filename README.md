# Cousin Radio

**Family Jukebox** — a warm family music archive and radio station at [cousinradio.com](https://cousinradio.com).

Songs by cousins, tias, tios, Mama, and more. Static catalog in git; global player; growing album series; optional Neon play analytics.

## Run locally

```bash
cd family-jukebox
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs & direction

| Doc | Purpose |
|-----|---------|
| [docs/TRACKS.md](./docs/TRACKS.md) | **GitHub issues ↔ specs ↔ status** — start here for what to build next |
| [docs/COUSIN-RADIO-DIRECTION.md](./docs/COUSIN-RADIO-DIRECTION.md) | North star — mission, design principles, creative pipeline |
| [docs/cousin-radio-family-creation/](./docs/cousin-radio-family-creation/) | Private-first platform vision (28-doc set) |
| [docs/PROJECT-RECORD.md](./docs/PROJECT-RECORD.md) | Architecture + catalog snapshot (code-validated) |
| [docs/README.md](./docs/README.md) | Full doc index |

**Open issues:** [github.com/heyitschien/family-jukebox/issues](https://github.com/heyitschien/family-jukebox/issues)

## Ship a song

```bash
npm run song:ship -- \
  --author <slug> --input <video.mp4> --slug <song-slug> --title "Title" \
  [--series album-slug] [--push]
```

See [docs/ADDING_SONGS.md](./docs/ADDING_SONGS.md) for the full checklist.

## Deploy

**Production:** [cousinradio.com](https://cousinradio.com) (`main` branch)  
**Staging:** [staging.cousinradio.com](https://staging.cousinradio.com) (`staging` branch)

Push to `main` → CI → Vercel deploy automatically. See [docs/CI-CD.md](./docs/CI-CD.md).

## Analytics (Neon)

```bash
cp .env.example .env.local   # add DATABASE_URL from Neon
./scripts/setup-neon.sh
```

See [docs/SECURITY-AND-ANALYTICS.md](./docs/SECURITY-AND-ANALYTICS.md).

## Tech stack

Next.js · TypeScript · Tailwind · shadcn/ui · local assets in `/public`
