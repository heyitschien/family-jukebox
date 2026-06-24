import Link from "next/link";

import { getSongsByAuthor } from "@/data/songs";
import type { FamilyMember } from "@/data/members";
import { getRoleLabel, shouldShowMemberAge } from "@/data/members";
import { cn } from "@/lib/utils";

type MemberCardProps = {
  member: FamilyMember;
  compact?: boolean;
};

export function MemberCard({ member, compact = false }: MemberCardProps) {
  const songCount = getSongsByAuthor(member.slug).length;

  return (
    <Link
      href={`/members/${member.slug}`}
      className={cn(
        "group block overflow-hidden rounded-3xl border border-amber-200/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md",
        compact ? "p-4" : "p-6",
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl",
            compact ? "size-12" : "size-14",
          )}
          aria-hidden
        >
          {member.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-amber-950">{member.name}</h3>
            {shouldShowMemberAge(member) ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
                age {member.age}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-amber-700/80">
            {getRoleLabel(member.role)}
          </p>
          {!compact ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-amber-900/70">
              {member.description}
            </p>
          ) : null}
          <p className="mt-3 text-xs font-medium text-amber-800/60">
            {songCount} {songCount === 1 ? "song" : "songs"} →
          </p>
        </div>
      </div>
    </Link>
  );
}
