"use client";

import { cn } from "@/lib/utils";
import type { FamilyAudience } from "@/lib/audience";

type AudienceCardProps = {
  audience: FamilyAudience;
  selected: boolean;
  onSelect: () => void;
  variant?: "selector" | "modal";
};

export function AudienceCard({
  audience,
  selected,
  onSelect,
  variant = "selector",
}: AudienceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative overflow-hidden rounded-[18px] border px-4 py-4 text-left backdrop-blur-[12px] transition duration-200 [-webkit-tap-highlight-color:transparent]",
        "hover:-translate-y-0.5 hover:border-[rgba(120,140,255,0.42)] hover:bg-white/[0.1]",
        selected
          ? "scale-[1.025] border-[rgba(120,140,255,0.68)] bg-[rgba(120,140,255,0.16)] shadow-[0_0_20px_rgba(120,140,255,.5)]"
          : "border-white/[0.09] bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        variant === "modal" ? "min-h-[116px]" : "min-h-[104px]",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent opacity-0 transition",
          selected && "opacity-100",
        )}
        aria-hidden
      />
      <span className="relative flex items-start justify-between gap-3">
        <span>
          <span className="text-3xl" aria-hidden>
            {audience.emoji}
          </span>
          <span className="mt-3 block text-base font-black tracking-tight text-white">
            {audience.label}
          </span>
          <span className="mt-1 block text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--family-ocean)]">
            Ages {audience.age}
          </span>
        </span>
        <span
          className={cn(
            "mt-1 grid size-5 place-items-center rounded-full border text-[11px] font-black transition",
            selected
              ? "border-transparent bg-family-accent text-[#1a0812]"
              : "border-white/20 text-transparent group-hover:text-white/70",
          )}
          aria-hidden
        >
          ✓
        </span>
      </span>
      {variant === "modal" ? (
        <span className="relative mt-3 block text-[13px] leading-snug text-[var(--jb-muted)]">
          {audience.tagline}
        </span>
      ) : null}
    </button>
  );
}
