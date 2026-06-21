import type { ReactNode } from "react";

type HorizontalScrollProps = {
  children: ReactNode;
  className?: string;
};

export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  return (
    <div
      className={`flex gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 snap-x snap-mandatory scrollbar-none ${className}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {children}
    </div>
  );
}
