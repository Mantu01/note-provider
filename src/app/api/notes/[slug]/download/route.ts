import { handler } from "@/helpers/api-handler";
import { NextResponse } from "next/server";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { buildSignedUrl } from "@/helpers/cloudinary";
import { enforceRateLimit } from "@/helpers/rate-limit";
import { incrementDownloadCount } from "@/helpers/services/note.service";
import { driveToDownloadUrl } from "@/helpers/drive-utils";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export const GET = handler<{ slug: string }>(async (ctx): Promise<NextResponse<unknown>> => {
  const { slug } = ctx.params;
  const orderId = ctx.searchParams.get("orderId");
  enforceRateLimit("noteDownload", ctx.ip, { limit: 30, windowMs: 600000 });

  const note = await prisma.note.findFirst({ where: { slug, visibility: "public" } });
  if (!note) throw AppError.notFound("Note");

  if (note.pricingType === "paid") {
    if (!orderId) throw AppError.forbidden("This note is locked. Purchase it to receive the full PDF.");

    const order = await prisma.order.findFirst({ where: { id: orderId, paymentStatus: "paid" } });
    if (!order || (order.itemSnapshot as any)?.slug !== slug) throw AppError.forbidden("No valid paid order found for this note.");
  }

  let buffer: ArrayBuffer | Buffer | null = null;

  if (note.fullFilePublicId) {
    try {
      const signedUrl = buildSignedUrl(note.fullFilePublicId, "raw", "authenticated");
      const res = await fetch(signedUrl);
      if (res.ok) buffer = await res.arrayBuffer();
    } catch { /* ignore */ }
  }

  if (!buffer && note.fullFileUrl) {
    try {
      if (note.fullFileUrl.startsWith("http://") || note.fullFileUrl.startsWith("https://")) {
        const url = driveToDownloadUrl(note.fullFileUrl);
        const res = await fetch(url);
        if (res.ok) buffer = await res.arrayBuffer();
      }
    } catch { /* ignore */ }
  }

  if (!buffer) {
    const samplePath = path.join(process.cwd(), "public", "sample.pdf");
    if (fs.existsSync(samplePath)) buffer = fs.readFileSync(samplePath);
  }

  if (!buffer) throw AppError.notFound("Note file content");

  await incrementDownloadCount(note.id);

  const fileName = `${note.slug}.pdf`;
  const bytes = buffer instanceof Buffer ? buffer : Buffer.from(buffer as ArrayBuffer);

  return new NextResponse(bytes as unknown as ArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
