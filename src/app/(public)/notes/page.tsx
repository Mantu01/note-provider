import type { Metadata } from "next";
import { NotesCatalogue } from "@/features/notes/components/notes-catalogue";

export const metadata: Metadata = { title: "Study notes", description: "Browse curated, exam-ready study notes." };

export default function NotesPage() {
  return <NotesCatalogue />;
}
