import { ORDER_CURRENCY } from "@/lib/constants";
import { formatPrice, toIsoString, toIsoStringRequired } from "@/lib/format";
import type { AdminOrder, PublicOrder } from "@/lib/types";
import { toAdminRef } from "./category.mapper";
import { id, isPopulated, nullableStr, num, str, toIdList, bool } from "./primitives";

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

  return {
    id: id(doc.id),
    orderNumber: str(doc.orderNumber),
    itemType: str(doc.itemType) === "group" ? "group" : "note",
    itemTitle: str(snapshot.title),
    itemSlug: str(snapshot.slug),
    amount,
    amountLabel: formatPrice(amount),
    currency: ORDER_CURRENCY,
    paymentStatus: str(doc.paymentStatus) as PublicOrder["paymentStatus"],
    fulfillmentStatus: str(doc.fulfillmentStatus) as PublicOrder["fulfillmentStatus"],
    isDownloaded: bool(doc.isDownloaded),
    coverImageUrl: nullableStr(doc.coverImageUrl),
    buyer: { fullName: str(buyer.fullName) },
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
    paymentMethod: nullableStr(doc.paymentMethod),
    failureReason: nullableStr(doc.failureReason),
    buyerFull: {
      fullName: str(buyer.fullName),
      consentAccepted: buyer.consentAccepted === true,
      ipAddress: nullableStr(buyer.ipAddress),
      userAgent: nullableStr(buyer.userAgent),
    },
    item: {
      id: isPopulated(itemRef) ? id(itemRef.id) : id(itemRef),
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
