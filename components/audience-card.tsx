"use client";

import type { FamilyAudience } from "@/lib/family-audience";
import { cn } from "@/lib/utils";

type AudienceCardProps = {
  audience: FamilyAudience;
  selected: boolean;
  onSelect: (audienceId: FamilyAudience["id"]) => void;
  className?: string;
  layout?: "card" | "radio";
};

export function AudienceCard({
  audience,
  selected,
  onSelect,
  className,
  layout = "card",
}: AudienceCardProps) {
  if (layout === "radio") {
    return (
      <label
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-[18px] border border-white/[0.08] bg-white/[0.05] px-4 py-3 transition hover:border-white/[0.14] hover:bg-white/[0.08]",
          selected && "border-[rgba(120,140,255,0.55)] bg-white/[0.08] shadow-[0_0_20px_rgba(120,140,255,0.35)]",
          className,
        )}
      >
        <input
          type="radio"
          name="family-audience"
          checked={selected}
          onChange={() => onSelect(audience.id)}
          className="size-4 accent-[#788cff]"
        />
        <span className="text-xl" aria-hidden>
          {audience.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">{audience.label}</span>
          <span className="block text-xs text-[var(--jb-muted)]">{audience.age}</span>
        </span>
      </label>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(audience.id)}
      aria-pressed={selected}
      className={cn(
        "group flex min-w-[108px] flex-1 flex-col items-start rounded-[18px] border border-white/[0.08] bg-[rgba(17,24,33,0.45)] px-4 py-3 text-left backdrop-blur-[12px] transition duration-200",
        "hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.08]",
        selected &&
          "scale-[1.03] border-[rgba(120,140,255,0.65)] bg-white/[0.1] shadow-[0_0_20px_rgba(120,140,255,0.5)]",
        className,
      )}
    >
      <span className="text-2xl leading-none" aria-hidden>
        {audience.emoji}
      </span>
      <span className="mt-2 text-sm font-extrabold tracking-tight">{audience.label}</span>
      <span className="mt-0.5 text-[11px] font-semibold text-[var(--jb-muted)]">{audience.age}</span>
    </button>
  );
}
