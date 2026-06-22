"use client";

import type { FamilyAudience, FamilyAudienceId } from "@/lib/audience";
import { cn } from "@/lib/utils";

type AudienceCardProps = {
  audience: FamilyAudience;
  selected: boolean;
  onSelect: (audienceId: FamilyAudienceId) => void;
  className?: string;
};

export function AudienceCard({ audience, selected, onSelect, className }: AudienceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(audience.id)}
      className={cn(
        "group min-w-[108px] rounded-[18px] border px-4 py-3 text-left backdrop-blur-[12px] transition",
        "hover:-translate-y-[2px]",
        selected
          ? "scale-[1.02] border-[rgba(160,180,255,0.88)] bg-[rgba(130,148,255,0.2)] shadow-[0_0_20px_rgba(120,140,255,0.5)]"
          : "border-white/[0.12] bg-white/[0.06] hover:border-white/[0.22] hover:bg-white/[0.1]",
        className,
      )}
      aria-pressed={selected}
      aria-label={`Switch audience to ${audience.label}`}
    >
      <span className="text-xl" aria-hidden>
        {audience.emoji}
      </span>
      <span className="mt-1.5 block text-sm font-extrabold text-[var(--jb-text)]">{audience.label}</span>
      <span className="block text-xs font-semibold text-[var(--jb-muted)]">{audience.age}</span>
    </button>
  );
}
