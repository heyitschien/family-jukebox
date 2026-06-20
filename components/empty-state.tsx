import { Music2 } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "No songs found",
  description = "Try a different search or tag. Or add a new family anthem to the jukebox!",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-300/70 bg-amber-50/50 px-6 py-16 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-200/70 text-amber-800">
        <Music2 className="size-7" />
      </span>
      <h3 className="text-lg font-bold text-amber-950">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-amber-900/70">{description}</p>
    </div>
  );
}
