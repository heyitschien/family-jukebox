import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { DiscoverMembersShelf } from "@/components/discover-members-shelf";
import { SongDetailActions } from "@/components/song-detail-actions";
import { SongPlayCount } from "@/components/song-play-count";
import { SongShelf } from "@/components/song-shelf";
import { SongVideo } from "@/components/song-video";
import { Topbar } from "@/components/topbar";
import { getAlbumForSong, getAlbumSongs } from "@/data/albums";
import { getSongAuthor, getSongBySlug, getSongsByAuthor, songs } from "@/data/songs";
import { isSpotlightSong } from "@/lib/featured-rotation";
import {
  getDiscoverMembers,
  getDiscoverSongs,
  getMoreFromAlbum,
  getMoreFromArtist,
  getSimilarSongs,
} from "@/lib/music-discovery";

import {
  buildCoverShareImage,
  buildShareMetadata,
  buildSongShareDescription,
  formatPageTitle,
} from "@/lib/site-metadata";
import { getCopyrightRecordBySlug } from "@/lib/copyright-registry";
import { SongCopyrightNotice } from "@/components/song-copyright-notice";

type SongPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return songs.map((song) => ({ slug: song.slug }));
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  if (!song) return { title: formatPageTitle("Song not found") };
  const author = getSongAuthor(song);
  return buildShareMetadata({
    title: formatPageTitle(song.title),
    description: buildSongShareDescription(song, author),
    path: `/songs/${song.slug}`,
    image: buildCoverShareImage(song.title, song.coverSrc),
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
  const moreFromArtist = getMoreFromArtist(song);
  const moreFromAlbum = parentAlbum ? getMoreFromAlbum(song, albumQueue) : [];
  const similarSongs =
    getSimilarSongs(song).length > 0
      ? getSimilarSongs(song)
      : getDiscoverSongs([song.slug, ...moreFromArtist.map((entry) => entry.slug)], 6);
  const discoverMembers = getDiscoverMembers(song.authorSlug);
  const copyrightRecord = getCopyrightRecordBySlug(song.slug);

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
          <SongPlayCount songSlug={song.slug} />
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
        <section className="mx-auto mt-8 max-w-lg jb-float-panel p-4">
          <h2 className="mb-3 text-lg font-bold">Music video</h2>
          <SongVideo videoSrc={song.videoSrc} title={song.title} />
        </section>
      ) : null}

      <div className="mx-auto mt-6 max-w-lg space-y-4">
        {song.story ? (
          <section className="jb-float-panel p-5">
            <h2 className="text-lg font-bold">Family memory</h2>
            <p className="mt-2 leading-relaxed text-[var(--jb-muted)]">{song.story}</p>
          </section>
        ) : null}
        {song.prompt ? (
          <section className="jb-float-panel p-5">
            <h2 className="text-lg font-bold">Prompt</h2>
            <p className="mt-2 leading-relaxed text-[var(--jb-muted)]">{song.prompt}</p>
          </section>
        ) : null}
        {song.lyrics ? (
          <section className="jb-float-panel p-5">
            <h2 className="text-lg font-bold">Lyrics</h2>
            <p className="mt-1 text-xs text-[var(--jb-muted)]">
              Transcribed from the recording — close to the song, but not always word-perfect.
            </p>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--jb-muted)]">
              {song.lyrics}
            </pre>
          </section>
        ) : null}
        {copyrightRecord ? <SongCopyrightNotice record={copyrightRecord} /> : null}
      </div>

      {moreFromAlbum.length > 0 && parentAlbum ? (
        <div className="mx-auto mt-6 max-w-lg">
          <SongShelf
            songs={moreFromAlbum}
            title={`More from ${parentAlbum.title}`}
            subtitle="Other tracks on this album"
            viewAllHref={`/albums/${parentAlbum.slug}`}
            viewAllLabel="View album"
            compact
          />
        </div>
      ) : null}

      {moreFromArtist.length > 0 && author ? (
        <div className="mx-auto mt-4 max-w-lg">
          <SongShelf
            songs={moreFromArtist}
            title={`More from ${author.name}`}
            subtitle="Keep listening to this cousin's catalog"
            viewAllHref={`/members/${author.slug}`}
            viewAllLabel="View artist"
            compact
          />
        </div>
      ) : null}

      {similarSongs.length > 0 ? (
        <div className="mx-auto mt-4 max-w-lg">
          <SongShelf
            songs={similarSongs}
            title="Similar vibes"
            subtitle="Songs from other family artists you might like"
            viewAllHref="/songs"
            viewAllLabel="Browse songs"
            compact
          />
        </div>
      ) : null}

      <div className="mx-auto mt-4 max-w-lg">
        <DiscoverMembersShelf members={discoverMembers} />
      </div>
    </main>
  );
}
