"use client";

import { useEffect, useRef, useState } from "react";
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
  variant?: "sidebar" | "compact" | "icon";
  className?: string;
};

export function ListenerAgeSelector({ variant = "sidebar", className }: ListenerAgeSelectorProps) {
  const { listenerAge, setListenerAge, clearAge, hydrated } = useListenerAgeContext();
  const [expanded, setExpanded] = useState(false);
  const [customAge, setCustomAge] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [expanded]);

  if (!hydrated) {
    return (
      <div
        className={cn(
          "animate-pulse border border-white/[0.08] bg-white/[0.04]",
          variant === "sidebar"
            ? "h-[88px] rounded-[22px]"
            : "size-11 shrink-0 rounded-full",
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

  const activePreset = LISTENER_AGE_PRESETS.find((preset) => preset.age === listenerAge);

  if (variant === "icon" || variant === "compact") {
    return (
      <div ref={rootRef} className={cn("relative shrink-0", className)}>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-label="Choose listening mode"
          aria-expanded={expanded}
          aria-haspopup="dialog"
          className={cn(
            "inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full border transition",
            "[-webkit-tap-highlight-color:transparent] [touch-action:manipulation]",
            listenerAge !== null
              ? "border-[rgba(255,111,177,0.45)] bg-family-soft text-family-glow shadow-[0_0_18px_rgba(255,111,177,0.18)] ring-1 ring-[rgba(255,111,177,0.28)]"
              : "border-white/[0.12] bg-white/[0.06] text-[var(--jb-muted)] hover:bg-white/[0.1] hover:text-white",
          )}
        >
          {activePreset ? (
            <span className="text-lg leading-none" aria-hidden>
              {activePreset.emoji}
            </span>
          ) : (
            <UserRound className="size-[18px]" strokeWidth={2.25} aria-hidden />
          )}
        </button>

        {expanded ? (
          <ListenerAgePopover
            listenerAge={listenerAge}
            customAge={customAge}
            onCustomAgeChange={setCustomAge}
            onSelectPreset={(age) => {
              setListenerAge(age);
              setExpanded(false);
            }}
            onCustomSubmit={handleCustomSubmit}
            onClear={() => {
              clearAge();
              setExpanded(false);
            }}
            className="absolute right-0 top-[calc(100%+10px)] z-[90] w-[min(100vw-2rem,320px)]"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
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
        <div className="mt-4 border-t border-white/[0.08] pt-4">
          <ListenerAgePopover
            listenerAge={listenerAge}
            customAge={customAge}
            onCustomAgeChange={setCustomAge}
            onSelectPreset={(age) => {
              setListenerAge(age);
              setExpanded(false);
            }}
            onCustomSubmit={handleCustomSubmit}
            onClear={() => {
              clearAge();
              setExpanded(false);
            }}
            showHelperText
          />
        </div>
      ) : null}
    </div>
  );
}

function ListenerAgePopover({
  listenerAge,
  customAge,
  onCustomAgeChange,
  onSelectPreset,
  onCustomSubmit,
  onClear,
  className,
  showHelperText = false,
}: {
  listenerAge: number | null;
  customAge: string;
  onCustomAgeChange: (value: string) => void;
  onSelectPreset: (age: number) => void;
  onCustomSubmit: () => void;
  onClear: () => void;
  className?: string;
  showHelperText?: boolean;
}) {
  return (
    <div
      role="dialog"
      aria-label="Who's listening?"
      className={cn(
        "rounded-[20px] border border-white/[0.1] bg-[#121820] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--jb-muted)]">
        Who&apos;s listening?
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {LISTENER_AGE_PRESETS.map((preset) => (
          <button
            key={preset.age}
            type="button"
            onClick={() => onSelectPreset(preset.age)}
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
          onChange={(event) => onCustomAgeChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onCustomSubmit();
          }}
          placeholder="Custom age"
          aria-label="Custom age"
          className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-sm outline-none"
        />
        <button
          type="button"
          onClick={onCustomSubmit}
          disabled={!isValidListenerAge(Number.parseInt(customAge, 10))}
          className="rounded-xl bg-family-accent px-3 py-2 text-xs font-black text-[#1a0812] disabled:opacity-40"
        >
          Set
        </button>
      </div>

      {listenerAge !== null ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 text-xs font-medium text-[var(--jb-muted)] hover:text-white"
        >
          Clear age — show all curations
        </button>
      ) : showHelperText ? (
        <p className="mt-3 text-xs leading-relaxed text-[var(--jb-muted)]">
          {`Under ${ADULT_LISTENER_THRESHOLD}? We surface cousin songs for kids. Grown-ups get adult picks first.`}
        </p>
      ) : null}
    </div>
  );
}
