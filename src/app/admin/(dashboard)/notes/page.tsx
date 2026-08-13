"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { NotesTable } from "@/features/admin/components/notes/notes-table";

export default function AdminNotesPage() {
  return (
    <Suspense fallback={null}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes Catalogue</h1>
        </div>
        <NotesTable />
      </div>
    </Suspense>
  );
}
