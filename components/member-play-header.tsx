"use client";

import { PlayButton } from "@/components/play-button";
import { SongRow } from "@/components/song-row";
import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

import { buildArtistQueueContext } from "@/lib/queue-context";

type MemberPlayHeaderProps = {
  songs: Song[];
  memberName: string;
  memberSlug: string;
};

export function MemberPlayHeader({ songs, memberName, memberSlug }: MemberPlayHeaderProps) {
  const { playQueue } = usePlayer();
  const artistContext = buildArtistQueueContext(memberSlug, memberName);

  if (songs.length === 0) return null;

  return (
    <PlayButton
      size="lg"
      label={`Play ${memberName}`}
      onClick={() => playQueue(songs, 0, "shelf", artistContext)}
    />
  );
}

export function MemberSongList({
  songs,
  memberSlug,
  memberName,
}: {
  songs: Song[];
  memberSlug: string;
  memberName: string;
}) {
  const artistContext = buildArtistQueueContext(memberSlug, memberName);

  return (
    <div className="grid gap-2">
      {songs.map((song, i) => (
        <SongRow
          key={song.slug}
          song={song}
          index={i}
          showIndex
          playlist={songs}
          queueContext={artistContext}
        />
      ))}
    </div>
  );
}
