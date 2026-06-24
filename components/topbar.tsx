"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CRMark } from "@/components/brand/cr-mark";
import { CopyPublicLinkButton } from "@/components/copy-public-link-button";
import { InlineSearch } from "@/components/inline-search";
import { ListenerAgeSelector } from "@/components/listener-age-selector";
import { cn } from "@/lib/utils";

type TopbarProps = {
  className?: string;
  variant?: "default" | "embedded";
};

export function Topbar({ className, variant = "default" }: TopbarProps) {
  const pathname = usePathname();
  const embedded = variant === "embedded";

  return (
    <header
      className={cn(
        embedded
          ? "relative z-30 w-full"
          : "sticky top-2 z-30 mb-4 flex items-center gap-3 rounded-[22px] border border-white/[0.06] bg-[rgba(11,15,20,0.68)] p-3 backdrop-blur-[18px] lg:top-[18px]",
        className,
      )}
    >
      {!embedded ? (
        <Link
          href="/"
          className="hidden shrink-0 transition hover:opacity-90 sm:inline-flex"
          aria-label="Cousin Radio home"
        >
          <CRMark size="sm" showRings={false} />
        </Link>
      ) : null}
      <InlineSearch variant={variant} className={embedded ? undefined : "min-w-0 flex-1"} />
      <ListenerAgeSelector variant="compact" className="lg:hidden" />
      {!embedded && pathname === "/" ? <CopyPublicLinkButton /> : null}
    </header>
  );
}
