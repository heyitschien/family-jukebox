"use client";

import { PlayButton } from "@/components/play-button";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { usePlayer } from "@/contexts/player-context";
import { getAlbumSongs, type Album } from "@/data/albums";
import { filterSongsForAudience } from "@/lib/audience";

type AlbumPlayHeaderProps = {
  album: Album;
};

export function AlbumPlayHeader({ album }: AlbumPlayHeaderProps) {
  const { playQueue } = usePlayer();
  const { audienceId } = useFamilyAudienceContext();
  const songs = audienceId
    ? filterSongsForAudience(getAlbumSongs(album), audienceId)
    : getAlbumSongs(album);

  if (songs.length === 0) return null;

  return (
    <PlayButton
      size="lg"
      label={`Play album`}
      onClick={() => playQueue(songs, 0, "shelf")}
    />
  );
}
