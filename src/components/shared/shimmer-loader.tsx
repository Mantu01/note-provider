import { cn } from "@/lib/utils";

export function ShimmerLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function ShimmerNoteCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <ShimmerLoader className="aspect-[16/9] rounded-none" />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <ShimmerLoader className="h-5 w-16 rounded-full" />
          <ShimmerLoader className="h-4 w-12 rounded-full" />
        </div>
        <ShimmerLoader className="h-5 w-3/4" />
        <ShimmerLoader className="h-3 w-full" />
        <div className="flex items-end justify-between pt-1">
          <ShimmerLoader className="h-5 w-20 rounded-md" />
          <ShimmerLoader className="h-4 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ShimmerStatCard() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card px-5 py-4 text-center backdrop-blur-sm">
      <ShimmerLoader className="mx-auto mb-2 h-7 w-20 rounded" />
      <ShimmerLoader className="mx-auto h-3 w-16 rounded" />
    </div>
  );
}
