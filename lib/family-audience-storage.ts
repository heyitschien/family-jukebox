import { isFamilyAudienceId, type FamilyAudienceId } from "@/lib/audience";

export const FAMILY_AUDIENCE_STORAGE_KEY = "familyAudience";
export const FAMILY_AUDIENCE_CHANGED_EVENT = "familyAudience:changed";

export type FamilyAudienceSnapshotCache = {
  raw: string | null;
  audienceId: FamilyAudienceId | null;
} | null;

export function parseStoredFamilyAudience(raw: string | null): FamilyAudienceId | null {
  if (!raw) return null;
  return isFamilyAudienceId(raw) ? raw : null;
}

export function readFamilyAudienceFromRaw(
  raw: string | null,
  cache: { current: FamilyAudienceSnapshotCache },
): FamilyAudienceId | null {
  if (cache.current?.raw === raw) {
    return cache.current.audienceId;
  }

  const audienceId = parseStoredFamilyAudience(raw);
  cache.current = { raw, audienceId };
  return audienceId;
}
