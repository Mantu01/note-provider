import { handler } from "@/helpers/api-handler";
import { NextResponse } from "next/server";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { driveToDownloadUrl } from "@/helpers/drive-utils";


export const GET = handler<{ slug: string }>(async (ctx): Promise<NextResponse> => {
  const { slug } = ctx.params;
  const mode = ctx.searchParams.get("mode");

  const note = await prisma.note.findFirst({ where: { slug, visibility: "public" } });
  if (!note) throw AppError.notFound("Preview not found for this note");

  let pdfUrl: string | null = null;
  if (note.previewFileUrl) {
    pdfUrl = note.previewFileUrl;
  } else if (note.pdfSource === "drive" && note.drivePdfUrl) {
    pdfUrl = driveToDownloadUrl(note.drivePdfUrl);
  } else if (note.fullFileUrl) {
    pdfUrl = note.fullFileUrl;
  }

  if (!pdfUrl) throw AppError.notFound("Preview not available for this note");

  const res = await fetch(pdfUrl);
  if (!res.ok) throw AppError.internal("Failed to fetch preview PDF");

  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": mode === "view" ? "inline" : "inline; filename=\"preview.pdf\"",
      "Content-Length": Buffer.byteLength(buffer).toString(),
      "Cache-Control": "public, max-age=60",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
