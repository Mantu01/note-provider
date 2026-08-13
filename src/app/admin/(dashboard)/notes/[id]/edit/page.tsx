"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { use } from "react";
import { useAdminNote } from "@/features/admin/api/use-admin-notes";
import { NoteForm } from "@/features/admin/components/notes/note-form";
import { ErrorState } from "@/components/shared/error-state";
import { Loader2 } from "lucide-react";

function NoteFormContent({ id }: { id: string }) {
  const { data: note, isLoading } = useAdminNote(id);
  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!note) return <ErrorState message="Note not found" onRetry={() => window.location.reload()} />;
  return <NoteForm initialData={note} />;
}

export default function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={null}>
      <NoteFormContent id={id} />
    </Suspense>
  );
}
