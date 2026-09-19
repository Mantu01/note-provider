import { handler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { enforceRateLimit } from "@/helpers/rate-limit";

export const GET = handler(async (ctx) => {
  const { orderId } = await ctx.params;
  const orderNumber = ctx.searchParams.get("orderNumber")?.trim();

  if (!orderNumber) {
    return fail(AppError.validation({ orderNumber: "Order number is required" }));
  }

  enforceRateLimit("orderDownload", ctx.ip, { limit: 5, windowMs: 60000 });

  const order = await prisma.order.findFirst({
    where: { id: orderId, orderNumber: orderNumber.toUpperCase() },
    include: { note: true },
  });

  if (!order) throw AppError.notFound("Order");
  if (order.itemType !== "note" || !order.noteId) throw AppError.notFound("Note not found for this order");
  if (order.paymentStatus !== "paid") throw AppError.forbidden("Payment not completed");

  const isFresh = order.paidAt && Date.now() - new Date(order.paidAt).getTime() < 15 * 60 * 1000;
  if (!isFresh) {
    if (order.isDownloaded) throw AppError.forbidden("This order has already been downloaded");
    await prisma.order.update({
      where: { id: orderId },
      data: { isDownloaded: true },
    });
  }

  if (!order.note?.fullFileUrl) throw AppError.internal("Note file not available");

  await prisma.note.update({ where: { id: order.noteId }, data: { downloadCount: { increment: 1 } } });

  const slug = (order.itemSnapshot as any)?.slug ?? order.note.slug;
  return ok({ url: order.note.fullFileUrl, filename: `${slug}.pdf` });
});
