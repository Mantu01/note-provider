import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toPublicOrder } from "@/helpers/mappers/order.mapper";


export const GET = handler(async (ctx) => {
  const { orderId } = await ctx.params;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw AppError.notFound("Order");

  let notes: Array<{ id: string; title: string; slug: string; coverImageUrl: string | null }> = [];
  const snapshot = (order.itemSnapshot as Record<string, unknown>) ?? {};
  const noteIds = Array.isArray(snapshot.noteIds) ? (snapshot.noteIds as string[]) : [];

  if (order.itemType === "group") {
    if (noteIds.length > 0) {
      notes = await prisma.note.findMany({
        where: { id: { in: noteIds } },
        select: { id: true, title: true, slug: true, coverImageUrl: true },
      });
    } else if (order.groupId) {
      const groupNotes = await prisma.noteGroup.findMany({
        where: { groupId: order.groupId },
        include: { note: { select: { id: true, title: true, slug: true, coverImageUrl: true } } },
      });
      notes = groupNotes.map((gn) => gn.note);
    }
  } else if (order.noteId) {
    const note = await prisma.note.findUnique({
      where: { id: order.noteId },
      select: { id: true, title: true, slug: true, coverImageUrl: true },
    });
    if (note) notes = [note];
  }

  const res = ok({ ...toPublicOrder(order), notes });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
});
