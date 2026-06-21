import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AlbumPlayHeader } from "@/components/album-play-header";
import { CoverImage } from "@/components/cover-image";
import { SongRow } from "@/components/song-row";
import { Topbar } from "@/components/topbar";
import { albums, getAlbumBySlug, getAlbumSongs } from "@/data/albums";
import { getMemberBySlug } from "@/data/members";
import { buildShareMetadata } from "@/lib/site-metadata";

type AlbumPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return albums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) return { title: "Album not found · Family Jukebox" };
  const artist = getMemberBySlug(album.artistSlug);

  return buildShareMetadata({
    title: `${album.title} · Family Jukebox`,
    description: `${artist?.name ?? "Family"} album with ${album.songSlugs.length} tracks.`,
  });
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();

  const artist = getMemberBySlug(album.artistSlug);
  const tracks = getAlbumSongs(album);

  return (
    <main className="min-w-0 px-3 pb-4 lg:px-0">
      <Topbar />

      <Link
        href="/albums"
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--jb-muted)] hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to albums
      </Link>

      <section
        className="overflow-hidden rounded-[30px] border border-white/[0.08] p-5 sm:p-7"
        style={{
          background: `linear-gradient(140deg, ${album.accentFrom}55 0%, ${album.accentTo}26 52%, rgba(9,12,16,0.8) 100%)`,
        }}
      >
        <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-end">
          <CoverImage
            src={album.coverSrc}
            alt={`${album.title} cover`}
            className="aspect-square w-full max-w-[220px] rounded-[18px] shadow-[0_20px_48px_rgba(0,0,0,0.4)]"
          />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--jb-muted)]">Album</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{album.title}</h1>
            <p className="mt-2 text-sm font-bold text-[var(--jb-muted)]">
              {artist?.name ?? "Family"} · {tracks.length} {tracks.length === 1 ? "track" : "tracks"} ·{" "}
              {album.releaseDate}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--jb-muted)]">{album.subtitle}</p>
            <div className="mt-5">
              <AlbumPlayHeader songs={tracks} albumTitle={album.title} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-bold">Tracks</h2>
          {artist ? (
            <Link
              href={`/members/${artist.slug}`}
              className="text-sm font-bold text-[var(--jb-muted)] hover:text-white hover:underline"
            >
              View {artist.name}
            </Link>
          ) : null}
        </div>
        <div className="grid gap-2">
          {tracks.map((song, index) => (
            <SongRow key={song.slug} song={song} index={index} showIndex playlist={tracks} />
          ))}
        </div>
      </section>
    </main>
  );
}
