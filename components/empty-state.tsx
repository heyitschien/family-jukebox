import { Music2 } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "No songs found",
  description = "Try a different search or tag.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.04] px-6 py-16 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/10 text-[var(--jb-muted)]">
        <Music2 className="size-7" />
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--jb-muted)]">{description}</p>
    </div>
  );
}
