import Link from "next/link";

import type { FamilyMember } from "@/data/members";
import { cn } from "@/lib/utils";

type ArtistLinkProps = {
  member: FamilyMember;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function ArtistLink({ member, className, onClick }: ArtistLinkProps) {
  return (
    <Link
      href={`/members/${member.slug}`}
      onClick={onClick}
      className={cn(
        "font-bold transition hover:text-white hover:underline",
        className,
      )}
    >
      {member.name}
    </Link>
  );
}
