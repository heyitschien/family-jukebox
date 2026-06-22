"use client";

import { useState } from "react";
import { ChevronDown, UserRound } from "lucide-react";

import { useListenerAgeContext } from "@/contexts/listener-age-context";
import {
  ADULT_LISTENER_THRESHOLD,
  LISTENER_AGE_PRESETS,
  getListenerAgeLabel,
  isValidListenerAge,
} from "@/lib/audience";
import { cn } from "@/lib/utils";

type ListenerAgeSelectorProps = {
  variant?: "sidebar" | "compact";
  className?: string;
};

export function ListenerAgeSelector({ variant = "sidebar", className }: ListenerAgeSelectorProps) {
  const { listenerAge, setListenerAge, clearAge, hydrated } = useListenerAgeContext();
  const [expanded, setExpanded] = useState(false);
  const [customAge, setCustomAge] = useState("");

  if (!hydrated) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-[22px] border border-white/[0.08] bg-white/[0.04]",
          variant === "sidebar" ? "h-[88px]" : "h-10 w-28",
          className,
        )}
      />
    );
  }

  const handleCustomSubmit = () => {
    const parsed = Number.parseInt(customAge, 10);
    if (!isValidListenerAge(parsed)) return;
    setListenerAge(parsed);
    setCustomAge("");
    setExpanded(false);
  };

  if (variant === "compact") {
    return (
      <div className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.06] px-3 py-2 text-xs font-bold transition hover:bg-white/[0.1]"
        >
          <UserRound className="size-3.5" />
          {listenerAge !== null ? getListenerAgeLabel(listenerAge) : "Your age"}
          <ChevronDown className={cn("size-3.5 transition", expanded && "rotate-180")} />
        </button>

        {expanded ? (
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,320px)] rounded-[20px] border border-white/[0.1] bg-[#121820] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <div className="flex flex-wrap gap-2">
              {LISTENER_AGE_PRESETS.map((preset) => (
                <button
                  key={preset.age}
                  type="button"
                  onClick={() => {
                    setListenerAge(preset.age);
                    setExpanded(false);
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold transition",
                    listenerAge === preset.age
                      ? "bg-family-accent text-[#1a0812]"
                      : "bg-white/[0.08] text-[var(--jb-muted)] hover:text-white",
                  )}
                >
                  {preset.emoji} {preset.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
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
                placeholder="Custom age"
                className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleCustomSubmit}
                disabled={!isValidListenerAge(Number.parseInt(customAge, 10))}
                className="rounded-xl bg-family-accent px-3 py-2 text-xs font-black text-[#1a0812] disabled:opacity-40"
              >
                Set
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[22px] border border-white/[0.08] bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-4",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--jb-muted)]">
            Listening as
          </p>
          <p className="mt-1 text-[15px] font-bold">
            {listenerAge !== null ? getListenerAgeLabel(listenerAge) : "Set your age"}
          </p>
        </div>
        <ChevronDown
          className={cn("size-4 shrink-0 text-[var(--jb-muted)] transition", expanded && "rotate-180")}
        />
      </button>

      {expanded ? (
        <div className="mt-4 space-y-3 border-t border-white/[0.08] pt-4">
          <div className="flex flex-wrap gap-2">
            {LISTENER_AGE_PRESETS.map((preset) => (
              <button
                key={preset.age}
                type="button"
                onClick={() => {
                  setListenerAge(preset.age);
                  setExpanded(false);
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-bold transition",
                  listenerAge === preset.age
                    ? "bg-family-accent text-[#1a0812]"
                    : "bg-white/[0.08] text-[var(--jb-muted)] hover:text-white",
                )}
              >
                {preset.emoji} {preset.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
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
              placeholder="Custom age"
              className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={handleCustomSubmit}
              disabled={!isValidListenerAge(Number.parseInt(customAge, 10))}
              className="rounded-xl bg-white/[0.1] px-3 py-2 text-xs font-bold disabled:opacity-40"
            >
              Set
            </button>
          </div>

          {listenerAge !== null ? (
            <button
              type="button"
              onClick={() => {
                clearAge();
                setExpanded(false);
              }}
              className="text-xs font-medium text-[var(--jb-muted)] hover:text-white"
            >
              Clear age — show all curations
            </button>
          ) : (
            <p className="text-xs leading-relaxed text-[var(--jb-muted)]">
              {`Under ${ADULT_LISTENER_THRESHOLD}? We surface cousin songs for kids. Grown-ups get adult picks first.`}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
