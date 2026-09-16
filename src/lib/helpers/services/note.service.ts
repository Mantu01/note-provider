import { prisma } from "../db";
import { AppError } from "../errors";
import { uniqueSlug } from "../slug";
import { validateNoteIdsExist } from "../note-validation";
import type { RouteContext } from "../api-handler";
import type { CreateNoteInput, UpdateNoteInput } from "@/lib/schemas/note.schema";
import { rupeesToPaise } from "@/lib/format";
import { MIN_PAID_PRICE_PAISE } from "@/lib/constants";

export async function listNotes(
  where: Record<string, unknown>,
  orderBy: Record<string, "asc" | "desc">,
  skip: number,
  limit: number,
): Promise<{ items: import("@prisma/client").Note[]; total: number }> {
  const [items, total] = await Promise.all([
    prisma.note.findMany({ where, orderBy, skip, take: limit, include: { category: true } }),
    prisma.note.count({ where }),
  ]);
  return { items, total };
}

export async function getNoteBySlug(slug: string): Promise<import("@prisma/client").Note | null> {
  return prisma.note.findUnique({ where: { slug, visibility: "public" }, include: { category: true } });
}

export async function getNoteById(id: string): Promise<import("@prisma/client").Note | null> {
  return prisma.note.findUnique({ where: { id }, include: { category: true } });
}

export async function createNote(
  input: CreateNoteInput,
  ctx: RouteContext & { admin: { id: string; name: string; email: string; isHead: boolean } },
): Promise<import("@prisma/client").Note> {
  const pricePaise = rupeesToPaise(Number(input.price));
  const compareAtPricePaise = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;

  if (input.pricingType === "paid" && pricePaise < MIN_PAID_PRICE_PAISE) {
    throw AppError.validation({ price: `Price must be at least ₹${(MIN_PAID_PRICE_PAISE / 100).toFixed(2)}` });
  }

  const slug = await uniqueSlug("note", input.title);

  return prisma.note.create({
    data: {
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      level: input.level,
      visibility: input.visibility,
      pricingType: input.pricingType,
      price: pricePaise,
      compareAtPrice: compareAtPricePaise,
      tags: input.tags,
      isFeatured: input.isFeatured,
      pageCount: input.pageCount,
      fullFileUrl: input.fullFile.url,
      fullFilePublicId: input.fullFile.source === "upload" ? input.fullFile.publicId : null,
      fullFileBytes: input.fullFile.source === "upload" ? input.fullFile.bytes : 0,
      pdfSource: input.fullFile.source,
      drivePdfUrl: input.fullFile.source === "drive" ? input.fullFile.url : null,
      previewFileUrl: input.previewFile?.url ?? null,
      previewFilePublicId: input.previewFile && input.previewFile.source === "upload" ? input.previewFile.publicId : null,
      previewFileBytes: input.previewFile && input.previewFile.source === "upload" ? input.previewFile.bytes : null,
      coverImageUrl: input.coverImage?.url ?? null,
      coverImagePublicId: input.coverImage?.publicId ?? null,
      slug,
      createdBy: ctx.admin.id,
      updatedBy: ctx.admin.id,
    },
    include: { category: true },
  });
}

export async function updateNote(
  id: string,
  input: UpdateNoteInput,
  ctx: RouteContext & { admin: { id: string; name: string; email: string; isHead: boolean } },
): Promise<import("@prisma/client").Note> {
  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Note");

  const updates: Record<string, unknown> = { updatedBy: ctx.admin.id };

  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.categoryId !== undefined) updates.categoryId = input.categoryId;
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
    updates.pdfSource = input.fullFile.source;
    if (input.fullFile.source === "upload") {
      updates.fullFilePublicId = input.fullFile.publicId;
      updates.fullFileBytes = input.fullFile.bytes;
      updates.drivePdfUrl = null;
    } else {
      updates.fullFilePublicId = null;
      updates.fullFileBytes = 0;
      updates.drivePdfUrl = input.fullFile.url;
    }
  }
  if (input.previewFile !== undefined) {
    if (input.previewFile) {
      updates.previewFileUrl = input.previewFile.url;
      if (input.previewFile.source === "upload") {
        updates.previewFilePublicId = input.previewFile.publicId;
        updates.previewFileBytes = input.previewFile.bytes;
      } else {
        updates.previewFilePublicId = null;
        updates.previewFileBytes = null;
      }
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

  return prisma.note.update({ where: { id }, data: updates as Parameters<typeof prisma.note.update>[0]["data"], include: { category: true } });
}

export async function deleteNote(
  id: string,
  _ctx: RouteContext & { admin: { id: string; name: string; email: string; isHead: boolean } },
): Promise<{ deleted: true; affectedGroups: { id: string; name: string; slug: string; hiddenBecauseEmpty: boolean }[] }> {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw AppError.notFound("Note");

  const groupsWithNote = await prisma.group.findMany({
    where: { noteGroups: { some: { noteId: id } } },
    include: { noteGroups: true, category: true } as any,
  });

  const affectedGroups: { id: string; name: string; slug: string; hiddenBecauseEmpty: boolean }[] = [];

  await Promise.all(groupsWithNote.map(async (group) => {
    const remainingNoteIds = (group as any).noteGroups.filter((ng: any) => ng.noteId !== id).map((ng: any) => ng.noteId);
    if (remainingNoteIds.length === 0) {
      await prisma.group.update({ where: { id: group.id }, data: { visibility: "private" } });
      affectedGroups.push({ id: group.id, name: group.name, slug: group.slug, hiddenBecauseEmpty: true });
    } else {
      await prisma.noteGroup.deleteMany({ where: { groupId: group.id } });
      await prisma.noteGroup.createMany({ data: remainingNoteIds.map((noteId: string) => ({ groupId: group.id, noteId })) });
    }
  }));

  await prisma.note.delete({ where: { id } });
  return { deleted: true, affectedGroups };
}

export async function getRelatedNotes(categoryId: string, noteId: string, limit: number): Promise<import("@prisma/client").Note[]> {
  return prisma.note.findMany({
    where: { id: { not: noteId }, categoryId, visibility: "public" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getGroupsByNoteId(noteId: string): Promise<import("@prisma/client").Group[]> {
  return prisma.group.findMany({
    where: { noteGroups: { some: { noteId } }, visibility: "public" },
    include: { category: true },
  });
}

export async function getFeaturedNotes(limit: number): Promise<import("@prisma/client").Note[]> {
  return prisma.note.findMany({
    where: { isFeatured: true, visibility: "public" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getLatestNotes(limit: number): Promise<import("@prisma/client").Note[]> {
  return prisma.note.findMany({
    where: { visibility: "public" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getFreeNotes(limit: number): Promise<import("@prisma/client").Note[]> {
  return prisma.note.findMany({
    where: { pricingType: "free", visibility: "public" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getNotesByCategory(categoryId: string, limit: number): Promise<import("@prisma/client").Note[]> {
  return prisma.note.findMany({
    where: { categoryId, visibility: "public" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function incrementDownloadCount(noteId: string): Promise<void> {
  await prisma.note.update({ where: { id: noteId }, data: { downloadCount: { increment: 1 } } });
}

export async function incrementPurchaseCount(entityType: "note" | "group", id: string): Promise<void> {
  if (entityType === "note") {
    await prisma.note.update({ where: { id }, data: { purchaseCount: { increment: 1 } } });
  } else {
    await prisma.group.update({ where: { id }, data: { purchaseCount: { increment: 1 } } });
  }
}

export async function addRevenuePaise(entityType: "note" | "group", id: string, amount: number): Promise<void> {
  if (entityType === "note") {
    await prisma.note.update({ where: { id }, data: { revenuePaise: { increment: amount } } });
  } else {
    await prisma.group.update({ where: { id }, data: { revenuePaise: { increment: amount } } });
  }
}
