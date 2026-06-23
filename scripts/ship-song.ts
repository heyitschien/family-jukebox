#!/usr/bin/env tsx
/**
 * End-to-end new song pipeline: extract → transcribe → catalog → series album → copyright → CI.
 *
 * Usage:
 *   npm run song:ship -- \
 *     --author tio-chien \
 *     --input ../family-music-asset-june-19/.../song.mp4 \
 *     --slug morning-sun-neon-light \
 *     --title "Morning Sun Neon Light" \
 *     --subtitle "심장을 잊지 마 · track three · Printing Intelligence on Sand" \
 *     --story "Third single from Printing Intelligence on Sand." \
 *     --tags single,indie,tio-chien,series,featured \
 *     --series miracle-in-the-sand-album \
 *     --featured
 *
 * Omit --series when the song belongs only to the artist discography.
 * Add --push to commit and push after CI passes (requires clean metadata args).
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type ShipArgs = {
  author: string;
  input: string;
  slug: string;
  title: string;
  subtitle: string;
  story: string;
  tags: string[];
  series?: string;
  featured: boolean;
  push: boolean;
  skipCi: boolean;
};

function parseArgs(argv: string[]): ShipArgs {
  const get = (flag: string): string | undefined => {
    const index = argv.indexOf(flag);
    return index >= 0 ? argv[index + 1] : undefined;
  };

  const author = get("--author");
  const input = get("--input");
  const slug = get("--slug");
  const title = get("--title");
  const subtitle = get("--subtitle") ?? "";
  const story = get("--story") ?? "";
  const tags = (get("--tags") ?? author ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const series = get("--series");

  if (!author || !input || !slug || !title) {
    console.error(`Usage: npm run song:ship -- \\
  --author <slug> --input <path.mp4> --slug <song-slug> --title "Title" \\
  [--subtitle "..."] [--story "..."] [--tags a,b,c] [--series album-slug] [--featured] [--push] [--skip-ci]`);
    process.exit(1);
  }

  return {
    author,
    input: path.resolve(input),
    slug,
    title,
    subtitle,
    story,
    tags,
    series,
    featured: argv.includes("--featured"),
    push: argv.includes("--push"),
    skipCi: argv.includes("--skip-ci"),
  };
}

function run(command: string, label: string): void {
  console.log(`\n==> ${label}`);
  execSync(command, { stdio: "inherit", cwd: process.cwd() });
}

function insertSongEntry(args: ShipArgs): void {
  const songsPath = path.join(process.cwd(), "data/songs.ts");
  const contents = readFileSync(songsPath, "utf8");
  if (contents.includes(`slug: "${args.slug}"`)) {
    console.log(`Song already in data/songs.ts: ${args.slug}`);
    return;
  }

  const dateCreated = new Date().toISOString().slice(0, 10);
  const tagLines = args.tags.map((tag) => `"${tag}"`).join(", ");
  const featuredLine = args.featured ? "\n    featured: true," : "";

  const block = `  {
    slug: "${args.slug}",
    title: "${args.title.replace(/"/g, '\\"')}",
    subtitle: "${args.subtitle.replace(/"/g, '\\"')}",
    authorSlug: "${args.author}",
    dateCreated: "${dateCreated}",
    audioSrc: "/assets/${args.author}/${args.slug}.mp3",
    coverSrc: "/assets/${args.author}/${args.slug}.jpg",
    story:
      "${args.story.replace(/"/g, '\\"')}",
    lyrics: songLyrics["${args.slug}"],
    tags: [${tagLines}],${featuredLine}
  },`;

  const updated = contents.replace(/\n];(\s*\nexport function getSongBySlug)/, `\n${block}\n];$1`);
  if (updated === contents) {
    throw new Error("Could not insert song entry into data/songs.ts");
  }
  writeFileSync(songsPath, updated, "utf8");
  console.log(`Added ${args.slug} → data/songs.ts`);
}

function appendToSeriesAlbum(seriesSlug: string, songSlug: string): void {
  const albumsPath = path.join(process.cwd(), "data/albums.ts");
  const contents = readFileSync(albumsPath, "utf8");
  const albumBlock = contents.match(
    new RegExp(`slug: "${seriesSlug}"[\\s\\S]*?songSlugs: \\[([^\\]]*)\\]`),
  );
  if (!albumBlock) {
    throw new Error(`Series album not found: ${seriesSlug}`);
  }
  if (albumBlock[1]?.includes(`"${songSlug}"`)) {
    console.log(`Already on album ${seriesSlug}: ${songSlug}`);
    return;
  }

  const updated = contents.replace(
    new RegExp(`(slug: "${seriesSlug}"[\\s\\S]*?songSlugs: \\[[^\\]]*)\\]`),
    `$1, "${songSlug}"]`,
  );
  if (updated === contents) {
    throw new Error(`Could not append ${songSlug} to ${seriesSlug}`);
  }
  writeFileSync(albumsPath, updated, "utf8");
  console.log(`Appended ${songSlug} → ${seriesSlug} in data/albums.ts`);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const root = process.cwd();
  const inputRel = path.relative(root, args.input);

  run(`./scripts/process-video.sh ${args.author} "${inputRel}" ${args.slug}`, "Extract MP3 + cover");

  const venvPython = path.join(root, ".venv-transcribe/bin/python3");
  if (!existsSync(venvPython)) {
    run("python3 -m venv .venv-transcribe && .venv-transcribe/bin/pip install -q faster-whisper", "Create transcription venv");
  }

  run(
    `.venv-transcribe/bin/python3 scripts/transcribe-songs.py --slug ${args.slug} --audio ${args.slug} public/assets/${args.author}/${args.slug}.mp3`,
    "Transcribe lyrics",
  );

  insertSongEntry(args);
  if (args.series) {
    appendToSeriesAlbum(args.series, args.slug);
  }

  run(`npm run copyright:register -- --slug ${args.slug}`, "Copyright registry");

  if (!args.skipCi) {
    run("npm run ci", "CI (lint, smoke, copyright, build, production smoke)");
  }

  if (args.push) {
    run(
      `git add public/assets/${args.author}/${args.slug}.* data/songs.ts data/albums.ts data/lyrics.ts data/copyright-registry.ts scripts/transcripts.json && git commit -m "Add ${args.title} to catalog and deploy pipeline." && git push origin main`,
      "Commit and push",
    );
  } else {
    console.log("\n✅ Pipeline complete. Review changes, then commit and push to deploy.");
  }
}

main();
