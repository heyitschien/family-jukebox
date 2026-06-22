"use client";

import { useState } from "react";

import { useListenerAgeContext } from "@/contexts/listener-age-context";
import {
  FAMILY_AUDIENCES,
  type FamilyAudienceId,
} from "@/lib/audience";
import { cn } from "@/lib/utils";

export function AudienceModal() {
  const { familyAudience, hydrated, hasPrompted, setFamilyAudience, markPrompted } =
    useListenerAgeContext();
  const [selected, setSelected] = useState<FamilyAudienceId | null>(familyAudience ?? null);

  const shouldShow = hydrated && familyAudience === null && !hasPrompted;
  if (!shouldShow) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="family-audience-title"
    >
      <div className="w-full max-w-xl rounded-[28px] border border-white/[0.14] bg-gradient-to-br from-[#182230] via-[#101722] to-[#0a0f17] p-6 shadow-[0_36px_100px_rgba(0,0,0,0.58)] sm:p-8">
        <p className="text-sm font-black tracking-[0.08em] text-[var(--family-ocean)] uppercase">
          Welcome to Cousin Radio 🎵
        </p>
        <h2 id="family-audience-title" className="mt-2 text-2xl font-extrabold tracking-tight">
          Who are we listening with today?
        </h2>

        <fieldset className="mt-6 space-y-2.5">
          <legend className="sr-only">Choose a family audience</legend>
          {FAMILY_AUDIENCES.map((audience) => {
            const active = selected === audience.id;
            return (
              <button
                key={audience.id}
                type="button"
                onClick={() => setSelected(audience.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                  active
                    ? "border-[rgba(120,140,255,0.75)] bg-[rgba(120,140,255,0.18)] shadow-[0_0_20px_rgba(120,140,255,0.45)]"
                    : "border-white/[0.1] bg-white/[0.05] hover:border-white/[0.2] hover:bg-white/[0.09]",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full border text-[11px] font-black",
                    active
                      ? "border-transparent bg-white text-[#0f1622]"
                      : "border-white/[0.35] text-transparent",
                  )}
                  aria-hidden
                >
                  ●
                </span>
                <span className="text-xl" aria-hidden>
                  {audience.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold">{audience.label}</span>
                  <span className="block text-xs font-semibold text-[var(--jb-muted)]">
                    {audience.age}
                  </span>
                </span>
              </button>
            );
          })}
        </fieldset>

        <button
          type="button"
          disabled={selected === null}
          onClick={() => {
            if (!selected) return;
            setFamilyAudience(selected);
            markPrompted();
          }}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-family-accent px-5 py-2.5 text-sm font-black text-[#1a0812] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
