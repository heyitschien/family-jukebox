import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { SongDetailActions } from "@/components/song-detail-actions";
import { SongVideo } from "@/components/song-video";
import { Topbar } from "@/components/topbar";
import { getAlbumForSong, getAlbumSongs } from "@/data/albums";
import { getSongAuthor, getSongBySlug, getSongsByAuthor, songs } from "@/data/songs";
import { isSpotlightSong } from "@/lib/featured-rotation";

import { buildShareMetadata } from "@/lib/site-metadata";

type SongPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return songs.map((song) => ({ slug: song.slug }));
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  if (!song) return { title: "Song not found · Family Jukebox" };
  return buildShareMetadata({
    title: `${song.title} · Family Jukebox`,
    description: song.subtitle ?? "A family song worth replaying.",
  });
}

export default async function SongPage({ params }: SongPageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  if (!song) notFound();

  const author = getSongAuthor(song);
  const artistQueue = getSongsByAuthor(song.authorSlug);
  const parentAlbum = getAlbumForSong(song);
  const albumQueue = parentAlbum ? getAlbumSongs(parentAlbum) : artistQueue;

  return (
    <main className="min-w-0 px-3 pb-4 lg:px-0">
      <Topbar />

      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--jb-muted)] hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <section className="mx-auto max-w-md text-center">
        <CoverImage
          src={song.coverSrc}
          alt={`${song.title} cover`}
          className="mx-auto aspect-square w-full max-w-sm rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        />
        <p className="mt-6 text-xs font-extrabold uppercase tracking-wider text-[var(--jb-muted)]">
          {isSpotlightSong(song) ? "Today’s spotlight · " : ""}Family song
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{song.title}</h1>
        {parentAlbum ? (
          <Link
            href={`/albums/${parentAlbum.slug}`}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--family-pink)] hover:underline"
          >
            From {parentAlbum.title}
          </Link>
        ) : null}
        {author ? (
          <Link
            href={`/members/${author.slug}`}
            className="mt-2 inline-block text-lg font-bold text-[var(--jb-muted)] hover:text-white hover:underline"
          >
            {author.name}
          </Link>
        ) : null}
        {song.subtitle ? (
          <p className="mt-3 text-sm leading-relaxed text-[var(--jb-muted)]">{song.subtitle}</p>
        ) : null}

        <div className="mt-6 flex justify-center">
          <SongDetailActions song={song} queue={artistQueue} albumQueue={albumQueue} parentAlbum={parentAlbum} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--jb-muted)]">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {song.dateCreated}
          </span>
          {song.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/[0.09] bg-white/[0.07] px-2.5 py-1 font-extrabold"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {song.videoSrc ? (
        <section className="mx-auto mt-8 max-w-lg rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4">
          <h2 className="mb-3 text-lg font-bold">Music video</h2>
          <SongVideo videoSrc={song.videoSrc} title={song.title} />
        </section>
      ) : null}

      <div className="mx-auto mt-6 max-w-lg space-y-4">
        {song.story ? (
          <section className="rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-5">
            <h2 className="text-lg font-bold">Family memory</h2>
            <p className="mt-2 leading-relaxed text-[var(--jb-muted)]">{song.story}</p>
          </section>
        ) : null}
        {song.prompt ? (
          <section className="rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-5">
            <h2 className="text-lg font-bold">Prompt</h2>
            <p className="mt-2 leading-relaxed text-[var(--jb-muted)]">{song.prompt}</p>
          </section>
        ) : null}
        {song.lyrics ? (
          <section className="rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-5">
            <h2 className="text-lg font-bold">Lyrics</h2>
            <p className="mt-1 text-xs text-[var(--jb-muted)]">
              Transcribed from the recording — close to the song, but not always word-perfect.
            </p>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--jb-muted)]">
              {song.lyrics}
            </pre>
          </section>
        ) : null}
      </div>
    </main>
  );
}
