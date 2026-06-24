import { Heart, Music2, Play, Radio, UsersRound } from "lucide-react";

import { cn } from "@/lib/utils";

const icons = {
  users: UsersRound,
  radio: Radio,
  music: Music2,
  play: Play,
  heart: Heart,
} as const;

export type BrandAccentIconName = keyof typeof icons;

type BrandAccentIconProps = {
  icon: BrandAccentIconName;
  className?: string;
};

/** Single subtle brand vocabulary icon — use in context, not as a cluster. */
export function BrandAccentIcon({ icon, className }: BrandAccentIconProps) {
  const Icon = icons[icon];
  return <Icon className={cn("size-3.5 shrink-0 text-[var(--cr-lilac)]", className)} aria-hidden />;
}
