import Link from "next/link";

import { AlbumCard } from "@/components/album-card";
import type { Album } from "@/data/albums";

type AlbumShelfProps = {
  title: string;
  description: string;
  albums: Album[];
  href?: string;
  ctaLabel?: string;
};

export function AlbumShelf({ title, description, albums, href, ctaLabel }: AlbumShelfProps) {
  if (albums.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-[22px]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">{title}</h2>
          <p className="text-sm font-bold text-[var(--jb-muted)]">{description}</p>
        </div>
        {href && ctaLabel ? (
          <Link
            href={href}
            className="inline-flex min-h-11 items-center rounded-full border border-white/[0.09] bg-white/[0.07] px-4 py-2.5 text-sm font-bold"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {albums.map((album) => (
          <div key={album.slug} className="w-[220px] shrink-0 snap-start sm:w-[244px]">
            <AlbumCard album={album} />
          </div>
        ))}
      </div>
    </section>
  );
}
