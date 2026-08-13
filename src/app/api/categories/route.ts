import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { Category } from "@/server/db/models/category.model";
import { Note } from "@/server/db/models/note.model";
import { toPublicCategory } from "@/server/mappers/category.mapper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

export const GET = handler(async () => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean().exec();

  const counts = await Note.aggregate([
    { $match: { visibility: "public" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

  return ok(
    categories.map((cat) => toPublicCategory({ ...cat, noteCount: countMap.get(cat._id.toString()) ?? 0 }, countMap.get(cat._id.toString()) ?? 0)),
  );
});
