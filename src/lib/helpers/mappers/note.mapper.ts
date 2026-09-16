import { formatFileSizeLabel, formatPriceLabel, toIsoStringRequired } from "@/lib/format";
import type { AdminNote, PublicNote } from "@/lib/types";
import { nullableNum, nullableStr, num, str } from "./primitives";

export function toPublicNote(raw: unknown): PublicNote {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pricingType = str(doc.pricingType) === "paid" ? "paid" : "free";
  const price = num(doc.price);

  const cat = doc.category && typeof doc.category === "object" ? doc.category : null;
  return {
    id: String(doc.id ?? ""),
    slug: str(doc.slug),
    title: str(doc.title),
    description: str(doc.description),
    level: str(doc.level) as PublicNote["level"],
    category: cat
      ? { id: String((cat as any).id), name: String((cat as any).name), slug: String((cat as any).slug), icon: nullableStr((cat as any).icon) }
      : { id: "", name: "", slug: "", icon: null },
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
    isFeatured: Boolean(doc.isFeatured),
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
    createdBy: doc.createdBy ? { id: String(doc.createdBy), name: "" } : null,
    updatedBy: doc.updatedBy ? { id: String(doc.updatedBy), name: "" } : null,
  };
}
