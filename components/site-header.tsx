import Link from "next/link";

import { BrandBadge } from "@/components/brand-badge";

export function SiteHeader() {
  return (
    <header className="border-b border-amber-200/60 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group">
          <BrandBadge
            className="gap-2.5"
            titleClassName="font-heading text-lg text-amber-950"
            subtitleClassName="text-amber-800/70"
          />
        </Link>
      </div>
    </header>
  );
}
