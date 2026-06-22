"use client";

import Link from "next/link";

import { PlayIconButton } from "@/components/play-icon-button";
import { SongFavoriteButton } from "@/components/song-favorite-button";
import { usePlayer } from "@/contexts/player-context";
import { useSongPlayback } from "@/hooks/use-song-playback";
import type { Album } from "@/data/albums";
import type { Song } from "@/data/songs";

type SongDetailActionsProps = {
  song: Song;
  queue: Song[];
  albumQueue?: Song[];
  parentAlbum?: Album;
};

export function SongDetailActions({
  song,
  queue,
  albumQueue,
  parentAlbum,
}: SongDetailActionsProps) {
  const { playQueue } = usePlayer();
  const { playing, toggle } = useSongPlayback(song, { singleOnly: true, source: "detail" });
  const playAlbumQueue = albumQueue ?? queue;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <PlayIconButton
        size="lg"
        playing={playing}
        label={playing ? "Pause" : `Play ${song.title}`}
        onClick={toggle}
      />
      <SongFavoriteButton songSlug={song.slug} songTitle={song.title} size="lg" />
      {parentAlbum ? (
        <button
          type="button"
          onClick={() =>
            playQueue(
              playAlbumQueue,
              playAlbumQueue.findIndex((s) => s.slug === song.slug),
              "detail",
            )
          }
          className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black [-webkit-tap-highlight-color:transparent]"
        >
          Play album
        </button>
      ) : (
        <button
          type="button"
          onClick={() => playQueue(queue, queue.findIndex((s) => s.slug === song.slug), "detail")}
          className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black [-webkit-tap-highlight-color:transparent]"
        >
          Play artist mix
        </button>
      )}
      {parentAlbum ? (
        <Link
          href={`/albums/${parentAlbum.slug}`}
          className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#050608]"
        >
          View album
        </Link>
      ) : (
        <Link
          href={`/members/${song.authorSlug}`}
          className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#050608]"
        >
          View artist
        </Link>
      )}
    </div>
  );
}
