import { handler } from "@/helpers/api-handler";
import { NextResponse } from "next/server";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toGoogleDrivePreviewUrl, toGoogleDriveDownloadUrl } from "@/schemas/note.schema";

export const GET = handler<{ slug: string }>(async (ctx): Promise<NextResponse> => {
  const { slug } = ctx.params;
  const format = ctx.searchParams.get("format");

  const note = await prisma.note.findFirst({ where: { slug, visibility: "public" } });
  if (!note) throw AppError.notFound("Preview not found for this note");

  const pdfUrl = note.previewFileUrl ?? note.fullFileUrl;
  if (!pdfUrl) throw AppError.notFound("Preview not available for this note");

  const isDrive = pdfUrl.includes("drive.google.com") || pdfUrl.includes("docs.google.com");
  const viewerUrl = isDrive ? toGoogleDrivePreviewUrl(pdfUrl) : pdfUrl;
  const downloadUrl = isDrive ? toGoogleDriveDownloadUrl(pdfUrl) : pdfUrl;

  if (format === "json") {
    return NextResponse.json({ url: downloadUrl, previewUrl: viewerUrl, filename: `${note.slug}-preview.pdf` });
  }

  return NextResponse.redirect(viewerUrl, 307);
});
