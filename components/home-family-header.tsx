"use client";

import { Topbar } from "@/components/topbar";
import { AudienceSelector } from "@/components/audience-selector";
import { cn } from "@/lib/utils";

type HomeFamilyHeaderProps = {
  className?: string;
};

export function HomeFamilyHeader({ className }: HomeFamilyHeaderProps) {
  return (
    <header className={cn("space-y-4", className)}>
      <Topbar variant="embedded" />
      <AudienceSelector />
    </header>
  );
}
