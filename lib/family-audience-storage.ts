/** Persisted family audience — primary listening context across sessions. */

import { isValidFamilyAudienceId, type FamilyAudienceId } from "@/lib/family-audience";

export const FAMILY_AUDIENCE_STORAGE_KEY = "familyAudience";
export const FAMILY_AUDIENCE_CHANGED_EVENT = "family-jukebox:family-audience:changed";
export const FAMILY_AUDIENCE_PROMPTED_KEY = "family-jukebox:family-audience:prompted";

export type FamilyAudienceSnapshotCache = {
  raw: string | null;
  snapshot: FamilyAudienceId | null;
} | null;

export function parseFamilyAudienceId(serialized: string | null): FamilyAudienceId | null {
  if (!serialized) return null;
  if (!isValidFamilyAudienceId(serialized)) return null;
  return serialized;
}

/**
 * Read family audience with referential stability for useSyncExternalStore.
 */
export function readFamilyAudienceFromRaw(
  raw: string | null,
  cache: { current: FamilyAudienceSnapshotCache },
): FamilyAudienceId | null {
  if (cache.current?.raw === raw) {
    return cache.current.snapshot;
  }

  const snapshot = parseFamilyAudienceId(raw);
  cache.current = { raw, snapshot };
  return snapshot;
}

export function readHasPromptedForAudience(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(FAMILY_AUDIENCE_PROMPTED_KEY) === "1";
}

export function writeHasPromptedForAudience(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAMILY_AUDIENCE_PROMPTED_KEY, "1");
}
