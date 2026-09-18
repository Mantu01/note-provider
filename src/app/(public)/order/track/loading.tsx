import { ShimmerLoader } from "@/components/shared/shimmer-loader";

export default function TrackOrderLoading() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="text-center space-y-3">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShimmerLoader className="size-6 rounded" aria-hidden="true" />
        </div>
        <ShimmerLoader className="h-7 w-48 mx-auto rounded" />
        <ShimmerLoader className="h-4 w-72 mx-auto rounded" />
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 space-y-4">
        <ShimmerLoader className="h-5 w-24 rounded" />
        <div className="flex gap-2">
          <ShimmerLoader className="h-10 flex-1 rounded-xl" />
          <ShimmerLoader className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
