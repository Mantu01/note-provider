"use client";

import { Suspense } from "react";
import { NotesTable } from "@/features/admin/components/notes/notes-table";

export default function AdminNotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notes Catalogue</h1>
      </div>
      <Suspense fallback={null}><NotesTable /></Suspense>
    </div>
  );
}
