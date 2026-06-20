"use client";

import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";
import { songs as allSongs } from "@/data/songs";

type HeroSectionProps = {
  featured: Song;
};

export function HeroSection({ featured }: HeroSectionProps) {
  const { playSong, playQueue } = usePlayer();

  return (
    <section
      className="relative -mx-3 flex min-h-[430px] items-end overflow-hidden rounded-b-[34px] border border-white/[0.08] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:mx-0 sm:min-h-[360px] sm:rounded-[32px] sm:p-[34px] lg:min-h-[360px]"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(7,12,16,0.96) 0%, rgba(7,12,16,0.76) 46%, rgba(7,12,16,0.12) 100%), url(${featured.coverSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 max-w-3xl">
        <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[rgba(30,215,96,0.28)] bg-[rgba(30,215,96,0.12)] px-3 py-2 text-[13px] font-extrabold text-[#bafbd2]">
          ✨ Cousin Radio · Summer 2026
        </span>
        <h1 className="text-[clamp(48px,12vw,92px)] leading-[0.88] font-extrabold tracking-[-0.075em]">
          Family Jukebox
        </h1>
        <p className="mt-4 max-w-[590px] text-base leading-relaxed text-[var(--jb-muted)] sm:text-lg">
          A polished little web app for the songs we made together — silly fox trails, gravity
          shifts, pink glasses, pixels into magic, and every family anthem in one place.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => playSong(featured)}
            className="grid size-[62px] place-items-center rounded-full bg-[var(--jb-green)] text-[26px] text-[#041008] shadow-[0_18px_40px_rgba(30,215,96,0.32)] transition hover:scale-105 active:scale-95"
            aria-label="Play featured song"
          >
            ▶
          </button>
          <button
            type="button"
            onClick={() => playQueue(allSongs, 0)}
            className="rounded-full bg-[var(--jb-text)] px-5 py-4 text-sm font-black text-[#050608]"
          >
            Play featured mix
          </button>
          <a
            href="https://github.com/heyitschien/family-jukebox/blob/main/docs/ADDING_SONGS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 bg-white/10 px-5 py-4 text-sm font-black text-[var(--jb-text)]"
          >
            Add new song
          </a>
        </div>
      </div>
    </section>
  );
}
