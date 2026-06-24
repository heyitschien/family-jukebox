import { Heart, Music2, Play, Radio, UsersRound } from "lucide-react";

import { BRAND_CONCEPTS } from "@/lib/brand";
import { cn } from "@/lib/utils";

const iconMap = {
  users: UsersRound,
  radio: Radio,
  music: Music2,
  play: Play,
} as const;

type BrandConceptStripProps = {
  className?: string;
  compact?: boolean;
};

/** Tasteful icon strip for the four brand concepts — use sparingly. */
export function BrandConceptStrip({ className, compact = false }: BrandConceptStripProps) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-2 sm:gap-3",
        compact ? "text-[10px]" : "text-[11px]",
        className,
      )}
      aria-label="Cousin Radio brand ideas"
    >
      {BRAND_CONCEPTS.map((concept) => {
        const Icon = iconMap[concept.icon];
        return (
          <li
            key={concept.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-cr-soft bg-cr-soft px-2.5 py-1.5 font-bold text-[var(--jb-muted)]"
            title={`${concept.label} — ${concept.description}`}
          >
            <Icon className="size-3.5 shrink-0 text-[var(--cr-lilac)]" aria-hidden />
            {!compact ? <span>{concept.label}</span> : null}
          </li>
        );
      })}
      <li className="inline-flex items-center text-[var(--cr-rose)]" aria-hidden>
        <Heart className="size-3.5 fill-current" />
      </li>
    </ul>
  );
}
