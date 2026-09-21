import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { NOTE_LEVELS } from "@/lib/constants";

export const GET = handler(async () => {
  const [categories, notes] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.note.findMany({ where: { visibility: "public" }, select: { categoryId: true, level: true, pricingType: true, price: true, tags: true } }),
  ]);

  const subjectCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  const levelCounts = new Map<string, number>();
  const catCounts = new Map<string, number>();
  const pricingCounts = new Map<string, number>();
  const prices: number[] = [];

  for (const note of notes) {
    levelCounts.set(note.level, (levelCounts.get(note.level) ?? 0) + 1);
    catCounts.set(note.categoryId, (catCounts.get(note.categoryId) ?? 0) + 1);
    pricingCounts.set(note.pricingType, (pricingCounts.get(note.pricingType) ?? 0) + 1);
    if (typeof note.price === "number") prices.push(note.price);
    if (Array.isArray(note.tags)) {
      for (const tag of note.tags as string[]) {
        if (tag) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }
  }

  for (const category of categories) {
    const rawSubjects = Array.isArray(category.subjects) ? category.subjects : [];
    for (const subject of rawSubjects) {
      if (subject && typeof subject === "object") {
        const rec = subject as Record<string, unknown>;
        const name = typeof rec.name === "string" ? rec.name : "";
        if (name) subjectCounts.set(name, catCounts.get(category.id) ?? 0);
      }
    }
  }

  const mapEntries = (map: Map<string, number>) =>
    Array.from(map.entries()).map(([value, count]) => ({ value, count }));

  const levels = NOTE_LEVELS.map((level) => ({
    value: level,
    label: level.charAt(0).toUpperCase() + level.slice(1),
    count: levelCounts.get(level) ?? 0,
  }));

  const subjects = mapEntries(subjectCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  const tags = mapEntries(tagCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  const priceRange = {
    minPaise: prices.length ? Math.min(...prices) : 0,
    maxPaise: prices.length ? Math.max(...prices) : 0,
  };
  const pricing = [
    { value: "free" as const, count: pricingCounts.get("free") ?? 0 },
    { value: "paid" as const, count: pricingCounts.get("paid") ?? 0 },
  ];

  const res = ok({
    categories: categories.map((cat) => ({ name: cat.name, slug: cat.slug, count: catCounts.get(cat.id) ?? 0 })),
    levels,
    subjects,
    tags,
    priceRange,
    pricing,
  });
  res.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
  return res;
});
