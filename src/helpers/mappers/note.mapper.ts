import { formatPriceLabel, toIsoStringRequired } from "@/lib/format";
import type { AdminNote, PublicNote } from "@/lib/types";
import { nullableNum, nullableStr, num, str } from "./primitives";

type CategoryShape = { id: unknown; name: unknown; slug: unknown; icon: unknown };

export function toPublicNote(raw: unknown): PublicNote {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pricingType = str(doc.pricingType) === "paid" ? "paid" : "free";
  const price = num(doc.price);

  const cat = doc.category && typeof doc.category === "object" ? doc.category as CategoryShape : null;
  return {
    id: String(doc.id ?? ""),
    slug: str(doc.slug),
    title: str(doc.title),
    description: str(doc.description),
    level: str(doc.level) as PublicNote["level"],
    category: cat
      ? { id: String(cat.id), name: String(cat.name), slug: String(cat.slug), icon: nullableStr(cat.icon) }
      : { id: "", name: "", slug: "", icon: null },
    pricingType,
    price,
    priceLabel: formatPriceLabel(price, pricingType),
    compareAtPrice: nullableNum(doc.compareAtPrice),
    coverImageUrl: nullableStr(doc.coverImageUrl),
    previewFileUrl: nullableStr(doc.previewFileUrl),
    pageCount: nullableNum(doc.pageCount),
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
    previewFileUrl: nullableStr(doc.previewFileUrl),
    createdBy: doc.createdBy ? { id: String(doc.createdBy), name: "" } : null,
    updatedBy: doc.updatedBy ? { id: String(doc.updatedBy), name: "" } : null,
  };
}
