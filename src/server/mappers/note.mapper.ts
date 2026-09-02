import { formatFileSizeLabel, formatPriceLabel, toIsoStringRequired } from "@/lib/format";
import type { AdminNote, PublicNote } from "@/lib/types";
import { toAdminRef, toCategoryRef } from "./category.mapper";
import { bool, id, nullableNum, nullableStr, num, str } from "./primitives";

export function toPublicNote(raw: unknown): PublicNote {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pricingType = str(doc.pricingType) === "paid" ? "paid" : "free";
  const price = num(doc.price);

  return {
    id: id(doc._id),
    slug: str(doc.slug),
    title: str(doc.title),
    description: str(doc.description),
    level: str(doc.level) as PublicNote["level"],
    category: toCategoryRef(doc.category),
    pricingType,
    price,
    priceLabel: formatPriceLabel(price, pricingType),
    compareAtPrice: nullableNum(doc.compareAtPrice),
    coverImageUrl: nullableStr(doc.coverImageUrl),
    pageCount: nullableNum(doc.pageCount),
    fileSizeLabel: formatFileSizeLabel(nullableNum(doc.fullFileBytes)),
    isLocked: pricingType === "paid",
    hasPreview: Boolean(nullableStr(doc.previewFileUrl)),
    tags: Array.isArray(doc.tags) ? doc.tags.flatMap((tag) => (typeof tag === "string" && tag.trim() ? [tag.trim()] : [])) : [],
    isFeatured: bool(doc.isFeatured),
    downloadCount: num(doc.downloadCount),
    purchaseCount: num(doc.purchaseCount),
    createdAt: toIsoStringRequired(doc.createdAt as Date),
    updatedAt: toIsoStringRequired(doc.updatedAt as Date),
  };
}

export function toAdminNote(raw: unknown): AdminNote {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    ...toPublicNote(doc),
    visibility: str(doc.visibility) === "private" ? "private" : "public",
    fullFileUrl: nullableStr(doc.fullFileUrl),
    fullFilePublicId: nullableStr(doc.fullFilePublicId),
    fullFileBytes: num(doc.fullFileBytes),
    pdfSource: str(doc.pdfSource) === "drive" ? "drive" : "upload",
    drivePdfUrl: nullableStr(doc.drivePdfUrl),
    previewFileUrl: nullableStr(doc.previewFileUrl),
    previewFilePublicId: nullableStr(doc.previewFilePublicId),
    previewFileBytes: nullableNum(doc.previewFileBytes),
    coverImagePublicId: nullableStr(doc.coverImagePublicId),
    createdBy: toAdminRef(doc.createdBy),
    updatedBy: toAdminRef(doc.updatedBy),
  };
}
