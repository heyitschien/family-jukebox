"use client";

import { useCallback, useSyncExternalStore } from "react";

import { isFamilyAudienceId, type FamilyAudienceId } from "@/lib/audience";
import {
  FAMILY_AUDIENCE_CHANGED_EVENT,
  FAMILY_AUDIENCE_STORAGE_KEY,
  readFamilyAudienceFromRaw,
  serializeFamilyAudience,
  type FamilyAudienceSnapshotCache,
} from "@/lib/audience-storage";

const familyAudienceCache: { current: FamilyAudienceSnapshotCache } = { current: null };

function getStoredFamilyAudience(): ReturnType<typeof readFamilyAudienceFromRaw> {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(FAMILY_AUDIENCE_STORAGE_KEY);
  return readFamilyAudienceFromRaw(raw, familyAudienceCache);
}

function writeFamilyAudience(audienceId: FamilyAudienceId): void {
  if (typeof window === "undefined") return;
  if (!isFamilyAudienceId(audienceId)) return;

  const { serialized, snapshot } = serializeFamilyAudience(audienceId);
  window.localStorage.setItem(FAMILY_AUDIENCE_STORAGE_KEY, serialized);
  familyAudienceCache.current = { raw: serialized, snapshot };
  window.dispatchEvent(new Event(FAMILY_AUDIENCE_CHANGED_EVENT));
}

function subscribeToFamilyAudience(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(FAMILY_AUDIENCE_CHANGED_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(FAMILY_AUDIENCE_CHANGED_EVENT, handleChange);
  };
}

function subscribeNoop(): () => void {
  return () => {};
}

function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export function useFamilyAudience() {
  const snapshot = useSyncExternalStore(
    subscribeToFamilyAudience,
    getStoredFamilyAudience,
    () => null,
  );
  const hydrated = useHydrated();

  const setAudienceId = useCallback((audienceId: FamilyAudienceId) => {
    writeFamilyAudience(audienceId);
  }, []);

  return {
    audienceId: hydrated ? snapshot?.audienceId ?? null : null,
    hydrated,
    setAudienceId,
  };
}
