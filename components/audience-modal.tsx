"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { AudienceCard } from "@/components/audience-card";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { FAMILY_AUDIENCES, type FamilyAudienceId } from "@/lib/audience";

export function AudienceModal() {
  const {
    audienceId,
    hydrated,
    isAudienceModalOpen,
    setAudience,
    closeAudienceModal,
  } = useFamilyAudienceContext();
  const [draftAudienceId, setDraftAudienceId] = useState<FamilyAudienceId | null>(null);

  const requiresSelection = hydrated && audienceId === null;
  const selectedAudienceId = draftAudienceId ?? audienceId;

  useEffect(() => {
    if (!isAudienceModalOpen || requiresSelection) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAudienceModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAudienceModal, isAudienceModalOpen, requiresSelection]);

  if (!isAudienceModalOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/72 p-4 backdrop-blur-md sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="family-audience-title"
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/[0.12] bg-[linear-gradient(180deg,rgba(12,18,24,0.96),rgba(9,12,16,0.98))] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:p-8">
        {!requiresSelection ? (
          <button
            type="button"
            onClick={() => {
              setDraftAudienceId(null);
              closeAudienceModal();
            }}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/[0.08] text-[var(--jb-muted)] transition hover:bg-white/[0.14] hover:text-white"
            aria-label="Close audience selector"
          >
            <X className="size-4" />
          </button>
        ) : null}

        <div className="max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--family-ocean)]">
            Welcome to Cousin Radio
          </p>
          <h2 id="family-audience-title" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Who are we listening with today?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--jb-muted)]">
            Pick the family audience once and Cousin Radio will keep the homepage, search, and
            recommendations matched to that age group until you switch again.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {FAMILY_AUDIENCES.map((audience) => (
            <AudienceCard
              key={audience.id}
              audience={audience}
              selected={selectedAudienceId === audience.id}
              onSelect={() => setDraftAudienceId(audience.id)}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--jb-muted)]">
            You can switch audiences any time from the profile avatar.
          </p>
          <button
            type="button"
            onClick={() => {
              if (selectedAudienceId) {
                setDraftAudienceId(null);
                setAudience(selectedAudienceId);
              }
            }}
            disabled={selectedAudienceId === null}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-family-accent px-6 py-3 text-sm font-black text-[#1a0812] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
