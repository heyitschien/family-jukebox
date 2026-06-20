"use client";

import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";
import { getMemberBySlug } from "@/data/members";
import { getFairRotationQueue, getSpotlightAuthorNames } from "@/lib/featured-rotation";
import { PlayIconButton } from "@/components/play-icon-button";
import { useSongPlayback } from "@/hooks/use-song-playback";

type HeroSectionProps = {
  featured: Song;
};

export function HeroSection({ featured }: HeroSectionProps) {
  const { playQueue } = usePlayer();
  const { playing, toggle } = useSongPlayback(featured);
  const author = getMemberBySlug(featured.authorSlug);
  const spotlightNames = getSpotlightAuthorNames();

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
        <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-family-soft bg-family-soft px-3 py-2 text-[13px] font-extrabold text-family-glow">
          ✨ Today&apos;s spotlight · {author?.name ?? "Family"}
        </span>
        <h1 className="text-[clamp(48px,12vw,92px)] leading-[0.88] font-extrabold tracking-[-0.075em]">
          Family Jukebox
        </h1>
        <p className="mt-4 max-w-[590px] text-base leading-relaxed text-[var(--jb-muted)] sm:text-lg">
          A polished little web app for the songs we made together — silly fox trails, gravity
          shifts, pink glasses, pixels into magic, and every family anthem in one place.
        </p>
        <p className="mt-2 text-sm font-bold text-[var(--family-ocean)]">
          Rotating spotlight: {spotlightNames}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PlayIconButton
            size="xl"
            playing={playing}
            label="Play spotlight song"
            onClick={toggle}
          />
          <button
            type="button"
            onClick={() => playQueue(getFairRotationQueue(), 0)}
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--jb-text)] px-5 py-3 text-sm font-black text-[#050608] [-webkit-tap-highlight-color:transparent]"
          >
            Play family mix
          </button>
        </div>
      </div>
    </section>
  );
}
