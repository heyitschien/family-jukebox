"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useFamilyAudience } from "@/hooks/use-family-audience";

type FamilyAudienceContextValue = ReturnType<typeof useFamilyAudience>;

const FamilyAudienceContext = createContext<FamilyAudienceContextValue | null>(null);

export function FamilyAudienceProvider({ children }: { children: ReactNode }) {
  const value = useFamilyAudience();
  return <FamilyAudienceContext.Provider value={value}>{children}</FamilyAudienceContext.Provider>;
}

export function useFamilyAudienceContext(): FamilyAudienceContextValue {
  const context = useContext(FamilyAudienceContext);
  if (!context) {
    throw new Error("useFamilyAudienceContext must be used within FamilyAudienceProvider");
  }
  return context;
}
