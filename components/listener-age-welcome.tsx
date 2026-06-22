"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

import { useListenerAgeContext } from "@/contexts/listener-age-context";
import {
  ADULT_LISTENER_THRESHOLD,
  LISTENER_AGE_PRESETS,
  isValidListenerAge,
} from "@/lib/audience";
import { cn } from "@/lib/utils";

export function ListenerAgeWelcome() {
  const { listenerAge, hydrated, hasPrompted, setListenerAge, markPrompted } =
    useListenerAgeContext();
  const [customAge, setCustomAge] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const shouldShow =
    hydrated && !dismissed && listenerAge === null && !hasPrompted;

  if (!shouldShow) return null;

  const handlePreset = (age: number) => {
    setListenerAge(age);
    setDismissed(true);
  };

  const handleCustomSubmit = () => {
    const parsed = Number.parseInt(customAge, 10);
    if (!isValidListenerAge(parsed)) return;
    setListenerAge(parsed);
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
      aria-labelledby="listener-age-title"
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
            <Sparkles className="size-6 text-family-accent" />
          </span>
          <div>
            <h2 id="listener-age-title" className="text-xl font-extrabold tracking-tight sm:text-2xl">
              How old are you?
            </h2>
            <p className="mt-1 text-sm text-[var(--jb-muted)]">
              We&apos;ll tailor picks and suggestions — the full library stays open.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {LISTENER_AGE_PRESETS.map((preset) => (
            <button
              key={preset.age}
              type="button"
              onClick={() => handlePreset(preset.age)}
              className={cn(
                "group rounded-[20px] border border-white/[0.08] bg-white/[0.05] px-3 py-4 text-left transition",
                "hover:-translate-y-0.5 hover:border-family-accent/40 hover:bg-white/[0.09]",
              )}
            >
              <span className="text-2xl">{preset.emoji}</span>
              <span className="mt-2 block text-sm font-bold">{preset.label}</span>
              <span className="text-xs text-[var(--jb-muted)]">
                {preset.age >= ADULT_LISTENER_THRESHOLD ? "Adult picks" : `Age ${preset.age}`}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3">
            <span className="shrink-0 text-sm font-medium text-[var(--jb-muted)]">Or enter age</span>
            <input
              type="number"
              min={1}
              max={120}
              inputMode="numeric"
              value={customAge}
              onChange={(event) => setCustomAge(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleCustomSubmit();
              }}
              placeholder="35"
              className="min-w-0 flex-1 bg-transparent text-right text-lg font-bold outline-none"
            />
          </label>
          <button
            type="button"
            onClick={handleCustomSubmit}
            disabled={!isValidListenerAge(Number.parseInt(customAge, 10))}
            className="shrink-0 rounded-2xl bg-family-accent px-5 py-3 text-sm font-black text-[#1a0812] disabled:opacity-40"
          >
            Save
          </button>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="mt-4 w-full text-center text-sm font-medium text-[var(--jb-muted)] transition hover:text-white"
        >
          Skip for now — browse everything
        </button>
      </div>
    </div>
  );
}
