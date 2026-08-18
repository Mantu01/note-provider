import { adminHandler } from "@/server/lib/api-handler";
import { fail, ok } from "@/server/lib/api-response";
import { Types } from "mongoose";
import { Group } from "@/server/db/models/group.model";
import { Note } from "@/server/db/models/note.model";
import { logActivity } from "@/server/services/activity.service";
import { toAdminGroup } from "@/server/mappers/group.mapper";
import { createGroupSchema } from "@/lib/schemas/group.schema";
import { uniqueSlug } from "@/server/lib/slug";
import { AppError } from "@/server/lib/errors";
import { rupeesToPaise } from "@/lib/format";
import { validateNoteIdsExist } from "@/server/lib/note-validation";

export const runtime = "nodejs";

export const GET = adminHandler(async (ctx) => {
  const page = Number(ctx.searchParams.get("page")) || 1;
  const limit = Number(ctx.searchParams.get("limit")) || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Group.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category")
      .populate("createdBy", "_id name")
      .populate("notes", "_id title price subject category")
      .lean()
      .exec(),
    Group.countDocuments().exec(),
  ]);

  return ok({
    items: items.map((item) => toAdminGroup(item as unknown as Record<string, unknown>)),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 },
  });
});

export const POST = adminHandler(async (ctx) => {
  const body = await ctx.req.json();
  const parsed = createGroupSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail(AppError.validation(fields, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const { admin } = ctx;
  const input = parsed.data;

  const noteIds = input.noteIds.filter((id) => id.trim());
  const uniqueIds = Array.from(new Set(noteIds));

  await validateNoteIdsExist(uniqueIds);

  const baseSlug = uniqueSlug(Group, input.name);
  const slug = await baseSlug;

  const createdDoc = await Group.create({
    name: input.name,
    description: input.description,
    category: input.categoryId,
    price: rupeesToPaise(input.price),
    compareAtPrice: input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null,
    notes: uniqueIds,
    coverImageUrl: input.coverImage?.url ?? null,
    coverImagePublicId: input.coverImage?.publicId ?? null,
    visibility: input.visibility,
    isFeatured: input.isFeatured,
    slug,
    createdBy: admin.id,
    updatedBy: admin.id,
  });

  const doc = await Group.findById(createdDoc._id)
    .populate("category")
    .populate("createdBy", "_id name")
    .populate({ path: "notes", populate: { path: "category" } })
    .lean()
    .exec();

  await logActivity({
    adminId: admin.id,
    action: "group.create",
    description: `Created bundle "${input.name}" with ${uniqueIds.length} notes`,
    targetType: "group",
    targetId: createdDoc._id.toString(),
    targetLabel: input.name,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok(toAdminGroup(doc ?? createdDoc.toJSON()));
});
