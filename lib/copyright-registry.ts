import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { songCopyrightRegistry } from "@/data/copyright-registry";
import { songs, type Song } from "@/data/songs";
import {
  AI_PRODUCTION_DISCLOSURE,
  AI_PRODUCTION_TOOL,
  buildRegistryId,
  CATALOG_OWNER,
  defaultProductionNotes,
  defaultSubjectMemberSlugs,
  FAMILY_CURATOR,
  FAMILY_PRODUCER,
  type SongCopyrightRecord,
} from "@/lib/copyright-constants";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

export function sha256File(relativePublicPath: string): string {
  const normalized = relativePublicPath.replace(/^\//, "");
  const absolutePath = path.join(PUBLIC_ROOT, normalized);
  if (!existsSync(absolutePath)) {
    throw new Error(`Asset missing for copyright hash: ${relativePublicPath}`);
  }
  const buffer = readFileSync(absolutePath);
  return createHash("sha256").update(buffer).digest("hex");
}

export function buildCopyrightRecord(song: Song, registeredAt = new Date().toISOString()): SongCopyrightRecord {
  return {
    registryId: buildRegistryId(song.slug, song.dateCreated),
    songSlug: song.slug,
    title: song.title,
    workType: "family-original",
    createdDate: song.dateCreated,
    registeredAt,
    primaryArtistSlug: song.authorSlug,
    subjectMemberSlugs: defaultSubjectMemberSlugs(song.authorSlug, song.slug),
    catalogOwner: CATALOG_OWNER,
    familyProducer: FAMILY_PRODUCER,
    familyCurator: FAMILY_CURATOR,
    productionTool: AI_PRODUCTION_TOOL,
    productionNotes: `${defaultProductionNotes(song.title)} ${AI_PRODUCTION_DISCLOSURE}`,
    publicLicense: "all-rights-reserved",
    familyLicense: "cousin-radio-family-perpetual",
    audioAssetPath: song.audioSrc,
    coverAssetPath: song.coverSrc,
    audioSha256: sha256File(song.audioSrc),
    coverSha256: sha256File(song.coverSrc),
  };
}

export function getCopyrightRecordBySlug(slug: string): SongCopyrightRecord | undefined {
  return songCopyrightRegistry.find((record) => record.songSlug === slug);
}

export type CopyrightVerificationIssue = {
  songSlug: string;
  message: string;
};

export function verifyCopyrightRegistry(): CopyrightVerificationIssue[] {
  const issues: CopyrightVerificationIssue[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const song of songs) {
    const record = getCopyrightRecordBySlug(song.slug);
    if (!record) {
      issues.push({ songSlug: song.slug, message: "missing copyright registry entry" });
      continue;
    }

    if (seenSlugs.has(song.slug)) {
      issues.push({ songSlug: song.slug, message: "duplicate registry slug" });
    }
    seenSlugs.add(song.slug);

    if (seenIds.has(record.registryId)) {
      issues.push({ songSlug: song.slug, message: `duplicate registryId ${record.registryId}` });
    }
    seenIds.add(record.registryId);

    if (record.title !== song.title) {
      issues.push({ songSlug: song.slug, message: "title mismatch vs data/songs.ts" });
    }
    if (record.primaryArtistSlug !== song.authorSlug) {
      issues.push({ songSlug: song.slug, message: "primaryArtistSlug mismatch vs data/songs.ts" });
    }
    if (record.audioAssetPath !== song.audioSrc) {
      issues.push({ songSlug: song.slug, message: "audioAssetPath mismatch vs data/songs.ts" });
    }
    if (record.coverAssetPath !== song.coverSrc) {
      issues.push({ songSlug: song.slug, message: "coverAssetPath mismatch vs data/songs.ts" });
    }

    try {
      const audioHash = sha256File(record.audioAssetPath);
      if (audioHash !== record.audioSha256) {
        issues.push({
          songSlug: song.slug,
          message: `audioSha256 stale — run npm run copyright:register -- --slug ${song.slug}`,
        });
      }
      const coverHash = sha256File(record.coverAssetPath);
      if (coverHash !== record.coverSha256) {
        issues.push({
          songSlug: song.slug,
          message: `coverSha256 stale — run npm run copyright:register -- --slug ${song.slug}`,
        });
      }
    } catch (error) {
      issues.push({
        songSlug: song.slug,
        message: error instanceof Error ? error.message : "asset hash failed",
      });
    }
  }

  for (const record of songCopyrightRegistry) {
    if (!songs.some((song) => song.slug === record.songSlug)) {
      issues.push({
        songSlug: record.songSlug,
        message: "orphan registry entry — song removed from catalog",
      });
    }
  }

  return issues;
}

export { songCopyrightRegistry };
