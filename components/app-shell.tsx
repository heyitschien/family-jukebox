"use client";

import { BottomNav } from "@/components/bottom-nav";
import { MiniPlayer } from "@/components/mini-player";
import { Sidebar } from "@/components/sidebar";
import { PlayerProvider } from "@/contexts/player-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <div className="grid min-h-dvh overflow-x-hidden lg:grid-cols-[260px_1fr] lg:gap-[18px] lg:p-[18px] lg:pb-[108px]">
        <Sidebar />
        <div className="min-w-0 px-0 pb-[calc(196px+env(safe-area-inset-bottom))] lg:px-0 lg:pb-0">
          {children}
        </div>
        <MiniPlayer />
        <BottomNav />
      </div>
    </PlayerProvider>
  );
}
