import { handler } from "@/server/lib/api-handler";
import { NextResponse } from "next/server";
import { AppError } from "@/server/lib/errors";
import { Note } from "@/server/db/models/note.model";
import { buildSignedUrl } from "@/server/lib/cloudinary";
import { enforceRateLimit } from "@/server/lib/rate-limit";
import { incrementDownloadCount } from "@/server/services/note.service";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export const GET = handler<{ slug: string }>(async (ctx): Promise<NextResponse<unknown>> => {
  const { slug } = ctx.params;
  enforceRateLimit("noteDownload", ctx.ip, { limit: 30, windowMs: 600000 });

  const note = await Note.findOne({ slug, visibility: "public" }).lean().exec();
  if (!note) throw AppError.notFound("Note");

  if (note.pricingType !== "free") {
    throw AppError.forbidden("This note is locked. Purchase it to receive the full PDF.");
  }

  let buffer: ArrayBuffer | Buffer | null = null;

  if (note.fullFilePublicId) {
    try {
      const signedUrl = buildSignedUrl(note.fullFilePublicId, "raw", "authenticated");
      const res = await fetch(signedUrl);
      if (res.ok) {
        buffer = await res.arrayBuffer();
      }
    } catch {
      buffer = null;
    }
  }

  if (!buffer && note.fullFileUrl) {
    try {
      if (note.fullFileUrl.startsWith("http://") || note.fullFileUrl.startsWith("https://")) {
        const res = await fetch(note.fullFileUrl);
        if (res.ok) {
          buffer = await res.arrayBuffer();
        }
      }
    } catch {
      buffer = null;
    }
  }

  if (!buffer) {
    const samplePath = path.join(process.cwd(), "public", "sample.pdf");
    if (fs.existsSync(samplePath)) {
      buffer = fs.readFileSync(samplePath);
    }
  }

  if (!buffer) throw AppError.notFound("Note file content");

  await incrementDownloadCount(note._id.toString());

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
