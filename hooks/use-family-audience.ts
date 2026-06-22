"use client";

import { useCallback, useSyncExternalStore } from "react";

import { getAudienceForListenerAge, type FamilyAudienceId } from "@/lib/family-audience";
import {
  FAMILY_AUDIENCE_CHANGED_EVENT,
  FAMILY_AUDIENCE_STORAGE_KEY,
  readFamilyAudienceFromRaw,
  readHasPromptedForAudience,
  writeHasPromptedForAudience,
  type FamilyAudienceSnapshotCache,
} from "@/lib/family-audience-storage";
import { isValidListenerAge } from "@/lib/audience";
import {
  LISTENER_AGE_CHANGED_EVENT,
  LISTENER_AGE_STORAGE_KEY,
  readListenerAgeFromRaw,
  serializeListenerAge,
  type ListenerAgeSnapshotCache,
} from "@/lib/audience-storage";
import { getListenerAgeForAudience } from "@/lib/family-audience";

const familyAudienceCache: { current: FamilyAudienceSnapshotCache } = { current: null };
const listenerAgeCache: { current: ListenerAgeSnapshotCache } = { current: null };

function getStoredFamilyAudience(): ReturnType<typeof readFamilyAudienceFromRaw> {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(FAMILY_AUDIENCE_STORAGE_KEY);
  return readFamilyAudienceFromRaw(raw, familyAudienceCache);
}

function writeFamilyAudience(audienceId: FamilyAudienceId): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(FAMILY_AUDIENCE_STORAGE_KEY, audienceId);
  familyAudienceCache.current = { raw: audienceId, snapshot: audienceId };

  const listenerAge = getListenerAgeForAudience(audienceId);
  const { serialized, snapshot } = serializeListenerAge(listenerAge);
  window.localStorage.setItem(LISTENER_AGE_STORAGE_KEY, serialized);
  listenerAgeCache.current = { raw: serialized, snapshot };

  window.dispatchEvent(new Event(FAMILY_AUDIENCE_CHANGED_EVENT));
  window.dispatchEvent(new Event(LISTENER_AGE_CHANGED_EVENT));
}

function clearFamilyAudience(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(FAMILY_AUDIENCE_STORAGE_KEY);
  familyAudienceCache.current = { raw: null, snapshot: null };
  window.dispatchEvent(new Event(FAMILY_AUDIENCE_CHANGED_EVENT));
}

function subscribeToFamilyAudience(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(FAMILY_AUDIENCE_CHANGED_EVENT, handleChange);
  window.addEventListener(LISTENER_AGE_CHANGED_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(FAMILY_AUDIENCE_CHANGED_EVENT, handleChange);
    window.removeEventListener(LISTENER_AGE_CHANGED_EVENT, handleChange);
  };
}

function subscribeNoop(): () => void {
  return () => {};
}

function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

function migrateLegacyListenerAge(): FamilyAudienceId | null {
  if (typeof window === "undefined") return null;

  const existingAudience = window.localStorage.getItem(FAMILY_AUDIENCE_STORAGE_KEY);
  if (existingAudience) return readFamilyAudienceFromRaw(existingAudience, familyAudienceCache);

  const legacyRaw = window.localStorage.getItem(LISTENER_AGE_STORAGE_KEY);
  const legacySnapshot = readListenerAgeFromRaw(legacyRaw, listenerAgeCache);
  if (!legacySnapshot) return null;

  const audienceId = getAudienceForListenerAge(legacySnapshot.age);
  writeFamilyAudience(audienceId);
  return audienceId;
}

export function useFamilyAudience() {
  const audienceId = useSyncExternalStore(
    subscribeToFamilyAudience,
    () => {
      const stored = getStoredFamilyAudience();
      if (stored) return stored;
      return migrateLegacyListenerAge();
    },
    () => null,
  );
  const hydrated = useHydrated();
  const hasPrompted = hydrated ? readHasPromptedForAudience() : false;

  const setAudience = useCallback((nextAudienceId: FamilyAudienceId) => {
    writeFamilyAudience(nextAudienceId);
    writeHasPromptedForAudience();
  }, []);

  const clearAudience = useCallback(() => {
    clearFamilyAudience();
    writeHasPromptedForAudience();
  }, []);

  const markPrompted = useCallback(() => {
    writeHasPromptedForAudience();
  }, []);

  const setListenerAge = useCallback((age: number) => {
    if (!isValidListenerAge(age)) return;
    writeFamilyAudience(getAudienceForListenerAge(age));
    writeHasPromptedForAudience();
  }, []);

  const listenerAge =
    hydrated && audienceId !== null ? getListenerAgeForAudience(audienceId) : null;

  return {
    audienceId: hydrated ? audienceId : null,
    listenerAge,
    hydrated,
    hasPrompted,
    setAudience,
    clearAudience,
    markPrompted,
    setListenerAge,
  };
}
