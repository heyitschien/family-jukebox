"use client";

import Link from "next/link";

import { ArtistLink } from "@/components/artist-link";
import { CoverImage } from "@/components/cover-image";
import { NewReleaseBadge } from "@/components/new-release-badge";
import { PlayIconButton } from "@/components/play-icon-button";
import { SongFavoriteButton } from "@/components/song-favorite-button";
import { useSongPlayback } from "@/hooks/use-song-playback";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { isCelebrationSong } from "@/lib/celebrations";
import { cn } from "@/lib/utils";

type HomeSongStripProps = {
  songs: Song[];
  pickLabel?: (song: Song) => string | undefined;
};

function HomeSongStripCard({
  song,
  playlist,
  pickLabel,
}: {
  song: Song;
  playlist: Song[];
  pickLabel?: (song: Song) => string | undefined;
}) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, { playlist, source: "shelf" });
  const author = getMemberBySlug(song.authorSlug);
  const customLabel = pickLabel?.(song);

  return (
    <article
      className={cn(
        "group relative w-[148px] shrink-0 snap-start rounded-[20px] border p-2.5 transition hover:-translate-y-0.5 sm:w-[168px]",
        isCurrent
          ? "border-[rgba(255,111,177,0.35)] bg-white/[0.09]"
          : "border-white/[0.06] bg-white/[0.055] hover:bg-white/[0.09]",
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-gradient-to-br from-[#314155] to-[#14202c] shadow-[0_16px_30px_rgba(0,0,0,0.22)]">
        <CoverImage src={song.coverSrc} alt="" className="size-full" />
        <SongFavoriteButton
          songSlug={song.slug}
          songTitle={song.title}
          size="sm"
          className="absolute left-2 top-2 bg-black/55"
        />
        {isCelebrationSong(song) ? (
          <span className="absolute right-2 top-2 rounded-full bg-family-accent px-2 py-0.5 text-[10px] font-black text-[#1a0812]">
            Celebration
          </span>
        ) : (
          <NewReleaseBadge song={song} className="absolute right-2 top-2" />
        )}
        <PlayIconButton
          size="sm"
          playing={playing}
          label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
          onClick={toggle}
          className="absolute right-2 bottom-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        />
      </div>
      <Link href={`/songs/${song.slug}`} className="mt-3 block min-w-0">
        <h3
          className={cn(
            "truncate text-sm font-bold tracking-tight sm:text-[15px]",
            isCurrent && "text-[var(--family-pink)]",
          )}
        >
          {song.title}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[35px] text-xs leading-snug text-[var(--jb-muted)] sm:text-[13px]">
          {customLabel ?? (
            <>
              {author ? (
                <ArtistLink member={author} className="text-[var(--jb-muted)] hover:text-white" />
              ) : (
                "Family"
              )}
              {" · family song"}
            </>
          )}
        </p>
      </Link>
    </article>
  );
}

export function HomeSongStrip({ songs, pickLabel }: HomeSongStripProps) {
  if (songs.length === 0) return null;

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none sm:gap-3.5">
      {songs.map((song) => (
        <HomeSongStripCard key={song.slug} song={song} playlist={songs} pickLabel={pickLabel} />
      ))}
    </div>
  );
}
