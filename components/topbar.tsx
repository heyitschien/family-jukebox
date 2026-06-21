"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

type TopbarProps = {
  className?: string;
};

export function Topbar({ className }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

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
        "sticky top-2 z-20 mb-4 flex items-center gap-4 rounded-[22px] border border-white/[0.06] bg-[rgba(11,15,20,0.68)] p-3 backdrop-blur-[18px] lg:top-[18px]",
        className,
      )}
    >
      <form onSubmit={onSubmit} className="flex flex-1 items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.08] px-4 py-3 text-[var(--jb-muted)]">
        <Search className="size-[18px] shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, albums, kids, tags, memories..."
          className="w-full border-0 bg-transparent text-[15px] text-[var(--jb-text)] outline-none placeholder:text-[var(--jb-muted-2)]"
        />
      </form>
      {pathname === "/" ? (
        <span className="hidden rounded-full border border-white/[0.09] bg-white/[0.07] px-3.5 py-2.5 text-sm font-extrabold whitespace-nowrap lg:inline">
          Public family link
        </span>
      ) : null}
    </header>
  );
}
