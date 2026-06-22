"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useFamilyAudienceContext } from "@/contexts/family-audience-context";

type ListenerAgeContextValue = {
  listenerAge: number | null;
  hydrated: boolean;
  hasPrompted: boolean;
  setListenerAge: (age: number) => void;
  clearAge: () => void;
  markPrompted: () => void;
};

const ListenerAgeContext = createContext<ListenerAgeContextValue | null>(null);

export function ListenerAgeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useListenerAgeContext(): ListenerAgeContextValue {
  const familyAudience = useFamilyAudienceContext();

  const context = useContext(ListenerAgeContext);
  if (context) return context;

  return {
    listenerAge: familyAudience.listenerAge,
    hydrated: familyAudience.hydrated,
    hasPrompted: familyAudience.hasPrompted,
    setListenerAge: familyAudience.setListenerAge,
    clearAge: familyAudience.clearAudience,
    markPrompted: familyAudience.markPrompted,
  };
}
