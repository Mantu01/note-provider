import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { Note } from "@/server/db/models/note.model";
import { Group } from "@/server/db/models/group.model";
import { Category } from "@/server/db/models/category.model";
import { Order } from "@/server/db/models/order.model";
import { toPublicNote } from "@/server/mappers/note.mapper";
import { toPublicGroup } from "@/server/mappers/group.mapper";
import { toPublicCategory } from "@/server/mappers/category.mapper";

export const runtime = "nodejs";

export const GET = handler(async () => {
  const [featuredNotes, latestNotes, freeNotes, featuredGroups, categories, totalNotes, totalDownloads, happyLearners] = await Promise.all([
    Note.find({ isFeatured: true, visibility: "public" }).populate("category").sort({ createdAt: -1 }).limit(6).lean().exec(),
    Note.find({ visibility: "public" }).populate("category").sort({ createdAt: -1 }).limit(8).lean().exec(),
    Note.find({ pricingType: "free", visibility: "public" }).populate("category").sort({ createdAt: -1 }).limit(4).lean().exec(),
    Group.find({ isFeatured: true, visibility: "public" }).populate("category").sort({ createdAt: -1 }).limit(3).lean().exec(),
    Category.find({ isActive: true }).sort({ order: 1 }).limit(8).lean().exec(),
    Note.countDocuments({ visibility: "public" }).exec(),
    Note.aggregate([{ $match: { visibility: "public" } }, { $group: { _id: null, total: { $sum: "$downloadCount" } } }]).then(([r]) => r?.total ?? 0),
    Order.countDocuments({ paymentStatus: "paid" }).exec(),
  ]);

  const catCounts = await Note.aggregate([
    { $match: { visibility: "public" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const countMap = new Map(catCounts.map((c) => [c._id.toString(), c.count]));

  return ok({
    featuredNotes: featuredNotes.map(toPublicNote),
    latestNotes: latestNotes.map(toPublicNote),
    freeNotes: freeNotes.map(toPublicNote),
    featuredGroups: featuredGroups.map((g) => toPublicGroup(g as any, [])),
    categories: categories.map((cat) => toPublicCategory({ ...cat, noteCount: countMap.get(cat._id.toString()) ?? 0 }, countMap.get(cat._id.toString()) ?? 0)),
    stats: {
      totalNotes,
      totalCategories: categories.length,
      totalDownloads,
      happyLearners,
    },
  });
});
