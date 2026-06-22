"use client";

import { AudienceCard } from "@/components/audience-card";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { FAMILY_AUDIENCES } from "@/lib/family-audience";
import { cn } from "@/lib/utils";

type AudienceSelectorProps = {
  className?: string;
  showTagline?: boolean;
  compact?: boolean;
};

export function AudienceSelector({
  className,
  showTagline = true,
  compact = false,
}: AudienceSelectorProps) {
  const { audienceId, hydrated, setAudience } = useFamilyAudienceContext();

  if (!hydrated) {
    return (
      <div className={cn("animate-pulse space-y-3", className)}>
        {showTagline ? <div className="h-5 w-40 rounded-full bg-white/[0.06]" /> : null}
        <div className="flex gap-2">
          {FAMILY_AUDIENCES.map((audience) => (
            <div key={audience.id} className="h-[88px] flex-1 rounded-[18px] bg-white/[0.05]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className={cn("space-y-3", className)} aria-label="Family audience">
      {showTagline ? (
        <p className="text-sm font-bold text-[var(--jb-muted)] sm:text-[15px]">Music for your family</p>
      ) : null}
      <div
        className={cn(
          "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
          compact ? "snap-x snap-mandatory" : "sm:gap-3",
        )}
      >
        {FAMILY_AUDIENCES.map((audience) => (
          <AudienceCard
            key={audience.id}
            audience={audience}
            selected={audienceId === audience.id}
            onSelect={setAudience}
            className={cn(compact && "min-w-[96px] snap-start px-3 py-2.5")}
          />
        ))}
      </div>
    </section>
  );
}
