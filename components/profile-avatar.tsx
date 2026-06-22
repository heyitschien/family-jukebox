"use client";

import Link from "next/link";
import { Heart, Info, Settings2, UserRound, Users } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";

import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  className?: string;
};

export function ProfileAvatar({ className }: ProfileAvatarProps) {
  const { audience, hydrated, openAudienceModal } = useFamilyAudienceContext();
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

  if (!hydrated) {
    return <div className={cn("size-12 animate-pulse rounded-full bg-white/[0.08]", className)} />;
  }

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-12 items-center justify-center rounded-full border border-white/[0.12] bg-[linear-gradient(145deg,rgba(17,24,33,0.9),rgba(255,111,177,0.22))] text-sm font-black tracking-tight text-white shadow-[0_14px_34px_rgba(0,0,0,0.32)] transition hover:-translate-y-0.5 hover:border-white/[0.22]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open family profile menu"
      >
        <span className="absolute inset-[3px] rounded-full border border-white/[0.08]" aria-hidden />
        <span aria-hidden>CR</span>
        {audience ? (
          <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border border-[#071015] bg-[rgba(11,15,20,0.95)] text-[11px]">
            {audience.emoji}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-[90] w-[min(90vw,320px)] overflow-hidden rounded-[24px] border border-white/[0.1] bg-[rgba(9,13,18,0.96)] shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
        >
          <div className="border-b border-white/[0.08] px-4 py-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--jb-muted)]">
              Family audience
            </p>
            <p className="mt-1 text-base font-extrabold text-white">
              {audience ? `${audience.emoji} ${audience.label}` : "Choose a profile"}
            </p>
            <p className="mt-1 text-sm leading-snug text-[var(--jb-muted)]">
              {audience?.summary ?? "Select an audience to tune the Cousin Radio experience."}
            </p>
          </div>

          <nav className="p-2">
            <MenuLink href="/family" icon={UserRound} label="Profile" onSelect={() => setOpen(false)} />
            <MenuLink
              href="/family"
              icon={Users}
              label="Switch Family Member"
              onSelect={() => setOpen(false)}
            />
            <MenuLink
              href="/favorites"
              icon={Heart}
              label="Favorites"
              onSelect={() => setOpen(false)}
            />
            <MenuButton
              icon={Settings2}
              label="Settings"
              onClick={() => {
                setOpen(false);
                openAudienceModal();
              }}
            />
            <MenuLink
              href="/"
              icon={Info}
              label="About Cousin Radio"
              onSelect={() => setOpen(false)}
            />
          </nav>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onSelect,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-[var(--jb-text)] transition hover:bg-white/[0.06]"
    >
      <Icon className="size-4 text-[var(--jb-muted)]" />
      {label}
    </Link>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-[var(--jb-text)] transition hover:bg-white/[0.06]"
    >
      <Icon className="size-4 text-[var(--jb-muted)]" />
      {label}
    </button>
  );
}
