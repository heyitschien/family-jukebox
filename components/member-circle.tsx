import Link from "next/link";

import { getSongsByAuthor } from "@/data/songs";
import type { FamilyMember } from "@/data/members";

type MemberCircleProps = {
  member: FamilyMember;
};

export function MemberCircle({ member }: MemberCircleProps) {
  const songs = getSongsByAuthor(member.slug);
  const cover = songs[0]?.coverSrc;

  return (
    <Link href={`/members/${member.slug}`} className="w-28 shrink-0 snap-start text-center sm:w-32">
      <div className="mx-auto size-28 overflow-hidden rounded-full bg-[#282828] shadow-lg sm:size-32">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-4xl">{member.emoji}</span>
        )}
      </div>
      <p className="mt-3 truncate text-sm font-bold">{member.name}</p>
      <p className="truncate text-xs text-[var(--jb-muted)]">Age {member.age}</p>
    </Link>
  );
}
