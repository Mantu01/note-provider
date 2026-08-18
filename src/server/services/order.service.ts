import { Order, type OrderDoc } from "../db/models/order.model";
import { Note } from "../db/models/note.model";
import { Group } from "../db/models/group.model";
import { logActivity } from "./activity.service";
import type { RouteContext } from "../lib/api-handler";
import type { AdminDoc } from "../db/models/admin.model";
import { AppError } from "../lib/errors";
import { generateOrderNumber } from "../lib/order-number";
import { createRazorpayOrder } from "../lib/razorpay";
import type { UpdateOrderPayload } from "@/lib/schemas/admin.schema";
import { Types } from "mongoose";

export async function createOrder(
  input: { fullName: string; socialPlatform: string; socialHandle: string; consentAccepted: boolean },
  itemSlug: string,
  itemType: "note" | "group",
  amount: number,
  ctx: { ip: string | null; userAgent: string | null },
): Promise<{ order: OrderDoc; razorpayOrderId: string }> {
  const orderNumber = await generateOrderNumber();

  const itemDoc =
    itemType === "note"
      ? await Note.findOne({ slug: itemSlug }).select("_id title").lean<{ _id: Types.ObjectId; title: string }>().exec()
      : await Group.findOne({ slug: itemSlug }).select("_id name notes").lean<{ _id: Types.ObjectId; name: string; notes: Types.ObjectId[] }>().exec();

  if (!itemDoc) throw AppError.notFound("Item");

  const { id: razorpayOrderId } = await createRazorpayOrder({
    amount,
    receipt: orderNumber,
    notes: {
      orderNumber,
      itemType,
      itemSlug,
      buyerName: input.fullName,
      socialPlatform: input.socialPlatform,
      socialHandle: input.socialHandle,
    },
  });

  const doc = await Order.create({
    orderNumber,
    itemType,
    note: itemType === "note" ? itemDoc._id : null,
    group: itemType === "group" ? itemDoc._id : null,
    amount,
    razorpayOrderId,
    paymentStatus: "created",
    fulfillmentStatus: "pending",
    itemSnapshot: {
      title: itemType === "note" ? ("title" in itemDoc ? itemDoc.title : itemSlug) : ("name" in itemDoc ? itemDoc.name : itemSlug),
      slug: itemSlug,
      price: amount,
      noteIds: itemType === "group" && "notes" in itemDoc ? itemDoc.notes : [],
    },
    buyer: {
      fullName: input.fullName,
      socialPlatform: input.socialPlatform as import("@/lib/types").SocialPlatform,
      socialHandle: input.socialHandle,
      consentAccepted: input.consentAccepted,
    },
  });

  return { order: doc, razorpayOrderId };
}

export async function getOrderById(id: string): Promise<OrderDoc | null> {
  return Order.findById(id).lean().exec();
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDoc | null> {
  return Order.findOne({ orderNumber }).lean().exec();
}

export async function fulfillOrder(
  orderId: string,
  input: UpdateOrderPayload,
  ctx: RouteContext<{}> & { admin: AdminDoc },
): Promise<OrderDoc> {
  const order = await Order.findById(orderId).lean().exec();
  if (!order) throw AppError.notFound("Order");
  if (order.paymentStatus !== "paid") throw AppError.validation({}, "Cannot fulfil an order that has not been paid.");

  const updates: Record<string, unknown> = {};
  if (input.fulfillmentStatus !== undefined) {
    updates.fulfillmentStatus = input.fulfillmentStatus;
    if (input.fulfillmentStatus === "completed") {
      updates.completedAt = new Date();
      updates.completedBy = new Types.ObjectId(String(ctx.admin._id));
    } else {
      updates.completedAt = null;
      updates.completedBy = null;
    }
  }
  if (input.adminNote !== undefined) updates.adminNote = input.adminNote;

  const updated = await Order.findByIdAndUpdate(orderId, updates, { new: true }).lean().exec();
  if (!updated) throw AppError.internal("Failed to update order");

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "order.update_fulfillment",
    description: `Updated order ${order.orderNumber} fulfillment`,
    targetType: "order",
    targetId: orderId,
    targetLabel: order.orderNumber,
    metadata: { from: order.fulfillmentStatus, to: input.fulfillmentStatus },
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return updated;
}

export async function deleteOrder(
  orderId: string,
  ctx: RouteContext<{}> & { admin: AdminDoc },
): Promise<{ deleted: true }> {
  const order = await Order.findById(orderId).lean().exec();
  if (!order) throw AppError.notFound("Order");

  await Order.findByIdAndDelete(orderId).exec();

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "order.delete",
    description: `Deleted order ${order.orderNumber}`,
    targetType: "order",
    targetId: orderId,
    targetLabel: order.orderNumber,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return { deleted: true };
}
