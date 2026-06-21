"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

type TopbarProps = {
  className?: string;
  variant?: "default" | "embedded";
};

export function Topbar({ className, variant = "default" }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const embedded = variant === "embedded";

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <header
      className={cn(
        embedded
          ? "relative z-20 w-full"
          : "sticky top-2 z-20 mb-4 flex items-center gap-4 rounded-[22px] border border-white/[0.06] bg-[rgba(11,15,20,0.68)] p-3 backdrop-blur-[18px] lg:top-[18px]",
        className,
      )}
    >
      <form
        onSubmit={onSubmit}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-full px-4 py-3 text-[var(--jb-muted)]",
          embedded
            ? "border border-white/15 bg-black/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
            : "flex-1 border border-white/[0.07] bg-white/[0.08]",
        )}
      >
        <Search className="size-[18px] shrink-0 opacity-80" strokeWidth={2.25} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, kids, tags, memories..."
          className="w-full border-0 bg-transparent text-[15px] text-[var(--jb-text)] outline-none placeholder:text-white/55"
        />
      </form>
      {!embedded && pathname === "/" ? (
        <span className="hidden rounded-full border border-white/[0.09] bg-white/[0.07] px-3.5 py-2.5 text-sm font-extrabold whitespace-nowrap lg:inline">
          Public family link
        </span>
      ) : null}
    </header>
  );
}
