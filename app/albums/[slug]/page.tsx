import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AlbumPlayHeader } from "@/components/album-play-header";
import { CoverImage } from "@/components/cover-image";
import { SongRow } from "@/components/song-row";
import { Topbar } from "@/components/topbar";
import {
  albums,
  getAlbumAuthor,
  getAlbumBySlug,
  getAlbumKindLabel,
  getAlbumsByAuthor,
  getAlbumSongs,
  getAlbumTrackCount,
} from "@/data/albums";
import { getSongsByAuthor, getSongsSimilarToCollection } from "@/data/songs";
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
  return buildShareMetadata({
    title: `${album.title} · Family Jukebox`,
    description: album.subtitle ?? "A family album worth replaying.",
  });
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();

  const author = getAlbumAuthor(album);
  const albumSongs = getAlbumSongs(album);
  const trackCount = getAlbumTrackCount(album);
  const relatedAlbums = getAlbumsByAuthor(album.authorSlug).filter((entry) => entry.slug !== album.slug);
  const artistSongs = getSongsByAuthor(album.authorSlug);
  const moreByArtist = artistSongs.filter((song) => !album.songSlugs.includes(song.slug)).slice(0, 5);
  const similarSongs = getSongsSimilarToCollection(albumSongs, {
    limit: 6,
    excludeAuthorSlug: album.authorSlug,
    excludeSongSlugs: album.songSlugs,
  });

  return (
    <main className="min-w-0 px-3 pb-4 lg:px-0">
      <Topbar />

      <Link
        href="/albums"
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--jb-muted)] hover:text-white"
      >
        <ArrowLeft className="size-4" />
        All albums
      </Link>

      <section
        className="relative overflow-hidden rounded-[32px] border border-white/[0.08] p-6 sm:p-8"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7,12,16,0.15) 0%, rgba(7,12,16,0.92) 65%), url(${album.coverSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundColor: "#17212c",
        }}
      >
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end">
          <CoverImage
            src={album.coverSrc}
            alt={`${album.title} cover`}
            className="mx-auto aspect-square w-full max-w-[220px] rounded-xl shadow-[0_24px_60px_rgba(0,0,0,0.5)] sm:mx-0 sm:max-w-[240px]"
          />
          <div className="min-w-0 flex-1 sm:pb-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--jb-muted)]">
              {getAlbumKindLabel(album)}
              {album.featured ? " · Featured" : ""}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-6xl">{album.title}</h1>
            {author ? (
              <Link
                href={`/members/${author.slug}`}
                className="mt-2 inline-block text-lg font-bold text-[var(--jb-muted)] hover:text-white hover:underline"
              >
                {author.name}
              </Link>
            ) : null}
            <p className="mt-2 text-sm font-bold text-[var(--jb-muted)]">
              {trackCount} {trackCount === 1 ? "song" : "songs"}
              {author && (author.role === "girl" || author.role === "boy") ? ` · age ${author.age}` : ""}
            </p>
            {album.subtitle ? (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--jb-muted)]">
                {album.subtitle}
              </p>
            ) : null}
            <div className="mt-6">
              <AlbumPlayHeader album={album} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
        <h2 className="mb-4 text-xl font-bold">Tracklist</h2>
        {albumSongs.length > 0 ? (
          <div className="grid gap-1">
            {albumSongs.map((song, i) => (
              <SongRow key={song.slug} song={song} index={i} showIndex playlist={albumSongs} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--jb-muted)]">No tracks yet.</p>
        )}
      </section>

      {relatedAlbums.length > 0 ? (
        <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
          <h2 className="text-lg font-bold">More from {author?.name ?? "this artist"}</h2>
          <ul className="mt-3 space-y-2">
            {relatedAlbums.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/albums/${related.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm font-bold hover:bg-white/[0.08]"
                >
                  <span>{related.title}</span>
                  <span className="shrink-0 text-xs font-extrabold uppercase tracking-wide text-[var(--jb-muted)]">
                    {getAlbumKindLabel(related)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {moreByArtist.length > 0 ? (
        <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
          <h2 className="text-lg font-bold">More songs from {author?.name ?? "this artist"}</h2>
          <div className="mt-3 grid gap-2">
            {moreByArtist.map((song) => (
              <SongRow key={song.slug} song={song} playlist={artistSongs} />
            ))}
          </div>
        </section>
      ) : null}

      {similarSongs.length > 0 ? (
        <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
          <h2 className="text-lg font-bold">Keep listening</h2>
          <p className="mt-1 text-sm text-[var(--jb-muted)]">
            Similar tracks from other family artists so the listening never stops.
          </p>
          <div className="mt-3 grid gap-2">
            {similarSongs.map((song) => (
              <SongRow key={song.slug} song={song} playlist={similarSongs} />
            ))}
          </div>
        </section>
      ) : null}

      {album.story ? (
        <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
          <h2 className="text-lg font-bold">About this album</h2>
          <p className="mt-3 leading-relaxed text-[var(--jb-muted)]">{album.story}</p>
          {author ? (
            <Link
              href={`/members/${author.slug}`}
              className="mt-4 inline-block text-sm font-bold text-[var(--family-pink)] hover:underline"
            >
              View {author.name} →
            </Link>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
