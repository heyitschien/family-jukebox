"use client";

import { cn } from "@/lib/utils";
import type { FamilyMember } from "@/data/members";

type MemberFilterProps = {
  members: FamilyMember[];
  activeMember: string | null;
  onMemberChange: (slug: string | null) => void;
};

export function MemberFilter({
  members,
  activeMember,
  onMemberChange,
}: MemberFilterProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-amber-900/80">Family member</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onMemberChange(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            activeMember === null
              ? "bg-amber-500 text-amber-950 shadow-sm"
              : "bg-white text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50",
          )}
        >
          Everyone
        </button>
        {members.map((member) => (
          <button
            key={member.slug}
            type="button"
            onClick={() =>
              onMemberChange(member.slug === activeMember ? null : member.slug)
            }
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              activeMember === member.slug
                ? "bg-amber-500 text-amber-950 shadow-sm"
                : "bg-white text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50",
            )}
          >
            {member.emoji} {member.name}
          </button>
        ))}
      </div>
    </div>
  );
}
