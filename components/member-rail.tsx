import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { getRoleLabel, type FamilyMember } from "@/data/members";
import { getSongsByAuthor } from "@/data/songs";

type MemberRailProps = {
  members: FamilyMember[];
  title: string;
  subtitle?: string;
  className?: string;
};

export function MemberRail({ members, title, subtitle, className }: MemberRailProps) {
  if (members.length === 0) return null;

  return (
    <section
      className={[
        "rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{subtitle}</p> : null}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
        {members.map((member) => {
          const memberSongs = getSongsByAuthor(member.slug);
          const heroCover = memberSongs[0]?.coverSrc;

          return (
            <Link
              key={member.slug}
              href={`/members/${member.slug}`}
              className="group w-52 shrink-0 snap-start rounded-[22px] border border-white/[0.07] bg-white/[0.05] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
            >
              <div className="flex items-center gap-3">
                <div className="size-14 overflow-hidden rounded-full border border-white/[0.07] bg-[#282828]">
                  {heroCover ? (
                    <CoverImage src={heroCover} alt="" className="size-full" />
                  ) : (
                    <span className="flex size-full items-center justify-center text-2xl">{member.emoji}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold group-hover:text-[var(--family-pink)]">
                    {member.name}
                  </p>
                  <p className="text-xs font-bold text-[var(--jb-muted)]">{getRoleLabel(member.role)}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--jb-muted)] line-clamp-3">
                {member.description}
              </p>
              <p className="mt-3 text-xs font-bold text-[var(--family-ocean)]">
                {memberSongs.length} {memberSongs.length === 1 ? "song" : "songs"} · age {member.age}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
