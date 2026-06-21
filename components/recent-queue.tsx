"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import { useSongPlayback } from "@/hooks/use-song-playback";
import { getMemberBySlug } from "@/data/members";
import { members } from "@/data/members";
import type { Song } from "@/data/songs";
import { songs as allSongs } from "@/data/songs";
import { isSpotlightSong } from "@/lib/featured-rotation";
import { cn } from "@/lib/utils";

type RecentQueueProps = {
  songs: Song[];
  familyQueue: Song[];
};

function QueueBadge({ song }: { song: Song }) {
  if (isSpotlightSong(song)) {
    return (
      <span className="rounded-full bg-family-accent px-2 py-1.5 text-[11px] font-black text-[#1a0812]">
        Spotlight
      </span>
    );
  }
  if (song.videoSrc) {
    return (
      <span className="rounded-full bg-[rgba(108,183,255,0.25)] px-2 py-1.5 text-[11px] font-black text-[var(--family-ocean)]">
        Video
      </span>
    );
  }
  return (
    <span className="rounded-full bg-white/10 px-2 py-1.5 text-[11px] font-black text-[var(--jb-muted)]">
      New
    </span>
  );
}

function QueueRow({ song, playlist }: { song: Song; playlist: Song[] }) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, { playlist });
  const author = getMemberBySlug(song.authorSlug);

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_44px_1fr_auto] items-center gap-3 rounded-2xl border p-2 transition hover:bg-white/[0.08]",
        isCurrent
          ? "border-[rgba(255,111,177,0.35)] bg-white/[0.07]"
          : "border-white/[0.045] bg-white/[0.045]",
      )}
    >
      <PlayIconButton
        size="sm"
        playing={playing}
        label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
        onClick={toggle}
      />
      <CoverImage src={song.coverSrc} alt="" className="size-11 rounded-xl" />
      <Link href={`/songs/${song.slug}`} className="min-w-0 text-left">
        <strong
          className={cn(
            "block truncate text-sm",
            isCurrent && "text-[var(--family-pink)]",
          )}
        >
          {song.title}
        </strong>
        <span className="block truncate text-xs text-[var(--jb-muted)]">
          {author?.name} · {song.tags.slice(0, 3).join(" · ")}
        </span>
      </Link>
      <div className="hidden sm:block">
        <QueueBadge song={song} />
      </div>
    </div>
  );
}

export function RecentQueue({ songs, familyQueue }: RecentQueueProps) {
  const { playQueue } = usePlayer();
  const recent = [...songs].slice(0, 5);
  const videoCount = allSongs.filter((s) => s.videoSrc).length;

  return (
    <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-[22px] lg:mt-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">Recently added</h2>
              <p className="text-sm font-bold text-[var(--jb-muted)]">
                Start one track and this queue keeps the music going.
              </p>
            </div>
            {recent.length > 1 ? (
              <button
                type="button"
                onClick={() => playQueue(recent, 0)}
                className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-bold [-webkit-tap-highlight-color:transparent]"
              >
                Play list
              </button>
            ) : null}
          </div>
          <div className="grid gap-2">
            {recent.map((song) => (
              <QueueRow key={song.slug} song={song} playlist={recent} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">Family mix</h2>
            <p className="text-sm font-bold text-[var(--jb-muted)]">
              A quick snapshot of what&apos;s in the jukebox.
            </p>
          </div>
          <div className="min-h-[188px] rounded-[22px] border border-white/[0.08] bg-gradient-to-br from-white/[0.11] to-white/[0.04] p-4">
            <h3 className="text-xl font-bold">This week&apos;s vibe</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--jb-muted)]">
              Bright, playful, and memory-first. Browse by artist, relive favorite moments, and
              keep every anthem in one easy place.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              <span className="rounded-full bg-family-accent px-3 py-2 text-[13px] font-extrabold text-[#1a0812]">
                {allSongs.length} songs
              </span>
              <span className="rounded-full border border-white/[0.09] bg-white/[0.07] px-3 py-2 text-[13px] font-extrabold text-[var(--family-ocean)]">
                {videoCount} videos
              </span>
              <span className="rounded-full border border-white/[0.09] bg-white/[0.07] px-3 py-2 text-[13px] font-extrabold text-[var(--family-pink)]">
                {members.length} artists
              </span>
            </div>
            <button
              type="button"
              onClick={() => playQueue(familyQueue, 0)}
              className="mt-4 inline-flex min-h-11 items-center rounded-full bg-family-accent px-4 py-2.5 text-sm font-black text-[#1a0812] [-webkit-tap-highlight-color:transparent]"
            >
              Play family mix
            </button>
            <Link
              href="/family"
              className="mt-3 inline-block text-sm font-bold text-family-glow hover:underline"
            >
              Meet the family →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
