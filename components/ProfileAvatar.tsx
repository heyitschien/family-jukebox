"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Info, Settings, UserRound, Users } from "lucide-react";

import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  className?: string;
};

export function ProfileAvatar({ className }: ProfileAvatarProps) {
  const { audience, openAudienceModal } = useFamilyAudienceContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const avatarLabel = audience ? `${audience.label} profile` : "Family profile";

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex min-h-12 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.08] py-1.5 pr-3 pl-1.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition",
          "hover:border-[rgba(255,111,177,0.3)] hover:bg-white/[0.12]",
        )}
        aria-label={avatarLabel}
        aria-expanded={open}
      >
        <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-family-accent to-[var(--family-ocean)] text-xl shadow-[0_0_18px_rgba(255,111,177,0.28)]">
          {audience?.emoji ?? "🐶"}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-sm font-black text-white">
            {audience?.label ?? "Profile"}
          </span>
          <span className="block truncate text-[11px] font-bold text-[var(--jb-muted)]">
            {audience ? `Ages ${audience.age}` : "Choose listener"}
          </span>
        </span>
        <ChevronDown className={cn("size-4 text-[var(--jb-muted)] transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[90] w-[min(92vw,280px)] overflow-hidden rounded-[22px] border border-white/[0.1] bg-[rgba(11,15,20,0.96)] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.52)] backdrop-blur-2xl">
          <div className="px-3 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--family-ocean)]">
              Profile
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              {audience ? `${audience.emoji} ${audience.label}` : "Cousin Radio Family"}
            </p>
          </div>
          <MenuLink href="/family" icon={<UserRound className="size-4" />} label="Profile" />
          <MenuButton
            icon={<Users className="size-4" />}
            label="Switch Family Member"
            onClick={() => {
              setOpen(false);
              openAudienceModal();
            }}
          />
          <MenuLink href="/favorites" icon={<Heart className="size-4" />} label="Favorites" />
          <MenuButton icon={<Settings className="size-4" />} label="Settings" onClick={() => setOpen(false)} />
          <MenuLink href="/family" icon={<Info className="size-4" />} label="About Cousin Radio" />
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-[var(--jb-muted)] transition hover:bg-white/[0.07] hover:text-white"
    >
      {icon}
      {label}
    </Link>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-[var(--jb-muted)] transition hover:bg-white/[0.07] hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
}
