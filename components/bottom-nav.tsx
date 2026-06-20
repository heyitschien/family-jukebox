"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Music, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/songs", label: "Songs", icon: Music },
  { href: "/favorites", label: "Favs", icon: Heart },
  { href: "/family", label: "Family", icon: Users },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[60] grid grid-cols-4 border-t border-white/[0.08] bg-[rgba(9,12,16,0.96)] px-2 pt-1.5 pb-[calc(10px+env(safe-area-inset-bottom))] lg:hidden">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "grid justify-items-center gap-0.5 text-[11px] font-extrabold transition",
              active ? "text-[var(--jb-green)]" : "text-[var(--jb-muted)]",
            )}
          >
            <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
