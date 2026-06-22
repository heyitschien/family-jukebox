"use client";

import { AudienceCard } from "@/components/audience-card";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { FAMILY_AUDIENCES } from "@/lib/audience";
import { cn } from "@/lib/utils";

type AudienceSelectorProps = {
  className?: string;
};

export function AudienceSelector({ className }: AudienceSelectorProps) {
  const { audienceId, hydrated, setAudience } = useFamilyAudienceContext();

  return (
    <section className={cn("rounded-[28px] border border-white/[0.08] bg-black/25 p-4 backdrop-blur-xl sm:p-5", className)}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--jb-muted)]">
            Music for your family
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-[30px]">
            Choose who you&apos;re listening with
          </h2>
        </div>
        <p className="max-w-md text-sm text-[var(--jb-muted)]">
          Picks, playlists, search results, and safe-mode filtering all shift with your family
          audience.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {FAMILY_AUDIENCES.map((audience) => (
          <AudienceCard
            key={audience.id}
            audience={audience}
            selected={hydrated && audienceId === audience.id}
            onSelect={() => setAudience(audience.id)}
            compact
          />
        ))}
      </div>
    </section>
  );
}
