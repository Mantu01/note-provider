import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { Note } from "@/server/db/models/note.model";
import { Category } from "@/server/db/models/category.model";
import { toPublicNote } from "@/server/mappers/note.mapper";
import { toPublicCategory } from "@/server/mappers/category.mapper";

export const runtime = "nodejs";

export const GET = handler(async () => {
  const [categories, facets] = await Promise.all([
    Category.find({ isActive: true }).sort({ order: 1 }).lean().exec(),
    Note.aggregate([
      { $match: { visibility: "public" } },
      {
        $facet: {
          categories: [{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }],
          levels: [{ $group: { _id: "$level", count: { $sum: 1 } } }, { $sort: { count: -1 } }],
          subjects: [{ $group: { _id: "$subject", count: { $sum: 1 } } }, { $sort: { count: -1 } }],
          tags: [{ $unwind: "$tags" }, { $group: { _id: "$tags", count: { $sum: 1 } } }, { $sort: { count: -1 } }],
          priceRange: [{ $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } }],
          pricing: [{ $group: { _id: "$pricingType", count: { $sum: 1 } } }],
        },
      },
    ]),
  ]);

  const [catsFacet] = facets;

  const catCounts = new Map(catsFacet.categories.map((c: any) => [c._id.toString(), c.count]));

  return ok({
    categories: categories.map((cat) => ({ name: cat.name, slug: cat.slug, count: catCounts.get(cat._id.toString()) ?? 0 })),
    levels: catsFacet.levels.map((l: any) => ({ value: l._id, label: l._id.charAt(0).toUpperCase() + l._id.slice(1), count: l.count })),
    subjects: catsFacet.subjects.map((s: any) => ({ value: s._id, count: s.count })),
    tags: catsFacet.tags.map((t: any) => ({ value: t._id, count: t.count })),
    priceRange: catsFacet.priceRange[0] ? { minPaise: catsFacet.priceRange[0].min, maxPaise: catsFacet.priceRange[0].max } : { minPaise: 0, maxPaise: 0 },
    pricing: catsFacet.pricing.map((p: any) => ({ value: p._id, count: p.count })),
  });
});
