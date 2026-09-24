import { handler } from "@/helpers/api-handler";
import { NextResponse } from "next/server";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { enforceRateLimit } from "@/helpers/rate-limit";

const DOWNLOAD_WINDOW_MS = 15 * 60 * 1000;

type OrderLike = {
  id: string;
  paidAt: Date | null;
  isDownloaded: boolean;
  itemSnapshot: unknown;
};

async function claimDownloadAccess(order: OrderLike): Promise<void> {
  const isFresh = Boolean(order.paidAt && Date.now() - new Date(order.paidAt).getTime() < DOWNLOAD_WINDOW_MS);

  const claim = await prisma.order.updateMany({
    where: { id: order.id, isDownloaded: false },
    data: { isDownloaded: true },
  });

  if (claim.count === 0 && !isFresh) {
    throw AppError.forbidden("This order has already been downloaded. Contact support if you need the file again.");
  }
}

export const GET = handler<{ slug: string }>(async (ctx): Promise<NextResponse<unknown>> => {
  const { slug } = ctx.params;
  const orderId = ctx.searchParams.get("orderId");
  const isPreview = ctx.searchParams.get("preview") === "true";
  enforceRateLimit("noteDownload", ctx.ip, { limit: 30, windowMs: 600000 });

  const note = await prisma.note.findFirst({ where: { slug, visibility: "public" } });
  if (!note) throw AppError.notFound("Note");

  if (isPreview) {
    const previewUrl = note.previewFileUrl;
    if (!previewUrl) throw AppError.notFound("Preview file not available");
    return NextResponse.json({ url: previewUrl, filename: `${note.slug}-preview.pdf` });
  }

  if (note.pricingType === "paid") {
    if (!orderId) throw AppError.forbidden("This note is locked. Purchase it to receive the full PDF.");

    const order = await prisma.order.findFirst({ where: { id: orderId, paymentStatus: "paid" } });
    if (!order) throw AppError.forbidden("No valid paid order found.");

    const snapshot = (order.itemSnapshot as Record<string, unknown>) ?? {};
    const rawNoteIds = Array.isArray(snapshot.noteIds) ? snapshot.noteIds : [];
    const noteIds = rawNoteIds.filter((v): v is string => typeof v === "string");
    const snapshotSlug = typeof snapshot.slug === "string" ? snapshot.slug : "";
    const isNoteInOrder = order.noteId === note.id || snapshotSlug === slug || noteIds.includes(note.id);

    if (!isNoteInOrder) throw AppError.forbidden("This note is not part of this order.");

    await claimDownloadAccess(order);
  }

  if (!note.fullFileUrl) throw AppError.notFound("Note file not available");

  await prisma.note.update({ where: { id: note.id }, data: { downloadCount: { increment: 1 } } });

  return NextResponse.json({ url: note.fullFileUrl, filename: `${note.slug}.pdf` });
});
