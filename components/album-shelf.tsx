"use client";

import Link from "next/link";

import { AlbumCard } from "@/components/album-card";
import { usePlayer } from "@/contexts/player-context";
import { getAlbumSongs, type Album } from "@/data/albums";

type AlbumShelfProps = {
  albums: Album[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
};

export function AlbumShelf({
  albums,
  title = "Family albums",
  subtitle = "One collection per cousin — tap to explore or play the whole album",
  showViewAll = true,
}: AlbumShelfProps) {
  if (albums.length === 0) return null;

  return (
    <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-[22px] lg:mt-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">{title}</h2>
          <p className="text-sm font-bold text-[var(--jb-muted)]">{subtitle}</p>
        </div>
        {showViewAll ? (
          <Link
            href="/albums"
            className="shrink-0 text-sm font-bold text-[var(--family-pink)] hover:underline"
          >
            View all
          </Link>
        ) : null}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
        {albums.map((album) => (
          <AlbumCard key={album.slug} album={album} className="snap-start" />
        ))}
      </div>
    </section>
  );
}

export function AlbumShelfCompact({ albums }: { albums: Album[] }) {
  const { playQueue } = usePlayer();

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      {albums.map((album) => {
        const albumSongs = getAlbumSongs(album);
        return (
          <button
            key={album.slug}
            type="button"
            onClick={() => playQueue(albumSongs, 0, "shelf")}
            className="shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.06] px-4 py-3 text-left transition hover:bg-white/[0.1] [-webkit-tap-highlight-color:transparent]"
          >
            <p className="text-sm font-bold">{album.title}</p>
            <p className="mt-0.5 text-xs text-[var(--jb-muted)]">
              {albumSongs.length} {albumSongs.length === 1 ? "track" : "tracks"}
            </p>
          </button>
        );
      })}
    </div>
  );
}
