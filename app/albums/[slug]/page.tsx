import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AlbumPlayHeader } from "@/components/album-play-header";
import { AlbumShelf } from "@/components/album-shelf";
import { CoverImage } from "@/components/cover-image";
import { DiscoverMembersShelf } from "@/components/discover-members-shelf";
import { SongShelf } from "@/components/song-shelf";
import { SongRow } from "@/components/song-row";
import { Topbar } from "@/components/topbar";
import {
  albums,
  getAlbumAuthor,
  getAlbumBySlug,
  getAlbumKindLabel,
  getAlbumSongs,
  getAlbumTrackCount,
} from "@/data/albums";
import { buildCoverShareImage, buildShareMetadata } from "@/lib/site-metadata";
import {
  getDiscoverAlbums,
  getDiscoverMembers,
  getRelatedAlbums,
  getSimilarSongsForAlbum,
} from "@/lib/music-discovery";

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
    title: album.title,
    description: album.subtitle ?? "A family album worth replaying.",
    path: `/albums/${album.slug}`,
    image: buildCoverShareImage(album.title, album.coverSrc),
  });
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();

  const author = getAlbumAuthor(album);
  const albumSongs = getAlbumSongs(album);
  const trackCount = getAlbumTrackCount(album);
  const relatedAlbums = getRelatedAlbums(album);
  const discoverAlbums = getDiscoverAlbums([album.slug, ...relatedAlbums.map((entry) => entry.slug)]);
  const similarSongs = getSimilarSongsForAlbum(album, albumSongs);
  const discoverMembers = getDiscoverMembers(album.authorSlug);

  return (
    <main className="min-w-0 max-w-full overflow-x-hidden px-3 pb-4 lg:px-0">
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

      <section className="mt-6 max-w-full overflow-hidden rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
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
        <AlbumShelf
          albums={relatedAlbums}
          title={`More from ${author?.name ?? "this artist"}`}
          subtitle="Other albums by the same cousin — tap to explore or play"
          showViewAll={false}
        />
      ) : null}

      {similarSongs.length > 0 ? (
        <SongShelf
          songs={similarSongs}
          title="Similar vibes"
          subtitle="Songs from other family artists with a matching mood"
          viewAllHref="/songs"
          viewAllLabel="Browse songs"
        />
      ) : null}

      {discoverAlbums.length > 0 ? (
        <AlbumShelf
          albums={discoverAlbums}
          title="More family albums"
          subtitle="Keep exploring — one tap to another cousin's collection"
          showViewAll
        />
      ) : null}

      <DiscoverMembersShelf members={discoverMembers} />

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
