"use client";

import { PlayButton } from "@/components/play-button";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { SongRow } from "@/components/song-row";
import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";
import { filterSongsForAudience } from "@/lib/audience";

type MemberPlayHeaderProps = {
  songs: Song[];
  memberName: string;
};

export function MemberPlayHeader({ songs, memberName }: MemberPlayHeaderProps) {
  const { playQueue } = usePlayer();
  const { audienceId } = useFamilyAudienceContext();
  const visibleSongs = audienceId ? filterSongsForAudience(songs, audienceId) : songs;

  if (visibleSongs.length === 0) return null;

  return (
    <PlayButton
      size="lg"
      label={`Play ${memberName}`}
      onClick={() => playQueue(visibleSongs, 0, "shelf")}
    />
  );
}

export function MemberSongList({ songs }: { songs: Song[] }) {
  const { audienceId } = useFamilyAudienceContext();
  const visibleSongs = audienceId ? filterSongsForAudience(songs, audienceId) : songs;

  return (
    <div className="grid gap-2">
      {visibleSongs.map((song, i) => (
        <SongRow key={song.slug} song={song} index={i} showIndex playlist={visibleSongs} />
      ))}
    </div>
  );
}
