"use client";

import { usePathname } from "next/navigation";

import { CopyPublicLinkButton } from "@/components/copy-public-link-button";
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
        "relative z-30 mb-4 w-full",
        !embedded && "pt-[max(4px,env(safe-area-inset-top))] sm:pt-0",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <InlineSearch variant="embedded" className="min-w-0 flex-1" />
        {!embedded && pathname === "/" ? <CopyPublicLinkButton /> : null}
      </div>
    </header>
  );
}
