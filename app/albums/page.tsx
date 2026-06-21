import type { Metadata } from "next";

import { AlbumCard } from "@/components/album-card";
import { Topbar } from "@/components/topbar";
import { albums, getAlbumSongs } from "@/data/albums";
import { buildShareMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildShareMetadata({
  title: "Albums",
  description: "Browse creator albums built from the existing Family Jukebox songs.",
});

export default function AlbumsPage() {
  const totalTracks = albums.reduce((count, album) => count + getAlbumSongs(album).length, 0);

  return (
    <main className="min-w-0 space-y-4 px-3 pb-4 lg:space-y-6 lg:px-0">
      <Topbar />

      <header className="rounded-[30px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--jb-muted)]">
          Album library
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Play the collections</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--jb-muted)] sm:text-base">
          The same songs now have album homes, so each creator feels like a real release instead of
          a disconnected set of singles.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-family-accent px-3 py-2 text-[13px] font-extrabold text-[#1a0812]">
            {albums.length} releases
          </span>
          <span className="rounded-full border border-white/[0.09] bg-white/[0.07] px-3 py-2 text-[13px] font-extrabold text-[var(--family-ocean)]">
            {totalTracks} tracks
          </span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {albums.map((album) => (
          <AlbumCard key={album.slug} album={album} className="h-full" compact />
        ))}
      </section>
    </main>
  );
}
