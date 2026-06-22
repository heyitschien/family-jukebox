"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, UserRound } from "lucide-react";

import { useListenerAgeContext } from "@/contexts/listener-age-context";
import { getFamilyAudience } from "@/lib/audience";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  className?: string;
};

const MENU_ITEMS = [
  { label: "Profile", href: "/family" },
  { label: "Switch Family Member", href: "/family" },
  { label: "Favorites", href: "/favorites" },
  { label: "Settings", href: "/family" },
  { label: "About Cousin Radio", href: "/family" },
] as const;

export function ProfileAvatar({ className }: ProfileAvatarProps) {
  const { familyAudience } = useListenerAgeContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const activeAudience = familyAudience ? getFamilyAudience(familyAudience) : null;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex min-h-[50px] items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.08] px-2 py-1.5 text-left transition",
          "hover:bg-white/[0.12]",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open family profile menu"
      >
        <span className="grid size-9 place-items-center rounded-full bg-[rgba(120,140,255,0.22)]">
          <UserRound className="size-4.5 text-[var(--jb-text)]" />
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-xs font-black uppercase tracking-[0.1em] text-[var(--jb-muted)]">
            Profile
          </span>
          <span className="block truncate text-sm font-bold text-[var(--jb-text)]">
            {activeAudience ? `${activeAudience.emoji} ${activeAudience.label}` : "Family"}
          </span>
        </span>
        <ChevronDown className={cn("size-4 text-[var(--jb-muted)] transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-[90] w-[min(92vw,280px)] rounded-[18px] border border-white/[0.12] bg-[rgba(10,14,20,0.95)] p-1.5 shadow-[0_28px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          role="menu"
          aria-label="Family profile actions"
        >
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--jb-muted)] transition hover:bg-white/[0.08] hover:text-[var(--jb-text)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
