import { isFamilyAudienceId, type FamilyAudienceId } from "@/lib/audience";

/** Persisted family audience — powers audience-aware curations across sessions. */

export const FAMILY_AUDIENCE_STORAGE_KEY = "familyAudience";
export const FAMILY_AUDIENCE_CHANGED_EVENT = "family-audience:changed";

export type FamilyAudienceSnapshot = {
  audienceId: FamilyAudienceId;
  updatedAt: string;
};

export type FamilyAudienceSnapshotCache = {
  raw: string | null;
  snapshot: FamilyAudienceSnapshot | null;
} | null;

export function parseFamilyAudienceSnapshot(serialized: string | null): FamilyAudienceSnapshot | null {
  if (!serialized) return null;

  if (isFamilyAudienceId(serialized)) {
    return {
      audienceId: serialized,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const parsed = JSON.parse(serialized) as Partial<FamilyAudienceSnapshot>;
    if (!isFamilyAudienceId(parsed.audienceId)) return null;
    return {
      audienceId: parsed.audienceId,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Read family audience with referential stability for useSyncExternalStore.
 */
export function readFamilyAudienceFromRaw(
  raw: string | null,
  cache: { current: FamilyAudienceSnapshotCache },
): FamilyAudienceSnapshot | null {
  if (cache.current?.raw === raw) {
    return cache.current.snapshot;
  }

  const snapshot = parseFamilyAudienceSnapshot(raw);
  cache.current = { raw, snapshot };
  return snapshot;
}

export function serializeFamilyAudience(audienceId: FamilyAudienceId): {
  serialized: string;
  snapshot: FamilyAudienceSnapshot;
} {
  const snapshot: FamilyAudienceSnapshot = {
    audienceId,
    updatedAt: new Date().toISOString(),
  };
  return {
    serialized: audienceId,
    snapshot,
  };
}

/** Persisted listener age — kept for older snapshots and tests. */

export const LISTENER_AGE_STORAGE_KEY = "family-jukebox:listener-age";
export const LISTENER_AGE_CHANGED_EVENT = "family-jukebox:listener-age:changed";
export const LISTENER_AGE_PROMPTED_KEY = "family-jukebox:listener-age:prompted";

export type ListenerAgeSnapshot = {
  age: number;
  updatedAt: string;
};

export type ListenerAgeSnapshotCache = {
  raw: string | null;
  snapshot: ListenerAgeSnapshot | null;
} | null;

export function parseListenerAgeSnapshot(serialized: string | null): ListenerAgeSnapshot | null {
  if (!serialized) return null;

  try {
    const parsed = JSON.parse(serialized) as Partial<ListenerAgeSnapshot>;
    if (typeof parsed.age !== "number" || !Number.isInteger(parsed.age)) return null;
    if (parsed.age < 1 || parsed.age > 120) return null;
    return {
      age: parsed.age,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Read listener age with referential stability for useSyncExternalStore.
 */
export function readListenerAgeFromRaw(
  raw: string | null,
  cache: { current: ListenerAgeSnapshotCache },
): ListenerAgeSnapshot | null {
  if (cache.current?.raw === raw) {
    return cache.current.snapshot;
  }

  const snapshot = parseListenerAgeSnapshot(raw);
  cache.current = { raw, snapshot };
  return snapshot;
}

export function serializeListenerAge(age: number): {
  serialized: string;
  snapshot: ListenerAgeSnapshot;
} {
  const snapshot: ListenerAgeSnapshot = {
    age,
    updatedAt: new Date().toISOString(),
  };
  return {
    serialized: JSON.stringify(snapshot),
    snapshot,
  };
}

export function readHasPromptedForAge(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(LISTENER_AGE_PROMPTED_KEY) === "1";
}

export function writeHasPromptedForAge(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LISTENER_AGE_PROMPTED_KEY, "1");
}
