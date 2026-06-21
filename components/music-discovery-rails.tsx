import Link from "next/link";

import { AlbumCard } from "@/components/album-card";
import { SongRow } from "@/components/song-row";
import type { Album } from "@/data/albums";
import type { FamilyMember } from "@/data/members";
import type { Song } from "@/data/songs";

type RelatedSongsRailProps = {
  title: string;
  subtitle: string;
  songs: Song[];
  playlist?: Song[];
};

type RelatedAlbumsRailProps = {
  title: string;
  subtitle: string;
  albums: Album[];
};

type ArtistCircleLinksProps = {
  title?: string;
  subtitle?: string;
  artists: FamilyMember[];
};

export function RelatedSongsRail({
  title,
  subtitle,
  songs,
  playlist = songs,
}: RelatedSongsRailProps) {
  if (songs.length === 0) return null;

  return (
    <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{subtitle}</p>
      </div>
      <div className="grid gap-2">
        {songs.map((song, index) => (
          <SongRow key={song.slug} song={song} index={index} showIndex playlist={playlist} />
        ))}
      </div>
    </section>
  );
}

export function RelatedAlbumsRail({ title, subtitle, albums }: RelatedAlbumsRailProps) {
  if (albums.length === 0) return null;

  return (
    <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{subtitle}</p>
        </div>
        <Link href="/albums" className="text-sm font-bold text-[var(--family-pink)] hover:underline">
          All albums →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
        {albums.map((album) => (
          <AlbumCard key={album.slug} album={album} size="sm" className="snap-start" showKind />
        ))}
      </div>
    </section>
  );
}

export function ArtistCircleLinks({
  title = "Jump to another artist",
  subtitle = "Every artist page opens another path through the jukebox.",
  artists,
}: ArtistCircleLinksProps) {
  if (artists.length === 0) return null;

  return (
    <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{subtitle}</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {artists.map((artist) => (
          <Link
            key={artist.slug}
            href={`/members/${artist.slug}`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.07] px-4 py-2.5 text-sm font-extrabold text-[var(--jb-text)] transition hover:border-[rgba(255,111,177,0.35)] hover:bg-white/[0.11]"
          >
            <span aria-hidden>{artist.emoji}</span>
            {artist.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
