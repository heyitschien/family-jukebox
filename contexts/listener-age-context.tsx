"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useListenerAge } from "@/hooks/use-listener-age";

type ListenerAgeContextValue = ReturnType<typeof useListenerAge>;

const ListenerAgeContext = createContext<ListenerAgeContextValue | null>(null);

export function ListenerAgeProvider({ children }: { children: ReactNode }) {
  const value = useListenerAge();
  return <ListenerAgeContext.Provider value={value}>{children}</ListenerAgeContext.Provider>;
}

export function useListenerAgeContext(): ListenerAgeContextValue {
  const context = useContext(ListenerAgeContext);
  if (!context) {
    throw new Error("useListenerAgeContext must be used within ListenerAgeProvider");
  }
  return context;
}
