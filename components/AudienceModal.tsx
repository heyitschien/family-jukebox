"use client";

import { useState } from "react";
import { Music2, X } from "lucide-react";

import { AudienceCard } from "@/components/AudienceCard";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { audiences, type FamilyAudienceId } from "@/lib/audience";

export function AudienceModal() {
  const {
    audienceId,
    audienceModalOpen,
    closeAudienceModal,
    hydrated,
    setAudienceId,
  } = useFamilyAudienceContext();
  const [pendingId, setPendingId] = useState<FamilyAudienceId | null>(null);

  const firstVisit = hydrated && audienceId === null;
  const shouldShow = hydrated && (firstVisit || audienceModalOpen);

  if (!shouldShow) return null;

  const canClose = audienceId !== null;
  const selectedId = pendingId ?? audienceId;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/72 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="family-audience-modal-title"
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/[0.12] bg-gradient-to-br from-[#1a2430] via-[#121820] to-[#0d1117] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.62)] sm:p-7">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(120,140,255,0.24),transparent_65%)]" />

        {canClose ? (
          <button
            type="button"
            onClick={() => {
              setPendingId(null);
              closeAudienceModal();
            }}
            className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-white/[0.08] text-[var(--jb-muted)] transition hover:bg-white/[0.14] hover:text-white"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        ) : null}

        <div className="relative mb-6 flex items-start gap-3 pr-10">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-family-accent/20 text-family-accent">
            <Music2 className="size-6" />
          </span>
          <div>
            <h2
              id="family-audience-modal-title"
              className="text-2xl font-black tracking-tight text-white sm:text-3xl"
            >
              Welcome to Cousin Radio 🎵
            </h2>
            <p className="mt-1 text-sm font-bold text-[var(--jb-muted)] sm:text-base">
              Who are we listening with today?
            </p>
          </div>
        </div>

        <div className="relative grid gap-2.5 sm:grid-cols-2">
          {audiences.map((audience) => (
            <AudienceCard
              key={audience.id}
              audience={audience}
              selected={selectedId === audience.id}
              onSelect={() => setPendingId(audience.id)}
              variant="modal"
            />
          ))}
        </div>

        <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-[var(--jb-muted)] sm:max-w-md">
            Your profile controls visible playlists, songs, recommendations, homepage content,
            search results, and safe content filtering.
          </p>
          <button
            type="button"
            onClick={() => {
              if (selectedId) {
                setAudienceId(selectedId);
                setPendingId(null);
              }
            }}
            disabled={!selectedId}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-family-accent px-6 py-3 text-sm font-black text-[#1a0812] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
