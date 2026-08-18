import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { Note } from "@/server/db/models/note.model";
import { Group } from "@/server/db/models/group.model";
import { toPublicNote } from "@/server/mappers/note.mapper";
import { toPublicGroup } from "@/server/mappers/group.mapper";
import { Types } from "mongoose";

export const runtime = "nodejs";
export const revalidate = 600;
export const dynamic = "force-dynamic";

export const GET = handler(async (ctx) => {
  const { slug } = await ctx.params;

  const note = await Note.findOne({ slug, visibility: "public" }).populate("category").lean().exec();
  if (!note) throw AppError.notFound("Note");

  const categoryId = String((note.category as { _id?: string | Types.ObjectId } | null | undefined)?._id ?? "");

  const [relatedNotes, groups] = await Promise.all([
    (Note as any).find({ _id: { $ne: String(note._id) }, category: categoryId, visibility: "public" })
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(4)
      .lean()
      .exec(),
    (Group as any).find({ notes: { $in: [String(note._id)] }, visibility: "public" }).populate("category").lean().exec(),
  ]);

  return ok({
    note: toPublicNote(note),
    relatedNotes: relatedNotes.map(toPublicNote),
    groups: groups.map((g: Record<string, unknown>) => toPublicGroup(g)),
  });
});
