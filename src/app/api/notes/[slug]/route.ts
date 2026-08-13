import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Note } from "@/server/db/models/note.model";
import { Group } from "@/server/db/models/group.model";
import { toPublicNote } from "@/server/mappers/note.mapper";
import { toPublicGroup } from "@/server/mappers/group.mapper";
import { parsePagination, buildPagination } from "@/server/lib/query";

export const runtime = "nodejs";

export const GET = handler(async (ctx) => {
  const { slug } = await ctx.params;

  const note = await Note.findOne({ slug, visibility: "public" }).populate("category").lean().exec();
  if (!note) throw AppError.notFound("Note");

  const [relatedNotes, groups] = await Promise.all([
    Note.find({ _id: { $ne: note._id.toString() as any }, category: note.category.toString() as any, visibility: "public" })
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(4)
      .lean()
      .exec(),
    Group.find({ notes: { $in: [note._id.toString()] as any }, visibility: "public" }).populate("category").lean().exec(),
  ]);

  return ok({
    note: toPublicNote(note),
    relatedNotes: relatedNotes.map(toPublicNote),
    groups: groups.map((g) => toPublicGroup(g)),
  });
});
