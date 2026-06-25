"use client";

import Link from "next/link";
import { ListMusic } from "lucide-react";

import { ArtistLink } from "@/components/artist-link";
import { CoverImage } from "@/components/cover-image";
import { PlaybackProgressBar } from "@/components/playback-progress-bar";
import { PlayIconButton } from "@/components/play-icon-button";
import { SongFavoriteButton } from "@/components/song-favorite-button";
import { formatTime, usePlayer } from "@/contexts/player-context";
import { getMemberBySlug } from "@/data/members";
import { cn } from "@/lib/utils";

export function NowPlayingScreen() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    skipNext,
    skipPrev,
    queue,
    queueContext,
    currentTime,
    duration,
    seek,
    playQueue,
  } = usePlayer();

  if (!currentSong) {
    return (
      <main className="min-w-0 px-3 pb-28 lg:px-0">
        <header className="mb-6 px-1 pt-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Now playing</h1>
          <p className="mt-2 text-sm text-[var(--jb-muted)]">Start a song to see the queue here.</p>
        </header>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full bg-family-accent px-5 py-2.5 text-sm font-black text-[#1a0812]"
        >
          Browse songs
        </Link>
      </main>
    );
  }

  const author = getMemberBySlug(currentSong.authorSlug);

  const jumpToTrack = (index: number) => {
    playQueue(queue, index, "mini-player", queueContext ?? undefined);
  };

  return (
    <main className="min-w-0 px-3 pb-36 lg:px-0">
      <header className="mb-5 px-1 pt-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--jb-muted-2)]">
          Now playing
        </p>
        {queueContext ? (
          <Link
            href={queueContext.href}
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-family-glow hover:text-white"
          >
            <ListMusic className="size-3.5" aria-hidden />
            From {queueContext.label}
          </Link>
        ) : null}
      </header>

      <section className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
          <CoverImage src={currentSong.coverSrc} alt="" className="aspect-square w-full" />
        </div>

        <div className="mt-5 text-center">
          <Link
            href={`/songs/${currentSong.slug}`}
            className="block text-2xl font-extrabold tracking-tight hover:text-family-glow"
          >
            {currentSong.title}
          </Link>
          <p className="mt-1 text-sm text-[var(--jb-muted)]">
            {author ? (
              <ArtistLink member={author} className="text-[var(--jb-muted)] hover:text-white" />
            ) : (
              "Family"
            )}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <SongFavoriteButton songSlug={currentSong.slug} songTitle={currentSong.title} size="lg" />
          <PlayIconButton
            size="lg"
            variant="light"
            playing={isPlaying}
            label="Toggle playback"
            onClick={togglePlay}
          />
        </div>

        <div className="mt-5 flex items-center gap-2.5 text-[11px] tabular-nums text-[var(--jb-muted-2)]">
          <span>{formatTime(currentTime)}</span>
          <PlaybackProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
            className="h-[5px] flex-1 py-3"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </section>

      {queue.length > 1 ? (
        <QueueList
          queue={queue}
          currentSlug={currentSong.slug}
          onSelect={jumpToTrack}
        />
      ) : null}

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={skipPrev}
          className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 text-sm font-bold"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={skipNext}
          className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 text-sm font-bold"
        >
          Next
        </button>
      </div>
    </main>
  );
}

function QueueList({
  queue,
  currentSlug,
  onSelect,
}: {
  queue: ReturnType<typeof usePlayer>["queue"];
  currentSlug: string;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 px-1 text-sm font-bold uppercase tracking-[0.14em] text-[var(--jb-muted-2)]">
        Up next · {queue.length} songs
      </h2>
      <ol className="overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.03]">
        {queue.map((song, index) => {
          const rowAuthor = getMemberBySlug(song.authorSlug);
          const active = song.slug === currentSlug;

          return (
            <li key={song.slug}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  "flex w-full min-w-0 items-center gap-3 px-3 py-2.5 text-left transition",
                  active ? "bg-white/[0.08]" : "hover:bg-white/[0.05]",
                )}
              >
                <span
                  className={cn(
                    "w-5 shrink-0 text-center text-[11px] tabular-nums",
                    active ? "text-family-glow" : "text-[var(--jb-muted-2)]",
                  )}
                >
                  {active ? "♪" : index + 1}
                </span>
                <CoverImage src={song.coverSrc} alt="" className="size-10 shrink-0 rounded-[10px]" />
                <div className="min-w-0 flex-1 overflow-hidden">
                  <strong
                    className={cn(
                      "block truncate text-sm font-semibold",
                      active && "text-[var(--family-pink)]",
                    )}
                  >
                    {song.title}
                  </strong>
                  <span className="block truncate text-xs text-[var(--jb-muted)]">
                    {rowAuthor?.name ?? "Family"}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
