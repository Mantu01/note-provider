import { adminHandler } from "@/helpers/api-handler";
import { ok, fail } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { AppError } from "@/helpers/errors";
import { generateOrderNumber } from "@/helpers/order-number";
import { createRazorpayOrder } from "@/helpers/razorpay";
import { z } from "zod";

const createOrderSchema = z.object({
  fullName: z.string().min(2).max(100),
  consentAccepted: z.literal(true),
  noteSlug: z.string().optional(),
  groupSlug: z.string().optional(),
});

export const runtime = "nodejs";

export const POST = adminHandler(async (ctx) => {
  const body = await ctx.req.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return fail(AppError.validation({ fullName: parsed.error.flatten().fieldErrors.fullName?.[0] ?? "Invalid name" }));
  }

  const input = parsed.data;
  const itemSlug = input.noteSlug || input.groupSlug;
  const itemType = input.noteSlug ? "note" : "group";

  if (!itemSlug) throw new Error("Invalid item");

  const orderNumber = await generateOrderNumber();

  const note = itemSlug ? await prisma.note.findFirst({ where: { slug: itemSlug }, select: { id: true, price: true, title: true } }) : null;
  const group = itemSlug ? await prisma.group.findFirst({ where: { slug: itemSlug }, select: { id: true, price: true, name: true } }) : null;
  const itemDoc = note ?? group;

  if (!itemDoc) throw new Error("Item not found");

  const price = (itemDoc as any).price;

  const { id: razorpayOrderId } = await createRazorpayOrder({
    amount: price,
    receipt: orderNumber,
    notes: { orderNumber, itemType, itemSlug, buyerName: input.fullName },
  });

  const doc = await prisma.order.create({
    data: {
      orderNumber,
      itemType,
      noteId: itemType === "note" ? itemDoc.id : null,
      groupId: itemType === "group" ? itemDoc.id : null,
      amount: price,
      razorpayOrderId,
      paymentStatus: "created",
      fulfillmentStatus: "pending",
      itemSnapshot: { title: (itemDoc as any).title || (itemDoc as any).name, slug: itemSlug, price },
      buyer: { fullName: input.fullName, consentAccepted: input.consentAccepted, ipAddress: ctx.ip, userAgent: ctx.userAgent },
    },
  });

  return ok({ orderNumber, razorpayOrderId });
});
