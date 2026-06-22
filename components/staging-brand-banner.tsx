"use client";

import { STAGING_BRAND } from "@/lib/site-env";

export function StagingBrandBanner() {
  if (process.env.NEXT_PUBLIC_APP_ENV !== "staging") {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-[70] border-b border-amber-400/35 bg-gradient-to-r from-amber-500/95 via-orange-500/95 to-amber-600/95 px-3 py-2 text-center text-[#1a1208] shadow-[0_8px_24px_rgba(245,158,11,0.25)] lg:rounded-b-[18px]"
    >
      <p className="text-[11px] font-black uppercase tracking-[0.18em]">{STAGING_BRAND.badge}</p>
      <p className="mt-0.5 text-xs font-bold sm:text-sm">{STAGING_BRAND.tagline}</p>
    </div>
  );
}
