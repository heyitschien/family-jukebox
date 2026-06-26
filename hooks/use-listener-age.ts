"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { isValidListenerAge } from "@/lib/audience";
import {
  LISTENER_AGE_CHANGED_EVENT,
  LISTENER_AGE_STORAGE_KEY,
  readHasPromptedForAge,
  readListenerAgeFromRaw,
  serializeListenerAge,
  writeHasPromptedForAge,
  type ListenerAgeSnapshotCache,
} from "@/lib/audience-storage";

const listenerAgeCache: { current: ListenerAgeSnapshotCache } = { current: null };

function readAgeFromUrl(): number | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("age") ?? params.get("listenerAge");
  if (!raw) return null;
  const age = Number(raw);
  return isValidListenerAge(age) ? age : null;
}

function getStoredListenerAge(): ReturnType<typeof readListenerAgeFromRaw> {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LISTENER_AGE_STORAGE_KEY);
  return readListenerAgeFromRaw(raw, listenerAgeCache);
}

function writeListenerAge(age: number): void {
  if (typeof window === "undefined") return;
  if (!isValidListenerAge(age)) return;

  const { serialized, snapshot } = serializeListenerAge(age);
  window.localStorage.setItem(LISTENER_AGE_STORAGE_KEY, serialized);
  listenerAgeCache.current = { raw: serialized, snapshot };
  window.dispatchEvent(new Event(LISTENER_AGE_CHANGED_EVENT));
}

function clearListenerAge(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LISTENER_AGE_STORAGE_KEY);
  listenerAgeCache.current = { raw: null, snapshot: null };
  window.dispatchEvent(new Event(LISTENER_AGE_CHANGED_EVENT));
}

function subscribeToListenerAge(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(LISTENER_AGE_CHANGED_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(LISTENER_AGE_CHANGED_EVENT, handleChange);
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
    subscribeToListenerAge,
    getStoredListenerAge,
    () => null,
  );
  const hydrated = useHydrated();
  const hasPrompted = hydrated ? readHasPromptedForAge() : false;

  const setListenerAge = useCallback((age: number) => {
    writeListenerAge(age);
    writeHasPromptedForAge();
  }, []);

  const clearAge = useCallback(() => {
    clearListenerAge();
    writeHasPromptedForAge();
  }, []);

  const markPrompted = useCallback(() => {
    writeHasPromptedForAge();
  }, []);

  useEffect(() => {
    const urlAge = readAgeFromUrl();
    if (urlAge === null) return;
    if (snapshot?.age === urlAge) return;
    writeListenerAge(urlAge);
    writeHasPromptedForAge();
  }, [snapshot?.age]);

  return {
    listenerAge: hydrated ? snapshot?.age ?? null : null,
    hydrated,
    hasPrompted,
    setListenerAge,
    clearAge,
    markPrompted,
  };
}
