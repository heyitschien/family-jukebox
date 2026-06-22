"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { getFamilyAudience, type FamilyAudienceId } from "@/lib/audience";
import { useFamilyAudience } from "@/hooks/use-family-audience";

type FamilyAudienceContextValue = ReturnType<typeof useFamilyAudience> & {
  audience: ReturnType<typeof getFamilyAudience>;
  audienceModalOpen: boolean;
  openAudienceModal: () => void;
  closeAudienceModal: () => void;
  setAudienceId: (audienceId: FamilyAudienceId) => void;
};

const FamilyAudienceContext = createContext<FamilyAudienceContextValue | null>(null);

export function FamilyAudienceProvider({ children }: { children: ReactNode }) {
  const audienceState = useFamilyAudience();
  const [audienceModalOpen, setAudienceModalOpen] = useState(false);

  const closeAudienceModal = useCallback(() => {
    setAudienceModalOpen(false);
  }, []);

  const openAudienceModal = useCallback(() => {
    setAudienceModalOpen(true);
  }, []);

  const setAudienceId = useCallback(
    (audienceId: FamilyAudienceId) => {
      audienceState.setAudienceId(audienceId);
      setAudienceModalOpen(false);
    },
    [audienceState],
  );

  const value = useMemo(
    () => ({
      ...audienceState,
      audience: getFamilyAudience(audienceState.audienceId),
      audienceModalOpen,
      openAudienceModal,
      closeAudienceModal,
      setAudienceId,
    }),
    [audienceModalOpen, audienceState, closeAudienceModal, openAudienceModal, setAudienceId],
  );

  return <FamilyAudienceContext.Provider value={value}>{children}</FamilyAudienceContext.Provider>;
}

export function useFamilyAudienceContext(): FamilyAudienceContextValue {
  const context = useContext(FamilyAudienceContext);
  if (!context) {
    throw new Error("useFamilyAudienceContext must be used within FamilyAudienceProvider");
  }
  return context;
}
