"use client";

import { AudienceCard } from "@/components/AudienceCard";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { audiences, getAudienceCurationSubtitle } from "@/lib/audience";
import { cn } from "@/lib/utils";

type AudienceSelectorProps = {
  className?: string;
};

export function AudienceSelector({ className }: AudienceSelectorProps) {
  const { audienceId, hydrated, setAudienceId } = useFamilyAudienceContext();

  return (
    <section
      className={cn(
        "rounded-[30px] border border-white/[0.07] bg-[rgba(17,24,33,0.52)] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-[18px] sm:p-5",
        className,
      )}
      aria-labelledby="family-audience-title"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--family-ocean)]">
            Family Audience
          </p>
          <h1 id="family-audience-title" className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Music for your family
          </h1>
          <p className="mt-1 max-w-2xl text-sm font-bold text-[var(--jb-muted)]">
            {getAudienceCurationSubtitle(audienceId)}
          </p>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {hydrated
          ? audiences.map((audience) => (
              <AudienceCard
                key={audience.id}
                audience={audience}
                selected={audienceId === audience.id}
                onSelect={() => setAudienceId(audience.id)}
              />
            ))
          : audiences.map((audience) => (
              <div
                key={audience.id}
                className="min-h-[104px] animate-pulse rounded-[18px] border border-white/[0.07] bg-white/[0.05]"
              />
            ))}
      </div>
    </section>
  );
}
