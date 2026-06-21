"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import { getAlbumForSong } from "@/data/albums";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { useSongPlayback } from "@/hooks/use-song-playback";
import { cn } from "@/lib/utils";

type SongRailProps = {
  songs: Song[];
  title: string;
  subtitle?: string;
  playAllLabel?: string;
  className?: string;
};

function SongRailCard({ song, playlist }: { song: Song; playlist: Song[] }) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, { playlist });
  const author = getMemberBySlug(song.authorSlug);
  const album = getAlbumForSong(song);

  return (
    <article
      className={cn(
        "group w-52 shrink-0 rounded-[22px] border border-white/[0.07] bg-white/[0.05] p-3 transition hover:-translate-y-0.5 hover:bg-white/[0.08]",
        isCurrent && "border-[rgba(255,111,177,0.35)] bg-white/[0.08]",
      )}
    >
      <div className="relative">
        <Link href={`/songs/${song.slug}`} className="block">
          <CoverImage
            src={song.coverSrc}
            alt=""
            className="aspect-square w-full rounded-[18px] shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
          />
        </Link>
        <PlayIconButton
          size="sm"
          playing={playing}
          label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
          onClick={toggle}
          className="absolute right-2 bottom-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        />
      </div>

      <div className="mt-3 min-w-0">
        <Link
          href={`/songs/${song.slug}`}
          className={cn(
            "block truncate text-sm font-bold hover:underline",
            isCurrent && "text-[var(--family-pink)]",
          )}
        >
          {song.title}
        </Link>
        <p className="mt-1 line-clamp-2 min-h-[40px] text-xs leading-relaxed text-[var(--jb-muted)]">
          {song.subtitle ?? "Family song worth a replay."}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-bold text-[var(--jb-muted)]">
          {author ? (
            <Link
              href={`/members/${author.slug}`}
              className="rounded-full border border-white/[0.08] bg-white/[0.06] px-2 py-1 hover:text-white hover:underline"
            >
              {author.name}
            </Link>
          ) : null}
          {album ? (
            <Link href={`/albums/${album.slug}`} className="hover:text-white hover:underline">
              {album.title}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function SongRail({
  songs,
  title,
  subtitle,
  playAllLabel = "Play all",
  className,
}: SongRailProps) {
  const { playQueue } = usePlayer();

  if (songs.length === 0) return null;

  return (
    <section
      className={cn(
        "rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{subtitle}</p> : null}
        </div>
        {songs.length > 1 ? (
          <button
            type="button"
            onClick={() => playQueue(songs, 0)}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-bold [-webkit-tap-highlight-color:transparent]"
          >
            {playAllLabel}
          </button>
        ) : null}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
        {songs.map((song) => (
          <SongRailCard key={song.slug} song={song} playlist={songs} />
        ))}
      </div>
    </section>
  );
}
