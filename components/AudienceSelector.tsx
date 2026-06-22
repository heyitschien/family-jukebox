"use client";

import { AudienceCard } from "@/components/AudienceCard";
import { useListenerAgeContext } from "@/contexts/listener-age-context";
import { FAMILY_AUDIENCES } from "@/lib/audience";
import { cn } from "@/lib/utils";

type AudienceSelectorProps = {
  className?: string;
  showHeading?: boolean;
  columns?: 2 | 4;
};

export function AudienceSelector({
  className,
  showHeading = false,
  columns = 4,
}: AudienceSelectorProps) {
  const { familyAudience, hydrated, setFamilyAudience } = useListenerAgeContext();
  const gridColumnsClass = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-4";

  return (
    <section className={cn("space-y-3", className)} aria-label="Family audience selector">
      {showHeading ? (
        <div>
          <p className="text-[11px] font-black tracking-[0.14em] text-[var(--jb-muted)] uppercase">
            Family audience
          </p>
          <h2 className="text-lg font-extrabold tracking-tight text-[var(--jb-text)]">
            Music for your family
          </h2>
        </div>
      ) : null}

      <div
        className={cn(
          "flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:grid sm:overflow-visible",
          gridColumnsClass,
        )}
      >
        {FAMILY_AUDIENCES.map((audience) => (
          <AudienceCard
            key={audience.id}
            audience={audience}
            selected={hydrated ? familyAudience === audience.id : false}
            onSelect={setFamilyAudience}
            className={cn("w-full shrink-0", !hydrated && "animate-pulse")}
          />
        ))}
      </div>
    </section>
  );
}
