"use client";

import Link from "next/link";

import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

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
  const { playSong } = usePlayer();
  const gradient = gradients[index % gradients.length];

  return (
    <button
      type="button"
      onClick={() => playSong(song)}
      className={`flex h-[4.5rem] items-center gap-3 overflow-hidden rounded-md bg-gradient-to-br ${gradient} p-3 text-left shadow-md active:scale-[0.98]`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={song.coverSrc} alt="" className="size-11 shrink-0 rounded shadow" />
      <span className="line-clamp-2 text-sm font-bold leading-tight text-white">{label}</span>
    </button>
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
        Family Jukebox · tap Family to meet everyone
      </Link>
    </header>
  );
}
