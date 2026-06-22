"use client";

import { usePathname } from "next/navigation";

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
          : "sticky top-2 z-30 mb-4 flex items-center gap-4 rounded-[22px] border border-white/[0.06] bg-[rgba(11,15,20,0.68)] p-3 backdrop-blur-[18px] lg:top-[18px]",
        className,
      )}
    >
      <InlineSearch variant={variant} />
      <ListenerAgeSelector variant="compact" className="lg:hidden" />
      {!embedded && pathname === "/" ? <CopyPublicLinkButton /> : null}
    </header>
  );
}
