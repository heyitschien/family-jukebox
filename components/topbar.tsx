"use client";

import { usePathname } from "next/navigation";

import { InlineSearch } from "@/components/inline-search";
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
          : "sticky top-2 z-30 mb-4 flex w-full min-w-0 max-w-full items-center gap-4 rounded-[22px] border border-white/[0.06] bg-[rgba(11,15,20,0.68)] p-3 backdrop-blur-[18px] lg:top-[18px]",
        className,
      )}
    >
      <InlineSearch variant={variant} />
      {!embedded && pathname === "/" ? (
        <span className="hidden rounded-full border border-white/[0.09] bg-white/[0.07] px-3.5 py-2.5 text-sm font-extrabold whitespace-nowrap lg:inline">
          Public family link
        </span>
      ) : null}
    </header>
  );
}
