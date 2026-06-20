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
      <p className="text-sm font-medium text-[#b3b3b3]">Family member</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onMemberChange(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            activeMember === null
              ? "bg-white text-black"
              : "bg-[#282828] text-white hover:bg-[#3e3e3e]",
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
                ? "bg-white text-black"
                : "bg-[#282828] text-white hover:bg-[#3e3e3e]",
            )}
          >
            {member.emoji} {member.name}
          </button>
        ))}
      </div>
    </div>
  );
}
