import { Types } from "mongoose";
import { Note, type NoteDoc } from "../db/models/note.model";
import { Group, type GroupDoc } from "../db/models/group.model";
import { logActivity } from "./activity.service";
import type { RouteContext } from "../lib/api-handler";
import type { AdminDoc } from "../db/models/admin.model";
import { AppError } from "../lib/errors";
import { uniqueSlug } from "../lib/slug";
import { rupeesToPaise } from "@/lib/format";
import { MIN_PAID_PRICE_PAISE } from "@/lib/constants";
import type { CreateNoteInput, UpdateNoteInput } from "@/lib/schemas/note.schema";

export async function listNotes(
  filter: Record<string, unknown>,
  sort: Record<string, import("mongoose").SortOrder>,
  skip: number,
  limit: number,
): Promise<{ items: NoteDoc[]; total: number }> {
  const [items, total] = await Promise.all([
    Note.find(filter).sort(sort).skip(skip).limit(limit).populate("category").lean().exec(),
    Note.countDocuments(filter).exec(),
  ]);
  return { items, total };
}

export async function getNoteBySlug(slug: string): Promise<NoteDoc | null> {
  return Note.findOne({ slug, visibility: "public" }).populate("category").lean().exec();
}

export async function getNoteById(id: string): Promise<NoteDoc | null> {
  return Note.findById(id).populate("category").lean().exec();
}

export async function createNote(
  input: CreateNoteInput,
  ctx: RouteContext & { admin: AdminDoc },
): Promise<NoteDoc> {
  const pricePaise = rupeesToPaise(Number(input.price));
  const compareAtPricePaise = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;

  if (input.pricingType === "paid" && pricePaise < MIN_PAID_PRICE_PAISE) {
    throw AppError.validation({ price: `Price must be at least ₹${(MIN_PAID_PRICE_PAISE / 100).toFixed(2)}` });
  }

  const slug = await uniqueSlug(Note, input.title);

  const doc = await Note.create({
    ...input,
    price: pricePaise,
    compareAtPrice: compareAtPricePaise,
    slug,
    createdBy: new Types.ObjectId(String(ctx.admin._id)),
    updatedBy: new Types.ObjectId(String(ctx.admin._id)),
  });

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "note.create",
    description: `Created note "${input.title}"`,
    targetType: "note",
    targetId: doc._id.toString(),
    targetLabel: input.title,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return doc;
}

export async function updateNote(
  id: string,
  input: UpdateNoteInput,
  ctx: RouteContext & { admin: AdminDoc },
): Promise<NoteDoc> {
  const existing = await Note.findById(id).lean().exec();
  if (!existing) throw AppError.notFound("Note");

  const updates: Record<string, unknown> = { updatedBy: new Types.ObjectId(String(ctx.admin._id)) };
  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.categoryId !== undefined) updates.category = input.categoryId;
  if (input.level !== undefined) updates.level = input.level;
  if (input.visibility !== undefined) updates.visibility = input.visibility;
  if (input.pricingType !== undefined) updates.pricingType = input.pricingType;
  if (input.price !== undefined) updates.price = rupeesToPaise(Number(input.price));
  if (input.compareAtPrice !== undefined) updates.compareAtPrice = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;
  if (input.tags !== undefined) updates.tags = input.tags;
  if (input.isFeatured !== undefined) updates.isFeatured = input.isFeatured;
  if (input.pageCount !== undefined) updates.pageCount = input.pageCount;
  if (input.fullFile !== undefined && input.fullFile) {
    updates.fullFileUrl = input.fullFile.url;
    updates.fullFilePublicId = input.fullFile.publicId;
    updates.fullFileBytes = input.fullFile.bytes;
  }
  if (input.previewFile !== undefined) {
    if (input.previewFile) {
      updates.previewFileUrl = input.previewFile.url;
      updates.previewFilePublicId = input.previewFile.publicId;
      updates.previewFileBytes = input.previewFile.bytes;
    } else {
      updates.previewFileUrl = null;
      updates.previewFilePublicId = null;
      updates.previewFileBytes = null;
    }
  }
  if (input.coverImage !== undefined && input.coverImage) {
    updates.coverImageUrl = input.coverImage.url;
    updates.coverImagePublicId = input.coverImage.publicId;
  }

  const updated = await Note.findByIdAndUpdate(id, updates, { new: true }).lean().exec();
  if (!updated) throw AppError.internal("Failed to update note");

  const changedFields = Object.keys(input).filter((key) => {
    const oldVal = (existing as Record<string, unknown>)[key];
    const newVal = (input as Record<string, unknown>)[key];
    return JSON.stringify(oldVal) !== JSON.stringify(newVal);
  });

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "note.update",
    description: `Updated note "${updated.title}"`,
    targetType: "note",
    targetId: id,
    targetLabel: updated.title,
    metadata: { changedFields },
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return updated;
}

export async function deleteNote(
  id: string,
  ctx: RouteContext & { admin: AdminDoc },
): Promise<{ deleted: true; affectedGroups: { id: string; name: string; slug: string; hiddenBecauseEmpty: boolean }[] }> {
  const note = await Note.findById(id).lean().exec();
  if (!note) throw AppError.notFound("Note");

  const groupIds = await Group.distinct("_id", { notes: id });
  const affectedGroups: { id: string; name: string; slug: string; hiddenBecauseEmpty: boolean }[] = [];

  for (const groupId of groupIds) {
    const group = await Group.findById(groupId).lean().exec();
    if (!group) continue;
    const updatedNotes = ((group.notes as unknown[]).map((n) => String(n))).filter((n) => n !== id);
    if (updatedNotes.length === 0) {
      await Group.findByIdAndUpdate(groupId, { visibility: "private" }).exec();
      affectedGroups.push({ id: group._id.toString(), name: group.name, slug: group.slug, hiddenBecauseEmpty: true });
    } else {
      await Group.findByIdAndUpdate(groupId, { notes: updatedNotes }).exec();
    }
  }

  await Note.findByIdAndDelete(id).exec();

  await logActivity({
    adminId: ctx.admin._id.toString(),
    action: "note.delete",
    description: `Deleted note "${note.title}"`,
    targetType: "note",
    targetId: id,
    targetLabel: note.title,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return { deleted: true, affectedGroups };
}

export async function getRelatedNotes(categoryId: string, noteId: string, limit: number): Promise<NoteDoc[]> {
  return (Note as any).find({ _id: { $ne: noteId }, category: categoryId, visibility: "public" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("category")
    .lean()
    .exec();
}

export async function getGroupsByNoteId(noteId: string): Promise<GroupDoc[]> {
  return Group.find({ notes: noteId, visibility: "public" }).populate("category").populate({ path: "notes", populate: { path: "category" } }).lean().exec();
}

export async function getFeaturedNotes(limit: number): Promise<NoteDoc[]> {
  return Note.find({ isFeatured: true, visibility: "public" }).sort({ createdAt: -1 }).limit(limit).populate("category").lean().exec();
}

export async function getLatestNotes(limit: number): Promise<NoteDoc[]> {
  return Note.find({ visibility: "public" }).sort({ createdAt: -1 }).limit(limit).populate("category").lean().exec();
}

export async function getFreeNotes(limit: number): Promise<NoteDoc[]> {
  return Note.find({ pricingType: "free", visibility: "public" }).sort({ createdAt: -1 }).limit(limit).populate("category").lean().exec();
}

export async function getNotesByCategory(categoryId: string, limit: number): Promise<NoteDoc[]> {
  return Note.find({ category: categoryId, visibility: "public" }).sort({ createdAt: -1 }).limit(limit).populate("category").lean().exec();
}

export async function incrementDownloadCount(noteId: string): Promise<void> {
  await (Note as any).updateOne({ _id: noteId }, { $inc: { downloadCount: 1 } }).exec();
}

export async function incrementPurchaseCount(model: typeof Note | typeof Group, id: string): Promise<void> {
  await (model as any).updateOne({ _id: id }, { $inc: { purchaseCount: 1 } }).exec();
}

export async function addRevenuePaise(model: typeof Note | typeof Group, id: string, amount: number): Promise<void> {
  await (model as any).updateOne({ _id: id }, { $inc: { revenuePaise: amount } }).exec();
}

