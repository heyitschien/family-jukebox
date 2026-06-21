import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { MemberPlayHeader } from "@/components/member-play-header";
import { SongRow } from "@/components/song-row";
import { Topbar } from "@/components/topbar";
import { albums, getAlbumBySlug, getAlbumCreator, getAlbumSongs, getAlbumTags } from "@/data/albums";
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

  if (!album) {
    return { title: "Album not found · Family Jukebox" };
  }

  return buildShareMetadata({
    title: `${album.title} album`,
    description: album.subtitle,
  });
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);

  if (!album) {
    notFound();
  }

  const creator = getAlbumCreator(album);
  const albumSongs = getAlbumSongs(album);
  const albumTags = getAlbumTags(album);

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
        className="relative overflow-hidden rounded-[32px] border border-white/[0.08] p-5 sm:p-7"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7,12,16,0.1) 0%, ${album.palette.surface} 76%), url(${album.coverSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div
          className="pointer-events-none absolute -left-16 top-12 h-48 w-48 rounded-full blur-3xl"
          style={{ backgroundColor: album.palette.glow }}
        />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-end">
          <CoverImage
            src={album.coverSrc}
            alt={`${album.title} cover`}
            className="aspect-square w-full max-w-[280px] rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.42)]"
          />

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/65">{album.kind}</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">{album.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/76 sm:text-base">
              {album.subtitle}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-bold text-white/68">
              <span>{album.releaseDate}</span>
              <span>•</span>
              <span>
                {albumSongs.length} {albumSongs.length === 1 ? "track" : "tracks"}
              </span>
              {creator ? (
                <>
                  <span>•</span>
                  <Link href={`/members/${creator.slug}`} className="text-white hover:underline">
                    {creator.name}
                  </Link>
                </>
              ) : null}
            </div>

            <div className="mt-6">
              <MemberPlayHeader songs={albumSongs} memberName={album.title} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {albumTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-black text-white/76"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
        <h2 className="text-xl font-bold">Track list</h2>
        <p className="mt-1 text-sm text-[var(--jb-muted)]">
          Play from the top and the album continues in track order.
        </p>

        <div className="mt-4 grid gap-2">
          {albumSongs.map((song, index) => (
            <SongRow
              key={song.slug}
              song={song}
              index={index}
              showIndex
              playlist={albumSongs}
            />
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-5">
        <h2 className="text-lg font-bold">About this release</h2>
        <p className="mt-3 leading-relaxed text-[var(--jb-muted)]">{album.description}</p>
      </section>
    </main>
  );
}
