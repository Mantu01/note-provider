import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { toPublicNote } from "@/helpers/mappers/note.mapper";
import { toPublicGroup } from "@/helpers/mappers/group.mapper";
import { toPublicCategory } from "@/helpers/mappers/category.mapper";

export const revalidate = 60;
export const dynamic = "force-dynamic";

const EMPTY_HOME = {
  featuredNotes: [],
  latestNotes: [],
  freeNotes: [],
  featuredGroups: [],
  categories: [],
  stats: { totalNotes: 0, totalCategories: 0, totalDownloads: 0, happyLearners: 0 },
};

export const GET = handler(async () => {
  const [featuredNotes, latestNotes, freeNotes, featuredGroups, categories, totalNotes, totalDownloads, happyLearners, catCounts] = await Promise.all([
    prisma.note.findMany({ where: { isFeatured: true, visibility: "public" }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.note.findMany({ where: { visibility: "public" }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.note.findMany({ where: { pricingType: "free", visibility: "public" }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.group.findMany({ where: { isFeatured: true, visibility: "public" }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.note.count({ where: { visibility: "public" } }),
    prisma.note.aggregate({ where: { visibility: "public" }, _sum: { downloadCount: true } }).then((r) => r._sum.downloadCount ?? 0),
    prisma.order.count({ where: { paymentStatus: "paid" } }),
    prisma.note.groupBy({ by: ["categoryId"], where: { visibility: "public" }, _count: true }),
  ]);
  const countMap = new Map(catCounts.map((c) => [c.categoryId, c._count]));

  const res = ok({
    featuredNotes: featuredNotes.map(toPublicNote),
    latestNotes: latestNotes.map(toPublicNote),
    freeNotes: freeNotes.map(toPublicNote),
    featuredGroups: featuredGroups.map((g) => toPublicGroup(g)),
    categories: categories.map((cat) => toPublicCategory({ ...cat, noteCount: countMap.get(cat.id) ?? 0 }, countMap.get(cat.id) ?? 0)),
    stats: { totalNotes, totalCategories: categories.length, totalDownloads: Number(totalDownloads), happyLearners },
  });
  res.headers.set("Cache-Control", "public, max-age=60, s-maxage=60");
  return res;
});
