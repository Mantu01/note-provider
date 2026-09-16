import { formatPriceLabel, toIsoStringRequired } from "@/lib/format";
import type { AdminGroup, PublicGroup } from "@/lib/types";

export function toPublicGroup(doc: Record<string, unknown>): PublicGroup {
  const noteGroups = Array.isArray(doc.noteGroups) ? doc.noteGroups : [];
  const notes = noteGroups.map((ng: any) => ({ id: "", title: "" } as any));
  const category = doc.category && typeof doc.category === "object"
    ? { id: String((doc.category as any).id), name: String((doc.category as any).name), slug: String((doc.category as any).slug), icon: null }
    : { id: "", name: "", slug: "", icon: null };

  const price = Number(doc.price ?? 0);
  const pricingType = (String(doc.pricingType ?? "paid") === "free" ? "free" : "paid") as "free" | "paid";

  return {
    id: String(doc.id ?? ""),
    slug: String(doc.slug ?? ""),
    name: String(doc.name ?? ""),
    description: String(doc.description ?? ""),
    category,
    price,
    priceLabel: formatPriceLabel(price, pricingType),
    compareAtPrice: doc.compareAtPrice != null ? Number(doc.compareAtPrice) : null,
    coverImageUrl: doc.coverImageUrl != null ? String(doc.coverImageUrl) : null,
    noteCount: notes.length,
    notes,
    isFeatured: Boolean(doc.isFeatured),
    createdAt: doc.createdAt ? new Date(doc.createdAt as any).toISOString() : "",
  };
}

export function toAdminGroup(doc: Record<string, unknown>): AdminGroup {
  return {
    ...toPublicGroup(doc),
    visibility: (String(doc.visibility ?? "public") === "private" ? "private" : "public") as "public" | "private",
    noteIds: [],
    coverImagePublicId: doc.coverImagePublicId != null ? String(doc.coverImagePublicId) : null,
    revenuePaise: Number(doc.revenuePaise ?? 0),
    purchaseCount: Number(doc.purchaseCount ?? 0),
    createdBy: doc.createdBy ? { id: String(doc.createdBy), name: "" } : null,
    updatedBy: doc.updatedBy ? { id: String(doc.updatedBy), name: "" } : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as any).toISOString() : "",
  };
}
