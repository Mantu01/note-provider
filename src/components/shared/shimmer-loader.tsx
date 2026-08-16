import { cn } from "@/lib/utils";

export function ShimmerLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn("shimmer-premium", className)}
      aria-hidden="true"
    />
  );
}

export function ShimmerNoteCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
      <ShimmerLoader className="aspect-[16/9] rounded-none" />
      <div className="space-y-2.5 p-3">
        <div className="flex items-center justify-between gap-2">
          <ShimmerLoader className="h-4 w-14 rounded-full" />
          <ShimmerLoader className="h-3.5 w-10 rounded-full" />
        </div>
        <ShimmerLoader className="h-4 w-3/4" />
        <ShimmerLoader className="h-3 w-full" />
        <div className="flex items-end justify-between pt-0.5">
          <ShimmerLoader className="h-4 w-16 rounded-md" />
          <ShimmerLoader className="h-3 w-12 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ShimmerStatCard() {
  return (
    <div className="rounded-xl border border-border/50 bg-card px-4 py-3 text-center backdrop-blur-sm">
      <ShimmerLoader className="mx-auto mb-1.5 h-6 w-16 rounded" />
      <ShimmerLoader className="mx-auto h-2.5 w-12 rounded" />
    </div>
  );
}
