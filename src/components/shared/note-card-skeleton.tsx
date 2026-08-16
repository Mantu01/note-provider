import { ShimmerLoader } from "@/components/shared/shimmer-loader";

export function NoteCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
      <ShimmerLoader className="aspect-[16/9] rounded-none" />
      <div className="space-y-2.5 p-3">
        <div className="flex gap-1.5">
          <ShimmerLoader className="h-4 w-14 rounded-full" />
          <ShimmerLoader className="h-4 w-12 rounded-full" />
        </div>
        <ShimmerLoader className="h-4 w-4/5" />
        <ShimmerLoader className="h-3 w-full" />
        <div className="flex items-end justify-between pt-0.5">
          <ShimmerLoader className="h-4 w-14" />
          <ShimmerLoader className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}
