"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicNoteForm = dynamic(() => import("@/components/admin/notes/note-form").then(m => m.NoteForm), { ssr: false });

export default function NewNotePage() {
  return (
    <Suspense fallback={null}>
      <DynamicNoteForm />
    </Suspense>
  );
}
