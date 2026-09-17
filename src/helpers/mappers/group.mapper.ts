import { formatPriceLabel, toIsoStringRequired } from "@/lib/format";
import type { AdminGroup, PublicGroup, PublicNote } from "@/lib/types";

type CategoryShape = { id: unknown; name: unknown; slug: unknown; icon: unknown };
type NoteGroupShape = { note: PublicNote | { id: unknown; title: unknown } };

export function toPublicGroup(doc: Record<string, unknown>): PublicGroup {
  const noteGroups = Array.isArray(doc.noteGroups) ? doc.noteGroups as NoteGroupShape[] : [];
  const notes = noteGroups.map((ng) => {
    const note = ng.note;
    if (note && typeof note === "object" && "description" in note) {
      return note as PublicNote;
    }
    return {
      id: String(note?.id ?? ""),
      slug: "",
      title: String(note?.title ?? ""),
      description: "",
      level: "basics" as const,
      category: { id: "", name: "", slug: "", icon: null },
      pricingType: "paid" as const,
      price: 0,
      priceLabel: "",
      compareAtPrice: null,
      coverImageUrl: null,
      pageCount: null,
      fileSizeLabel: null,
      isLocked: true,
      hasPreview: false,
      tags: [],
      isFeatured: false,
      downloadCount: 0,
      purchaseCount: 0,
      createdAt: "",
      updatedAt: "",
    };
  });
  const category = doc.category && typeof doc.category === "object" ? doc.category as CategoryShape : null;

  const price = Number(doc.price ?? 0);
  const pricingType = (String(doc.pricingType ?? "paid") === "free" ? "free" : "paid") as "free" | "paid";

  return {
    id: String(doc.id ?? ""),
    slug: String(doc.slug ?? ""),
    name: String(doc.name ?? ""),
    description: String(doc.description ?? ""),
    category: category
      ? { id: String(category.id), name: String(category.name), slug: String(category.slug), icon: category.icon != null ? String(category.icon) : null }
      : { id: "", name: "", slug: "", icon: null },
    price,
    priceLabel: formatPriceLabel(price, pricingType),
    compareAtPrice: doc.compareAtPrice != null ? Number(doc.compareAtPrice) : null,
    coverImageUrl: doc.coverImageUrl != null ? String(doc.coverImageUrl) : null,
    noteCount: notes.length,
    notes,
    isFeatured: Boolean(doc.isFeatured),
    createdAt: doc.createdAt ? new Date(doc.createdAt as Date | string).toISOString() : "",
  };
}

export function toAdminGroup(doc: Record<string, unknown>): AdminGroup {
  const base = toPublicGroup(doc);
  return {
    ...base,
    visibility: (String(doc.visibility ?? "public") === "private" ? "private" : "public") as "public" | "private",
    noteIds: [],
    coverImagePublicId: doc.coverImagePublicId != null ? String(doc.coverImagePublicId) : null,
    revenuePaise: Number(doc.revenuePaise ?? 0),
    purchaseCount: Number(doc.purchaseCount ?? 0),
    createdBy: doc.createdBy ? { id: String(doc.createdBy), name: "" } : null,
    updatedBy: doc.updatedBy ? { id: String(doc.updatedBy), name: "" } : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as Date | string).toISOString() : "",
  };
}
