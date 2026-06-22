"use client";

import Link from "next/link";

import { AlbumCard } from "@/components/album-card";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { filterAlbumsForAudience, getFamilyAudienceLabel } from "@/lib/audience";
import type { BrowseAlbumSection } from "@/data/albums";

type AlbumsBrowserProps = {
  sections: BrowseAlbumSection[];
};

export function AlbumsBrowser({ sections }: AlbumsBrowserProps) {
  const { audienceId } = useFamilyAudienceContext();

  const visibleSections = sections
    .map((section) => ({
      ...section,
      albums: audienceId ? filterAlbumsForAudience(section.albums, audienceId) : section.albums,
    }))
    .filter((section) => section.albums.length > 0);

  return (
    <>
      {audienceId ? (
        <p className="mb-6 text-sm font-bold text-[var(--jb-muted)]">
          Showing collections for {getFamilyAudienceLabel(audienceId)}.
        </p>
      ) : null}

      <div className="space-y-10">
        {visibleSections.map((section) => (
          <section key={section.id}>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{section.title}</h2>
              <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{section.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {section.albums.map((album) => (
                <AlbumCard key={album.slug} album={album} size="sm" className="w-full" showKind />
              ))}
            </div>
          </section>
        ))}
      </div>

      {visibleSections.length === 0 ? (
        <p className="text-[var(--jb-muted)]">
          No albums match this family audience yet — try switching profiles from the avatar.
        </p>
      ) : null}

      <p className="mt-8 text-center">
        <Link href="/" className="text-sm font-bold text-[var(--family-pink)] hover:underline">
          ← Back to home
        </Link>
      </p>
    </>
  );
}
