import { DELIVERY_ETA_HOURS, ORDER_CURRENCY } from "@/lib/constants";
import { formatPrice, maskSocialHandle, toIsoString, toIsoStringRequired } from "@/lib/format";
import type { AdminLead, AdminOrder, PublicOrder } from "@/lib/types";
import { toAdminRef } from "./category.mapper";
import { id, isPopulated, nullableStr, num, str, toIdList, type Lean } from "./primitives";

function buyerOf(doc: Record<string, unknown>): Record<string, unknown> {
  return (doc.buyer as Record<string, unknown>) ?? {};
}

function snapshotOf(doc: Record<string, unknown>): Record<string, unknown> {
  return (doc.itemSnapshot as Record<string, unknown>) ?? {};
}

export function toPublicOrder(raw: unknown): PublicOrder {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const buyer = buyerOf(doc);
  const snapshot = snapshotOf(doc);
  const amount = num(doc.amount);
  const platform = str(buyer.socialPlatform) as PublicOrder["buyer"]["socialPlatform"];

  return {
    id: id(doc._id),
    orderNumber: str(doc.orderNumber),
    itemType: str(doc.itemType) === "group" ? "group" : "note",
    itemTitle: str(snapshot.title),
    itemSlug: str(snapshot.slug),
    amount,
    amountLabel: formatPrice(amount),
    currency: ORDER_CURRENCY,
    paymentStatus: str(doc.paymentStatus) as PublicOrder["paymentStatus"],
    fulfillmentStatus: str(doc.fulfillmentStatus) as PublicOrder["fulfillmentStatus"],
    buyer: {
      fullName: str(buyer.fullName),
      socialPlatform: platform,
      socialHandleMasked: maskSocialHandle(platform, str(buyer.socialHandle)),
    },
    deliveryEtaHours: DELIVERY_ETA_HOURS,
    createdAt: toIsoStringRequired(doc.createdAt as Date),
    paidAt: toIsoString(doc.paidAt as Date | null),
    completedAt: toIsoString(doc.completedAt as Date | null),
  };
}

export function toAdminOrder(raw: unknown): AdminOrder {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const buyer = buyerOf(doc);
  const snapshot = snapshotOf(doc);
  const itemType = str(doc.itemType) === "group" ? "group" : "note";
  const itemRef = itemType === "group" ? doc.group : doc.note;

  return {
    ...toPublicOrder(doc),
    razorpayOrderId: str(doc.razorpayOrderId),
    razorpayPaymentId: nullableStr(doc.razorpayPaymentId),
    razorpaySignature: nullableStr(doc.razorpaySignature),
    paymentMethod: nullableStr(doc.paymentMethod),
    failureReason: nullableStr(doc.failureReason),
    buyerFull: {
      fullName: str(buyer.fullName),
      socialPlatform: str(buyer.socialPlatform) as AdminOrder["buyerFull"]["socialPlatform"],
      socialHandle: str(buyer.socialHandle),
      consentAccepted: true,
      ipAddress: nullableStr(buyer.ipAddress),
      userAgent: nullableStr(buyer.userAgent),
    },
    item: {
      id: isPopulated(itemRef) ? id(itemRef._id) : id(itemRef),
      type: itemType,
      slug: str(snapshot.slug),
      title: str(snapshot.title),
      noteIds: toIdList(snapshot.noteIds),
    },
    adminNote: nullableStr(doc.adminNote),
    completedBy: toAdminRef(doc.completedBy),
    updatedAt: toIsoStringRequired(doc.updatedAt as Date),
  };
}

export function toAdminLead(raw: unknown): AdminLead {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const buyer = buyerOf(doc);
  const snapshot = snapshotOf(doc);
  const amount = num(doc.amount);

  return {
    id: id(doc._id),
    orderId: id(doc._id),
    orderNumber: str(doc.orderNumber),
    fullName: str(buyer.fullName),
    socialPlatform: str(buyer.socialPlatform) as AdminLead["socialPlatform"],
    socialHandle: str(buyer.socialHandle),
    itemTitle: str(snapshot.title),
    amount,
    amountLabel: formatPrice(amount),
    paymentStatus: str(doc.paymentStatus) as AdminLead["paymentStatus"],
    fulfillmentStatus: str(doc.fulfillmentStatus) as AdminLead["fulfillmentStatus"],
    createdAt: toIsoStringRequired(doc.createdAt as Date),
  };
}
