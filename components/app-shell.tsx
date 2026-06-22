"use client";

import { BottomNav } from "@/components/bottom-nav";
import { ListenerAgeWelcome } from "@/components/listener-age-welcome";
import { MiniPlayer } from "@/components/mini-player";
import { Sidebar } from "@/components/sidebar";
import { StagingBrandBanner } from "@/components/staging-brand-banner";
import { ListenerAgeProvider } from "@/contexts/listener-age-context";
import { PlayerProvider } from "@/contexts/player-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ListenerAgeProvider>
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
        <ListenerAgeWelcome />
      </PlayerProvider>
    </ListenerAgeProvider>
  );
}
