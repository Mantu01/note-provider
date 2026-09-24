"use client";

import { Suspense } from "react";
import { NotesTable } from "@/components/admin/notes/notes-table";

export default function AdminNotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notes Catalogue</h1>
        <p className="text-sm text-muted-foreground">Create, price and publish the notes buyers download.</p>
      </div>
      <Suspense fallback={null}>
        <NotesTable />
      </Suspense>
    </div>
  );
}
