"use client";

import { useParams } from "next/navigation";
import { NoteDetailPage } from "@/features/notes/components/note-detail-page";

export default function NotePage() {
  const params = useParams<{ slug: string }>();
  return <NoteDetailPage slug={params.slug} />;
}
