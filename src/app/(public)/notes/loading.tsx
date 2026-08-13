import { NoteCardSkeleton } from "@/components/shared/note-card-skeleton";

export default function NotesLoading() {
  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="h-28 rounded-2xl bg-muted" /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 12 }, (_, index) => <NoteCardSkeleton key={index} />)}</div></div>;
}
