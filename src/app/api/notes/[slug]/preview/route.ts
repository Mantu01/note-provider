import { handler } from "@/helpers/api-handler";
import { NextResponse } from "next/server";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toGoogleDrivePreviewUrl } from "@/schemas/note.schema";

export const GET = handler<{ slug: string }>(async (ctx): Promise<NextResponse> => {
  const { slug } = ctx.params;
  const format = ctx.searchParams.get("format");

  const note = await prisma.note.findFirst({ where: { slug, visibility: "public" } });
  if (!note) throw AppError.notFound("Preview not found for this note");

  const isDrive = (url: string) => url.includes("drive.google.com") || url.includes("docs.google.com");

  const previewUrl = note.previewFileUrl;
  if (previewUrl) {
    const viewerUrl = isDrive(previewUrl) ? toGoogleDrivePreviewUrl(previewUrl) : previewUrl;
    if (format === "json") {
      return NextResponse.json({ url: viewerUrl, previewUrl: viewerUrl, filename: `${note.slug}-preview.pdf` });
    }
    return NextResponse.redirect(viewerUrl, 307);
  }

  throw AppError.notFound("Preview not available for this note");
});
