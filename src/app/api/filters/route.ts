import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  const [categories, notes] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.note.findMany({ where: { visibility: "public" } }),
  ]);

  const counts = notes.reduce((acc, n) => {
    acc[n.level as string] = (acc[n.level as string] || 0) + 1;
    if (Array.isArray((n as any).subjects)) {
      for (const s of (n as any).subjects as string[]) acc[s] = (acc[s] || 0) + 1;
    }
    if (Array.isArray(n.tags)) {
      for (const t of n.tags as string[]) acc[t] = (acc[t] || 0) + 1;
    }
    acc[n.categoryId] = (acc[n.categoryId] || 0) + 1;
    acc[`price_${n.pricingType}`] = (acc[`price_${n.pricingType}`] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const prices = notes.map((n) => n.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const catCounts = notes.reduce((acc, n) => { acc[n.categoryId] = (acc[n.categoryId] || 0) + 1; return acc; }, {} as Record<string, number>);

  const levels = (["basics", "intermediate", "advance"] as const).map((l) => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1), count: counts[l] ?? 0 }));
  const { subjects: subjectEntries, tags: tagEntries } = Object.entries(counts).reduce(
    (acc, [key]) => {
      const numeric = key !== "" && isFinite(Number(key));
      (acc[numeric ? "subjects" : "tags"] as string[]).push(key);
      return acc;
    },
    { subjects: [] as string[], tags: [] as string[] },
  );
  const subjects = subjectEntries
    .filter((k) => !["basics", "intermediate", "advance"].includes(k) && !k.startsWith("price_"))
    .map((value) => ({ value, count: counts[value] ?? 0 }))
    .sort((a, b) => (counts[b.value] ?? 0) - (counts[a.value] ?? 0))
    .slice(0, 20);
  const tags = tagEntries
    .filter((k) => !["basics", "intermediate", "advance"].includes(k) && !k.startsWith("price_"))
    .map((value) => ({ value, count: counts[value] ?? 0 }))
    .sort((a, b) => (counts[b.value] ?? 0) - (counts[a.value] ?? 0))
    .slice(0, 20);
  const priceRange = { minPaise: minPrice, maxPaise: maxPrice };
  const pricing = [
    { value: "free", count: counts["price_free"] ?? 0 },
    { value: "paid", count: counts["price_paid"] ?? 0 },
  ];

  const res = ok({
    categories: categories.map((cat) => ({ name: cat.name, slug: cat.slug, count: catCounts[cat.id] ?? 0 })),
    levels,
    subjects,
    tags,
    priceRange,
    pricing,
  });
  res.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
  return res;
});
