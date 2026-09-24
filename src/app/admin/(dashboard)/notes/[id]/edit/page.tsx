"use client";

import { Suspense, use } from "react";
import { Loader2 } from "lucide-react";
import { NoteForm } from "@/components/admin/notes/note-form";
import { ErrorState } from "@/components/shared/error-state";
import { useAdminNote } from "@/hooks/useAdmin";

function NoteFormContent({ id }: { id: string }) {
  const query = useAdminNote(id);

  if (query.isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 aria-hidden="true" className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <ErrorState
        message="This note could not be loaded."
        onRetry={() => query.refetch()}
      />
    );
  }

  return <NoteForm initialData={query.data} />;
}

export default function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Suspense fallback={null}>
      <NoteFormContent id={id} />
    </Suspense>
  );
}
