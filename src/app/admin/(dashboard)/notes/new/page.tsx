"use client";
export const dynamic = "force-dynamic";

import { default as dynamicImport } from "next/dynamic";
import { Suspense } from "react";

const NoteForm = dynamicImport(async () => {
  const mod = await import("@/features/admin/components/notes/note-form");
  return mod.NoteForm;
}, { ssr: false });

export default function NewNotePage() {
  return (
    <Suspense fallback={null}>
      <NoteForm />
    </Suspense>
  );
}
