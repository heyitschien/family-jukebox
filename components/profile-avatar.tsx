"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, Info, Settings, UserRound, Users } from "lucide-react";

import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { BRAND_SHORT_NAME } from "@/lib/brand";
import { getAudienceLabel } from "@/lib/family-audience";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  className?: string;
};

const menuItems = [
  { href: "/", label: "Profile", icon: UserRound, description: "Home & audience" },
  { href: "/family", label: "Switch Family Member", icon: Users, description: "Meet the cousins" },
  { href: "/favorites", label: "Favorites", icon: Heart, description: "Songs you saved" },
  { href: "/search", label: "Settings", icon: Settings, description: "Search & filters" },
  { href: "/family", label: "About Cousin Radio", icon: Info, description: "Our family jukebox" },
] as const;

export function ProfileAvatar({ className }: ProfileAvatarProps) {
  const { audienceId } = useFamilyAudienceContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const profileLabel = audienceId ? getAudienceLabel(audienceId) : "Family profile";

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${profileLabel} menu`}
        className={cn(
          "grid size-11 place-items-center overflow-hidden rounded-2xl border border-white/[0.1] bg-[linear-gradient(145deg,#111827_0%,#1a0812_58%,#ff6fb1_140%)] text-white shadow-[0_12px_34px_rgba(0,0,0,0.28)] transition hover:scale-[1.03] hover:border-white/[0.18]",
          open && "ring-2 ring-[rgba(120,140,255,0.45)]",
        )}
      >
        <span className="absolute inset-[3px] rounded-[13px] border border-white/10" aria-hidden />
        <span className="text-[15px] leading-none font-black tracking-[-0.14em]">{BRAND_SHORT_NAME}</span>
        <span
          className="absolute right-1.5 top-1.5 size-2 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(255,209,102,0.6)]"
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(100vw-2rem,280px)] overflow-hidden rounded-[20px] border border-white/[0.1] bg-[rgba(9,13,18,0.96)] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
        >
          <div className="border-b border-white/[0.08] px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--jb-muted)]">
              Profile
            </p>
            <p className="mt-1 text-sm font-bold">{profileLabel}</p>
          </div>

          <div className="py-1">
            {menuItems.map(({ href, label, icon: Icon, description }) => (
              <Link
                key={label}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-white/[0.08]"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-white/[0.06]">
                  <Icon className="size-4 text-[var(--jb-muted)]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="block truncate text-xs text-[var(--jb-muted)]">{description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
