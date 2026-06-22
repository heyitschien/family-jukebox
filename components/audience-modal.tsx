"use client";

import { useState } from "react";
import { Music, X } from "lucide-react";

import { AudienceCard } from "@/components/audience-card";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { FAMILY_AUDIENCES, type FamilyAudienceId } from "@/lib/family-audience";
import { cn } from "@/lib/utils";

export function AudienceModal() {
  const { audienceId, hydrated, hasPrompted, setAudience, markPrompted } = useFamilyAudienceContext();
  const [pendingAudience, setPendingAudience] = useState<FamilyAudienceId | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const shouldShow = hydrated && !dismissed && audienceId === null && !hasPrompted;

  if (!shouldShow) return null;

  const selected = pendingAudience ?? "grownups";

  const handleContinue = () => {
    setAudience(selected);
    setDismissed(true);
  };

  const handleSkip = () => {
    markPrompted();
    setDismissed(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audience-modal-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-[#1a2430] via-[#121820] to-[#0d1117] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-8">
        <button
          type="button"
          onClick={handleSkip}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/[0.08] text-[var(--jb-muted)] transition hover:bg-white/[0.14] hover:text-white"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-family-accent/20 text-2xl">
            <Music className="size-6 text-family-accent" />
          </span>
          <div>
            <h2 id="audience-modal-title" className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Welcome to Cousin Radio 🎵
            </h2>
            <p className="mt-1 text-sm text-[var(--jb-muted)]">Who are we listening with today?</p>
          </div>
        </div>

        <div className="space-y-2">
          {FAMILY_AUDIENCES.map((audience) => (
            <AudienceCard
              key={audience.id}
              audience={audience}
              selected={selected === audience.id}
              onSelect={setPendingAudience}
              layout="radio"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className={cn(
            "mt-6 w-full rounded-2xl bg-family-accent px-5 py-3.5 text-sm font-black text-[#1a0812] transition",
            "hover:brightness-110",
          )}
        >
          Continue
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="mt-3 w-full text-center text-sm font-medium text-[var(--jb-muted)] transition hover:text-white"
        >
          Skip for now — browse everything
        </button>
      </div>
    </div>
  );
}
