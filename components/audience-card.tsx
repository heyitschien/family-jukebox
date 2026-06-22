"use client";

import { cn } from "@/lib/utils";
import type { FamilyAudience } from "@/lib/audience";

type AudienceCardProps = {
  audience: FamilyAudience;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
};

export function AudienceCard({
  audience,
  selected,
  onSelect,
  compact = false,
}: AudienceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative overflow-hidden rounded-[18px] border border-white/[0.1] bg-white/[0.06] text-left backdrop-blur-xl transition duration-200",
        "hover:-translate-y-0.5 hover:border-white/[0.2] hover:bg-white/[0.1]",
        compact ? "px-4 py-3" : "px-4 py-4",
        selected &&
          "scale-[1.03] border-[rgba(120,140,255,0.72)] bg-[linear-gradient(135deg,rgba(255,111,177,0.18),rgba(108,183,255,0.14))] shadow-[0_0_20px_rgba(120,140,255,0.5)]",
      )}
      aria-pressed={selected}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_45%)] opacity-80" />
      <div className="relative flex items-start gap-3">
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-2xl border border-white/10 bg-black/20 text-2xl",
            compact ? "size-11" : "size-12",
          )}
          aria-hidden
        >
          {audience.emoji}
        </span>
        <div className="min-w-0">
          <p className="text-base font-extrabold tracking-tight text-white">{audience.label}</p>
          <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--jb-muted)]">
            {audience.age}
          </p>
          {!compact ? (
            <p className="mt-2 text-sm leading-snug text-[var(--jb-muted)]">{audience.summary}</p>
          ) : null}
        </div>
      </div>
    </button>
  );
}
