"use client";

import Link from "next/link";

import { BRAND_NAME } from "@/lib/brand";
import { PlayIconButton } from "@/components/play-icon-button";
import { useSongPlayback } from "@/hooks/use-song-playback";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

const gradients = [
  "from-emerald-700 to-teal-900",
  "from-violet-700 to-indigo-900",
  "from-rose-700 to-orange-900",
  "from-sky-700 to-blue-900",
];

type QuickPickTileProps = {
  song: Song;
  label: string;
  index: number;
};

function QuickPickTile({ song, label, index }: QuickPickTileProps) {
  const { playing, toggle, isCurrent } = useSongPlayback(song);
  const gradient = gradients[index % gradients.length];

  return (
    <div
      className={cn(
        "relative flex h-[4.5rem] items-center gap-3 overflow-hidden rounded-md bg-gradient-to-br p-3 shadow-md",
        gradient,
        isCurrent && "ring-2 ring-[var(--family-pink)]",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={song.coverSrc} alt="" className="size-11 shrink-0 rounded shadow" />
      <Link href={`/songs/${song.slug}`} className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-bold leading-tight text-white">{label}</span>
      </Link>
      <PlayIconButton
        size="sm"
        playing={playing}
        label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
        onClick={toggle}
        className="shrink-0"
      />
    </div>
  );
}

type QuickPickGridProps = {
  songs: Song[];
};

export function QuickPickGrid({ songs }: QuickPickGridProps) {
  const picks = songs.slice(0, 4);

  return (
    <div className="grid grid-cols-2 gap-2 px-4">
      {picks.map((song, i) => (
        <QuickPickTile key={song.slug} song={song} label={song.title} index={i} />
      ))}
    </div>
  );
}

export function HomeGreeting() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="px-4 pt-4 pb-2">
      <h1 className="text-2xl font-bold tracking-tight text-white">{greeting}</h1>
      <Link href="/family" className="text-sm text-[#b3b3b3] hover:text-white hover:underline">
        {BRAND_NAME} · tap Family to meet everyone
      </Link>
    </header>
  );
}
