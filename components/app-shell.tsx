"use client";

import { AudienceModal } from "@/components/audience-modal";
import { BottomNav } from "@/components/bottom-nav";
import { MiniPlayer } from "@/components/mini-player";
import { Sidebar } from "@/components/sidebar";
import { StagingBrandBanner } from "@/components/staging-brand-banner";
import { FamilyAudienceProvider } from "@/contexts/family-audience-context";
import { PlayerProvider } from "@/contexts/player-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <FamilyAudienceProvider>
      <PlayerProvider>
        <StagingBrandBanner />
        <div className="grid min-h-dvh lg:grid-cols-[260px_1fr] lg:gap-[18px] lg:p-[18px] lg:pb-[108px]">
          <Sidebar />
          <div className="min-w-0 px-0 pb-[calc(196px+env(safe-area-inset-bottom))] lg:px-0 lg:pb-0">
            {children}
          </div>
          <MiniPlayer />
          <BottomNav />
        </div>
        <AudienceModal />
      </PlayerProvider>
    </FamilyAudienceProvider>
  );
}
