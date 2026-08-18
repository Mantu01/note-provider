import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { Note } from "@/server/db/models/note.model";
import { Category } from "@/server/db/models/category.model";

export const revalidate = 300;
export const dynamic = "force-dynamic";

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

  const catCounts = new Map(catsFacet.categories.map((c: { _id: unknown; count: unknown }) => [String(c._id), Number(c.count)]));

  const res = ok({
    categories: categories.map((cat) => ({ name: cat.name, slug: cat.slug, count: catCounts.get(cat._id.toString()) ?? 0 })),
    levels: catsFacet.levels.map((l: { _id: string; count: unknown }) => ({ value: l._id, label: l._id.charAt(0).toUpperCase() + l._id.slice(1), count: Number(l.count) })),
    subjects: catsFacet.subjects.map((s: { _id: string; count: unknown }) => ({ value: s._id, count: Number(s.count) })),
    tags: catsFacet.tags.map((t: { _id: string; count: unknown }) => ({ value: t._id, count: Number(t.count) })),
    priceRange: catsFacet.priceRange[0] ? { minPaise: Number(catsFacet.priceRange[0].min), maxPaise: Number(catsFacet.priceRange[0].max) } : { minPaise: 0, maxPaise: 0 },
    pricing: catsFacet.pricing.map((p: { _id: string; count: unknown }) => ({ value: p._id, count: Number(p.count) })),
  });
  res.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
  return res;
});
