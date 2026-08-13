import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Group } from "@/server/db/models/group.model";
import { Note } from "@/server/db/models/note.model";
import { toPublicGroup } from "@/server/mappers/group.mapper";
import { toPublicNote } from "@/server/mappers/note.mapper";

export const runtime = "nodejs";

export const GET = handler(async (ctx) => {
  const { slug } = await ctx.params;

  const group = await Group.findOne({ slug, visibility: "public" }).lean().exec();
  if (!group) throw AppError.notFound("Group");

  const [notes, relatedGroups] = await Promise.all([
    Note.find({ _id: { $in: group.notes.map((n) => n.toString()) as any }, visibility: "public" })
      .populate("category")
      .lean()
      .exec(),
    Group.find({ _id: { $ne: group._id.toString() as any }, category: group.category.toString(), visibility: "public" })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()
      .exec(),
  ]);

  return ok({
    group: toPublicGroup(group as any, notes.map(toPublicNote)),
    relatedGroups: relatedGroups.map((g) => toPublicGroup(g as any)),
  });
});
