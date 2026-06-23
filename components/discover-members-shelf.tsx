import Link from "next/link";

import type { FamilyMember } from "@/data/members";
import { getSongsByAuthor } from "@/data/songs";

type DiscoverMembersShelfProps = {
  members: FamilyMember[];
  title?: string;
  subtitle?: string;
};

export function DiscoverMembersShelf({
  members: memberList,
  title = "Explore more artists",
  subtitle = "Jump to another cousin — every profile has albums and songs to play",
}: DiscoverMembersShelfProps) {
  if (memberList.length === 0) return null;

  return (
    <section className="jb-float-panel mt-4 p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{subtitle}</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {memberList.map((member) => {
          const songs = getSongsByAuthor(member.slug);
          const cover = songs[0]?.coverSrc;

          return (
            <Link
              key={member.slug}
              href={`/members/${member.slug}`}
              className="flex w-28 shrink-0 flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.04] p-3 text-center transition hover:bg-white/[0.08] sm:w-32"
            >
              <div className="size-16 overflow-hidden rounded-full bg-[#282828] shadow-lg sm:size-20">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="size-full object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center text-3xl">
                    {member.emoji}
                  </span>
                )}
              </div>
              <p className="mt-3 truncate text-sm font-bold">{member.name}</p>
              <p className="mt-0.5 text-xs text-[var(--jb-muted)]">
                {songs.length} {songs.length === 1 ? "song" : "songs"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
