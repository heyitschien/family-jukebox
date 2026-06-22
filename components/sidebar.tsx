"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Music, Users } from "lucide-react";

import { BrandBadge } from "@/components/brand-badge";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/songs", label: "Songs", icon: Music },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/family", label: "Cousin Radio", icon: Users },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const isStaging = process.env.NEXT_PUBLIC_APP_ENV === "staging";

  return (
    <aside className="sticky top-[18px] hidden h-[calc(100dvh-36px)] flex-col gap-5 rounded-[var(--jb-radius)] border border-white/[0.07] bg-[rgba(17,24,33,0.86)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[18px] lg:flex">
      <Link href="/" className="block">
        <BrandBadge
          titleClassName="text-2xl"
          subtitleClassName={isStaging ? "text-amber-300" : undefined}
          subtitle={isStaging ? "Staging preview" : undefined}
        />
      </Link>

      <nav className="grid gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition",
                active
                  ? "bg-white/[0.08] text-[var(--jb-text)]"
                  : "text-[var(--jb-muted)] hover:bg-white/[0.08] hover:text-[var(--jb-text)]",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[22px] border border-white/[0.08] bg-gradient-to-br from-white/[0.11] to-white/[0.04] p-4">
        <h3 className="text-[15px] font-bold">Made together</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-[var(--jb-muted)]">
          AI songs, funny prompts, kid stories, cousin games, and little memories worth replaying.
        </p>
      </div>
    </aside>
  );
}
