#!/usr/bin/env tsx
/**
 * Register or refresh copyright records (SHA-256 fingerprints + ownership metadata).
 *
 * Usage:
 *   npm run copyright:register -- --slug tap-on-the-glass
 *   npm run copyright:register -- --all
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

import { songCopyrightRegistry } from "../data/copyright-registry";
import { songs, getSongBySlug } from "../data/songs";
import { buildCopyrightRecord } from "../lib/copyright-registry";

const args = process.argv.slice(2);
const slugFlagIndex = args.indexOf("--slug");
const slug = slugFlagIndex >= 0 ? args[slugFlagIndex + 1] : undefined;
const registerAll = args.includes("--all");

if (!slug && !registerAll) {
  console.error("Usage: npm run copyright:register -- --slug <song-slug>");
  console.error("       npm run copyright:register -- --all");
  process.exit(1);
}

const targets = registerAll
  ? songs
  : [getSongBySlug(slug!)].filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

if (targets.length === 0) {
  console.error(`Song not found: ${slug}`);
  process.exit(1);
}

const bySlug = new Map(songCopyrightRegistry.map((record) => [record.songSlug, record]));

for (const song of targets) {
  const record = buildCopyrightRecord(song, new Date().toISOString());
  bySlug.set(song.slug, record);
  console.log(`Registered ${record.registryId}  audio=${record.audioSha256.slice(0, 12)}…`);
}

const ordered = songs
  .map((song) => bySlug.get(song.slug))
  .filter((record): record is NonNullable<typeof record> => Boolean(record));

const outputPath = path.join(process.cwd(), "data/copyright-registry.ts");
const fileContents = `/** Auto-maintained by scripts/register-copyright.ts — do not edit hashes by hand. */
import type { SongCopyrightRecord } from "@/lib/copyright-constants";

export const songCopyrightRegistry: SongCopyrightRecord[] = ${JSON.stringify(ordered, null, 2)};
`;

writeFileSync(outputPath, fileContents, "utf8");
console.log(`\nWrote ${ordered.length} records → data/copyright-registry.ts`);
console.log("Next: npm run copyright:verify");
