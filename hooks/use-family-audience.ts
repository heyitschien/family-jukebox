"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

import { getFamilyAudience, type FamilyAudienceId } from "@/lib/audience";
import {
  FAMILY_AUDIENCE_CHANGED_EVENT,
  FAMILY_AUDIENCE_STORAGE_KEY,
  readFamilyAudienceFromRaw,
  type FamilyAudienceSnapshotCache,
} from "@/lib/family-audience-storage";

const familyAudienceCache: { current: FamilyAudienceSnapshotCache } = { current: null };

function getStoredFamilyAudience(): FamilyAudienceId | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(FAMILY_AUDIENCE_STORAGE_KEY);
  return readFamilyAudienceFromRaw(raw, familyAudienceCache);
}

function writeFamilyAudience(audienceId: FamilyAudienceId): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAMILY_AUDIENCE_STORAGE_KEY, audienceId);
  familyAudienceCache.current = { raw: audienceId, audienceId };
  window.dispatchEvent(new Event(FAMILY_AUDIENCE_CHANGED_EVENT));
}

function clearStoredFamilyAudience(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FAMILY_AUDIENCE_STORAGE_KEY);
  familyAudienceCache.current = { raw: null, audienceId: null };
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
  const storedAudienceId = useSyncExternalStore(
    subscribeToFamilyAudience,
    getStoredFamilyAudience,
    () => null,
  );
  const hydrated = useHydrated();
  const [manualModalOpen, setManualModalOpen] = useState(false);

  const audienceId = hydrated ? storedAudienceId : null;
  const audience = useMemo(
    () => (audienceId ? getFamilyAudience(audienceId) : null),
    [audienceId],
  );

  const setAudience = useCallback((nextAudienceId: FamilyAudienceId) => {
    writeFamilyAudience(nextAudienceId);
    setManualModalOpen(false);
  }, []);

  const clearAudience = useCallback(() => {
    clearStoredFamilyAudience();
    setManualModalOpen(false);
  }, []);

  const openAudienceModal = useCallback(() => {
    setManualModalOpen(true);
  }, []);

  const closeAudienceModal = useCallback(() => {
    if (audienceId !== null) {
      setManualModalOpen(false);
    }
  }, [audienceId]);

  return {
    audienceId,
    audience,
    listenerAge: audience?.listenerAge ?? null,
    hydrated,
    setAudience,
    clearAudience,
    isAudienceModalOpen: hydrated && (audienceId === null || manualModalOpen),
    openAudienceModal,
    closeAudienceModal,
  };
}
