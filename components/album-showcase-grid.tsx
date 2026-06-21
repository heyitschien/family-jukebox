"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { useSongPlayback } from "@/hooks/use-song-playback";
import type { AlbumBundle } from "@/data/albums";
import { cn } from "@/lib/utils";

type AlbumShowcaseGridProps = {
  bundles: AlbumBundle[];
  title: string;
  description: string;
  className?: string;
};

function AlbumShowcaseCard({ bundle }: { bundle: AlbumBundle }) {
  const leadSong = bundle.songs[0];
  if (!leadSong) return null;

  const { playing, toggle, isCurrent } = useSongPlayback(leadSong, { playlist: bundle.songs });

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[24px] border border-white/[0.09] bg-white/[0.06] p-3.5 transition hover:-translate-y-0.5 hover:bg-white/[0.09]",
        isCurrent && "border-[rgba(255,111,177,0.4)]",
      )}
      style={{
        backgroundImage: `linear-gradient(140deg, ${bundle.album.accentFrom}20 0%, ${bundle.album.accentTo}1A 100%)`,
      }}
    >
      <div className="relative">
        <CoverImage
          src={bundle.album.coverSrc}
          alt={`${bundle.album.title} cover`}
          className={cn(
            "aspect-square w-full rounded-[18px] shadow-[0_14px_34px_rgba(0,0,0,0.3)]",
            isCurrent && "ring-2 ring-[var(--family-pink)]",
          )}
        />
        <PlayIconButton
          size="sm"
          playing={playing}
          label={playing ? `Pause ${bundle.album.title}` : `Play ${bundle.album.title}`}
          onClick={toggle}
          className="absolute right-2 bottom-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        />
      </div>

      <div className="mt-3">
        <Link href={`/albums/${bundle.album.slug}`} className="block min-w-0">
          <h3 className="truncate text-[15px] font-extrabold tracking-tight">{bundle.album.title}</h3>
        </Link>
        <Link
          href={`/members/${bundle.artist.slug}`}
          className="mt-1 inline-block text-xs font-bold text-[var(--jb-muted)] hover:text-white hover:underline"
        >
          {bundle.artist.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-xs leading-snug text-[var(--jb-muted)]">
          {bundle.album.subtitle}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] font-extrabold text-[var(--jb-muted)]">
        <span className="rounded-full border border-white/[0.12] bg-white/[0.08] px-2.5 py-1">
          {bundle.songs.length} {bundle.songs.length === 1 ? "track" : "tracks"}
        </span>
        <span className="truncate">{leadSong.title}</span>
      </div>
    </article>
  );
}

export function AlbumShowcaseGrid({
  bundles,
  title,
  description,
  className,
}: AlbumShowcaseGridProps) {
  if (bundles.length === 0) return null;

  return (
    <section
      className={cn(
        "mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-[22px] lg:mt-6",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">{title}</h2>
        <p className="text-sm font-bold text-[var(--jb-muted)]">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 xl:grid-cols-5">
        {bundles.map((bundle) => (
          <AlbumShowcaseCard key={bundle.album.slug} bundle={bundle} />
        ))}
      </div>
    </section>
  );
}
