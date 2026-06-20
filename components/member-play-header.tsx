"use client";

import { PlayButton } from "@/components/play-button";
import { SongRow } from "@/components/song-row";
import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

type MemberPlayHeaderProps = {
  songs: Song[];
  memberName: string;
};

export function MemberPlayHeader({ songs, memberName }: MemberPlayHeaderProps) {
  const { playQueue } = usePlayer();

  if (songs.length === 0) return null;

  return (
    <PlayButton
      size="lg"
      label={`Play ${memberName}`}
      onClick={() => playQueue(songs, 0)}
    />
  );
}

export function MemberSongList({ songs }: { songs: Song[] }) {
  return (
    <div className="grid gap-2">
      {songs.map((song, i) => (
        <SongRow key={song.slug} song={song} index={i} showIndex queue={songs} />
      ))}
    </div>
  );
}
