import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Group } from "@/server/db/models/group.model";
import { Note } from "@/server/db/models/note.model";
import { toPublicGroup } from "@/server/mappers/group.mapper";
import { toPublicNote } from "@/server/mappers/note.mapper";
import { Types } from "mongoose";

export const runtime = "nodejs";
export const revalidate = 600;
export const dynamic = "force-dynamic";

export const GET = handler(async (ctx) => {
  const { slug } = await ctx.params;

  const group = await Group.findOne({ slug, visibility: "public" }).lean().exec();
  if (!group) throw AppError.notFound("Group");

  const categoryId = String((group.category as { _id?: string | Types.ObjectId } | null | undefined)?._id ?? group.category ?? "");

  const [notes, relatedGroups] = await Promise.all([
    (Note as any).find({ _id: { $in: group.notes.map((n) => String(n)) }, visibility: "public" })
      .populate("category")
      .lean()
      .exec(),
    (Group as any).find({ _id: { $ne: group._id }, category: categoryId, visibility: "public" })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()
      .exec(),
  ]);

  return ok({
    group: toPublicGroup(group as unknown as Record<string, unknown>, notes.map(toPublicNote)),
    relatedGroups: relatedGroups.map((g: Record<string, unknown>) => toPublicGroup(g)),
  });
});
