"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { usePlayer } from "@/contexts/player-context";
import { getMemberBySlug } from "@/data/members";
import { members } from "@/data/members";
import type { Song } from "@/data/songs";
import { songs as allSongs } from "@/data/songs";
import { isSpotlightSong } from "@/lib/featured-rotation";

type RecentQueueProps = {
  songs: Song[];
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

export function RecentQueue({ songs }: RecentQueueProps) {
  const { playSong } = usePlayer();
  const recent = [...songs].slice(0, 5);
  const videoCount = allSongs.filter((s) => s.videoSrc).length;

  return (
    <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-[22px] lg:mt-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4">
            <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">Recently added</h2>
            <p className="text-sm font-bold text-[var(--jb-muted)]">
              Keep the page feeling like an app, not a folder dump.
            </p>
          </div>
          <div className="grid gap-2">
            {recent.map((song) => {
              const author = getMemberBySlug(song.authorSlug);
              return (
                <button
                  key={song.slug}
                  type="button"
                  onClick={() => playSong(song)}
                  className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl border border-white/[0.045] bg-white/[0.045] p-2 text-left transition hover:bg-white/[0.08] active:bg-white/[0.12]"
                >
                  <CoverImage src={song.coverSrc} alt="" className="size-11 rounded-xl" />
                  <div className="min-w-0">
                    <strong className="block truncate text-sm">{song.title}</strong>
                    <span className="block truncate text-xs text-[var(--jb-muted)]">
                      {author?.name} · {song.tags.slice(0, 3).join(" · ")}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <QueueBadge song={song} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">Family mix</h2>
            <p className="text-sm font-bold text-[var(--jb-muted)]">One-page summary for everyone.</p>
          </div>
          <div className="min-h-[188px] rounded-[22px] border border-white/[0.08] bg-gradient-to-br from-white/[0.11] to-white/[0.04] p-4">
            <h3 className="text-xl font-bold">This week&apos;s vibe</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--jb-muted)]">
              Playful, colorful, and memory-first. Songs grouped like Spotify shelves — who
              inspired it, what game created it, and why it made us laugh.
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
            <Link
              href="/family"
              className="mt-4 inline-block text-sm font-bold text-family-glow hover:underline"
            >
              Meet the family →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
