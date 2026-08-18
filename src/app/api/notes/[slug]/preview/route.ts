import { handler } from "@/server/lib/api-handler";
import { NextResponse } from "next/server";
import { AppError } from "@/server/lib/errors";
import { Note } from "@/server/db/models/note.model";

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export const GET = handler<{ slug: string }>(async (ctx): Promise<NextResponse> => {
  const { slug } = ctx.params;
  const mode = ctx.searchParams.get("mode");

  const note = await Note.findOne({ slug, visibility: "public" }).lean().exec();
  if (!note) throw AppError.notFound("Preview not found for this note");

  const pdfUrl = note.previewFileUrl || note.fullFileUrl;
  if (!pdfUrl) throw AppError.notFound("Preview not available for this note");

  const pdfResponse = await fetch(pdfUrl);
  if (!pdfResponse.ok) throw AppError.internal("Failed to fetch preview PDF");

  const buffer = await pdfResponse.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": mode === "view" ? "inline" : "inline; filename=\"preview.pdf\"",
      "Content-Length": buffer.byteLength.toString(),
      "Cache-Control": "public, max-age=60",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
