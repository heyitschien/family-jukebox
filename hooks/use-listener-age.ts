"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  getAudienceIdForListenerAge,
  getAudienceListenerAge,
  isValidListenerAge,
  type FamilyAudienceId,
} from "@/lib/audience";
import {
  FAMILY_AUDIENCE_CHANGED_EVENT,
  FAMILY_AUDIENCE_STORAGE_KEY,
  LISTENER_AGE_CHANGED_EVENT,
  LISTENER_AGE_STORAGE_KEY,
  readFamilyAudienceFromRaw,
  readHasPromptedForAudience,
  readListenerAgeFromRaw,
  serializeFamilyAudience,
  type FamilyAudienceSnapshotCache,
  type ListenerAgeSnapshotCache,
  writeHasPromptedForAudience,
} from "@/lib/audience-storage";

const familyAudienceCache: { current: FamilyAudienceSnapshotCache } = { current: null };
const legacyAgeCache: { current: ListenerAgeSnapshotCache } = { current: null };

function getStoredFamilyAudience(): ReturnType<typeof readFamilyAudienceFromRaw> {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(FAMILY_AUDIENCE_STORAGE_KEY);
  const snapshot = readFamilyAudienceFromRaw(raw, familyAudienceCache);
  if (snapshot) return snapshot;

  // Backward compatibility: migrate legacy listener age snapshots to audience ids.
  const legacyRaw = window.localStorage.getItem(LISTENER_AGE_STORAGE_KEY);
  const legacyAge = readListenerAgeFromRaw(legacyRaw, legacyAgeCache);
  if (!legacyAge) return null;

  const audienceId = getAudienceIdForListenerAge(legacyAge.age);
  const migrated = serializeFamilyAudience(audienceId);
  window.localStorage.setItem(FAMILY_AUDIENCE_STORAGE_KEY, migrated.serialized);
  familyAudienceCache.current = {
    raw: migrated.serialized,
    snapshot: migrated.snapshot,
  };
  return migrated.snapshot;
}

function writeFamilyAudience(audienceId: FamilyAudienceId): void {
  if (typeof window === "undefined") return;
  const { serialized, snapshot } = serializeFamilyAudience(audienceId);
  window.localStorage.setItem(FAMILY_AUDIENCE_STORAGE_KEY, serialized);
  familyAudienceCache.current = { raw: serialized, snapshot };
  // Compatibility event for existing listeners that still key off listener age.
  window.dispatchEvent(new Event(LISTENER_AGE_CHANGED_EVENT));
  window.dispatchEvent(new Event(FAMILY_AUDIENCE_CHANGED_EVENT));
}

function clearFamilyAudience(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FAMILY_AUDIENCE_STORAGE_KEY);
  familyAudienceCache.current = { raw: null, snapshot: null };
  window.dispatchEvent(new Event(LISTENER_AGE_CHANGED_EVENT));
  window.dispatchEvent(new Event(FAMILY_AUDIENCE_CHANGED_EVENT));
}

function subscribeToFamilyAudience(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleChange = (event: Event) => {
    if (
      event instanceof StorageEvent &&
      event.key &&
      ![FAMILY_AUDIENCE_STORAGE_KEY, LISTENER_AGE_STORAGE_KEY].includes(event.key)
    ) {
      return;
    }
    onStoreChange();
  };
  window.addEventListener("storage", handleChange);
  window.addEventListener(LISTENER_AGE_CHANGED_EVENT, handleChange);
  window.addEventListener(FAMILY_AUDIENCE_CHANGED_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(LISTENER_AGE_CHANGED_EVENT, handleChange);
    window.removeEventListener(FAMILY_AUDIENCE_CHANGED_EVENT, handleChange);
  };
}

function subscribeNoop(): () => void {
  return () => {};
}

function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export function useListenerAge() {
  const snapshot = useSyncExternalStore(
    subscribeToFamilyAudience,
    getStoredFamilyAudience,
    () => null,
  );
  const hydrated = useHydrated();
  const hasPrompted = hydrated ? readHasPromptedForAudience() : false;

  const setFamilyAudience = useCallback((audienceId: FamilyAudienceId) => {
    writeFamilyAudience(audienceId);
    writeHasPromptedForAudience();
  }, []);

  const setListenerAge = useCallback((age: number) => {
    if (!isValidListenerAge(age)) return;
    setFamilyAudience(getAudienceIdForListenerAge(age));
  }, [setFamilyAudience]);

  const clearAudience = useCallback(() => {
    clearFamilyAudience();
    writeHasPromptedForAudience();
  }, []);

  const clearAge = useCallback(() => {
    clearAudience();
  }, [clearAudience]);

  const markPrompted = useCallback(() => {
    writeHasPromptedForAudience();
  }, []);

  const familyAudience = hydrated ? snapshot?.audienceId ?? null : null;

  return {
    listenerAge: hydrated && familyAudience ? getAudienceListenerAge(familyAudience) : null,
    familyAudience,
    hydrated,
    hasPrompted,
    setFamilyAudience,
    setListenerAge,
    clearAudience,
    clearAge,
    markPrompted,
  };
}
