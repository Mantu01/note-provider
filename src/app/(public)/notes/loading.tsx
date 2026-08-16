import { ShimmerNoteCard } from "@/components/shared/shimmer-loader";
import { ShimmerLoader } from "@/components/shared/shimmer-loader";

export default function NotesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ShimmerLoader className="h-20 rounded-xl" />
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }, (_, index) => <ShimmerNoteCard key={index} />)}
      </div>
    </div>
  );
}
