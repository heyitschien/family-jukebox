import Link from "next/link";

import { COUSIN_RADIO_BRAND } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="border-b border-amber-200/60 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-family-accent text-xl font-black text-[#1a0812] shadow-sm transition-transform group-hover:scale-105">
            {COUSIN_RADIO_BRAND.mark}
          </span>
          <div>
            <p className="font-heading text-lg font-bold tracking-tight text-amber-950">
              Cousin Radio
            </p>
            <p className="text-xs text-amber-800/70">Cousin Radio · Little Anthems</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
