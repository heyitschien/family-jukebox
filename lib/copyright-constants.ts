/** Cousin Radio family catalog — ownership constants (not legal advice). */

export const CATALOG_OWNER = "Cousin Radio Family Collection";

export const FAMILY_PRODUCER = "Chien Family Production";

export const FAMILY_CURATOR = "Tio Chien (HeyITSChien)";

export const PLATFORM_NAME = "Cousin Radio";

export const PLATFORM_DOMAIN = "cousinradio.com";

export const AI_PRODUCTION_TOOL = "google-gemini" as const;

export const AI_PRODUCTION_DISCLOSURE =
  "Audio generated with Google Gemini from family-written prompts and direction. Subject to Google Gemini / AI Studio terms in effect at creation time.";

export type FamilyLicense = "cousin-radio-family-perpetual";

export type PublicLicense = "all-rights-reserved";

export type SongCopyrightRecord = {
  /** Stable ID, e.g. CR-2026-gravity-shift */
  registryId: string;
  songSlug: string;
  title: string;
  workType: "family-original";
  createdDate: string;
  /** ISO timestamp when audio hash was last verified in repo */
  registeredAt: string;
  /** Primary family artist on the jukebox (catalog author) */
  primaryArtistSlug: string;
  /** Family members this song celebrates or is about */
  subjectMemberSlugs: string[];
  catalogOwner: string;
  familyProducer: string;
  familyCurator: string;
  productionTool: typeof AI_PRODUCTION_TOOL;
  productionNotes: string;
  /** Streaming / public use on cousinradio.com */
  publicLicense: PublicLicense;
  /** In-family listening, sharing, and legacy preservation */
  familyLicense: FamilyLicense;
  audioAssetPath: string;
  coverAssetPath: string;
  audioSha256: string;
  coverSha256: string;
};

/** Songs that explicitly feature multiple family members (override default [author]). */
export const SUBJECT_MEMBER_OVERRIDES: Partial<Record<string, string[]>> = {
  "foxes-of-the-garden": ["solene", "eliana", "marceline", "ocean", "tio-chien"],
  "pink-glasses-everywhere": ["eliana", "solene", "marceline"],
  "mountains-to-the-shore": ["ocean", "marceline", "eliana", "solene"],
  "dash-and-go": ["marceline", "solene", "eliana"],
  "legacy-in-the-lane": ["sam-and-josh"],
};

export function buildRegistryId(songSlug: string, createdDate: string): string {
  const year = createdDate.slice(0, 4);
  return `CR-${year}-${songSlug}`;
}

export function defaultSubjectMemberSlugs(primaryArtistSlug: string, songSlug: string): string[] {
  return SUBJECT_MEMBER_OVERRIDES[songSlug] ?? [primaryArtistSlug];
}

export function defaultProductionNotes(songTitle: string): string {
  return `Family-directed original "${songTitle}" produced for ${PLATFORM_NAME} (${PLATFORM_DOMAIN}).`;
}
