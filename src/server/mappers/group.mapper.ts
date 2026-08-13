import { formatPriceLabel, toIsoStringRequired } from "@/lib/format";
import type { AdminGroup, PublicGroup, PublicNote } from "@/lib/types";
import { toAdminRef, toCategoryRef } from "./category.mapper";
import { bool, id, nullableNum, nullableStr, num, str, toIdList, type Lean } from "./primitives";

export function toPublicGroup(raw: unknown, notes: PublicNote[] = []): PublicGroup {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const price = num(doc.price);

  return {
    id: id(doc._id),
    slug: str(doc.slug),
    name: str(doc.name),
    description: str(doc.description),
    category: toCategoryRef(doc.category),
    price,
    priceLabel: formatPriceLabel(price, "paid"),
    compareAtPrice: nullableNum(doc.compareAtPrice),
    coverImageUrl: nullableStr(doc.coverImageUrl),
    noteCount: toIdList(doc.notes).length,
    notes,
    isFeatured: bool(doc.isFeatured),
    createdAt: toIsoStringRequired(doc.createdAt as Date),
  };
}

export function toAdminGroup(raw: unknown, notes: PublicNote[] = []): AdminGroup {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    ...toPublicGroup(doc, notes),
    visibility: str(doc.visibility) === "private" ? "private" : "public",
    noteIds: toIdList(doc.notes),
    coverImagePublicId: nullableStr(doc.coverImagePublicId),
    revenuePaise: num(doc.revenuePaise),
    purchaseCount: num(doc.purchaseCount),
    createdBy: toAdminRef(doc.createdBy),
    updatedBy: toAdminRef(doc.updatedBy),
    updatedAt: toIsoStringRequired(doc.updatedAt as Date),
  };
}
