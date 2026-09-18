import { prisma } from "../db";
import { AppError } from "../errors";
import { generateOrderNumber } from "../order-number";
import { createRazorpayOrder } from "../razorpay";
import type { UpdateOrderPayload } from "@/schemas/admin.schema";
import type { Prisma } from "@prisma/client";

export async function createOrder(
  input: { fullName: string; consentAccepted: boolean },
  itemSlug: string,
  itemType: "note" | "group",
  amount: number,
  ctx: { ip: string | null; userAgent: string | null },
): Promise<{ order: import("@prisma/client").Order; razorpayOrderId: string }> {
  const orderNumber = await generateOrderNumber();
  const [itemDoc, { id: razorpayOrderId }] = await Promise.all([
    itemType === "note"
      ? prisma.note.findFirst({ where: { slug: itemSlug }, select: { id: true, title: true, coverImageUrl: true } })
      : prisma.group.findFirst({ where: { slug: itemSlug }, select: { id: true, name: true, coverImageUrl: true } }),
    createRazorpayOrder({ amount, receipt: orderNumber, notes: { orderNumber, itemType, itemSlug, buyerName: input.fullName } }),
  ]);
  if (!itemDoc) throw AppError.notFound("Item");

  const snapshot: Prisma.InputJsonValue = itemType === "group"
    ? { title: (itemDoc as { name: string; coverImageUrl: string | null }).name, slug: itemSlug, price: amount, noteIds: [], coverImageUrl: (itemDoc as { coverImageUrl: string | null }).coverImageUrl ?? null }
    : { title: (itemDoc as { title: string }).title, slug: itemSlug, price: amount, coverImageUrl: (itemDoc as { coverImageUrl: string | null }).coverImageUrl ?? null };

  const doc = await prisma.order.create({
    data: {
      orderNumber, itemType,
      noteId: itemType === "note" ? itemDoc.id : null,
      groupId: itemType === "group" ? itemDoc.id : null,
      amount, razorpayOrderId,
      paymentStatus: "created", fulfillmentStatus: "pending",
      itemSnapshot: snapshot,
      buyer: { fullName: input.fullName, consentAccepted: input.consentAccepted, ipAddress: ctx.ip, userAgent: ctx.userAgent },
    },
  });
  return { order: doc, razorpayOrderId };
}

export async function getOrderByNumber(orderNumber: string): Promise<import("@prisma/client").Order | null> {
  return prisma.order.findFirst({ where: { orderNumber } });
}

export async function fulfillOrder(
  orderId: string,
  input: UpdateOrderPayload,
  adminId: string,
): Promise<import("@prisma/client").Order> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw AppError.notFound("Order");
  if (order.paymentStatus !== "paid") throw AppError.validation({}, "Cannot fulfil an order that has not been paid.");

  const updates: Record<string, unknown> = {};
  if (input.fulfillmentStatus !== undefined) {
    updates.fulfillmentStatus = input.fulfillmentStatus;
    if (input.fulfillmentStatus === "completed") {
      updates.completedAt = new Date();
      updates.completedBy = adminId;
    } else {
      updates.completedAt = null;
      updates.completedBy = null;
    }
  }
  if (input.adminNote !== undefined) updates.adminNote = input.adminNote;

  return prisma.order.update({ where: { id: orderId }, data: updates as Parameters<typeof prisma.order.update>[0]["data"] });
}

export async function deleteOrder(orderId: string): Promise<{ deleted: true }> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw AppError.notFound("Order");
  await prisma.order.delete({ where: { id: orderId } });
  return { deleted: true };
}
