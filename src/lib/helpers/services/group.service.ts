import { prisma } from "../db";
import { AppError } from "../errors";
import { uniqueSlug } from "../slug";
import { validateNoteIdsExist } from "../note-validation";
import type { RouteContext } from "../api-handler";
import type { CreateGroupInput, UpdateGroupInput } from "@/lib/schemas/group.schema";
import { rupeesToPaise } from "@/lib/format";
import { MIN_PAID_PRICE_PAISE } from "@/lib/constants";

export async function listGroups(
  where: Record<string, unknown>,
  skip: number,
  limit: number,
): Promise<{ items: import("@prisma/client").Group[]; total: number }> {
  const [items, total] = await Promise.all([
    prisma.group.findMany({
      where,
      include: { category: true } as any,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.group.count({ where }),
  ]);
  return { items, total };
}

export async function getGroupBySlug(slug: string): Promise<import("@prisma/client").Group | null> {
  return prisma.group.findUnique({
    where: { slug, visibility: "public" },
    include: { category: true } as any,
  });
}

export async function getGroupById(id: string): Promise<import("@prisma/client").Group | null> {
  return prisma.group.findUnique({
    where: { id },
    include: { category: true } as any,
  });
}

export async function createGroup(
  input: CreateGroupInput,
  ctx: RouteContext & { admin: { id: string; name: string; email: string; isHead: boolean } },
): Promise<import("@prisma/client").Group> {
  const pricePaise = rupeesToPaise(Number(input.price));

  if (pricePaise < MIN_PAID_PRICE_PAISE) {
    throw AppError.validation({ price: `Price must be at least ₹${(MIN_PAID_PRICE_PAISE / 100).toFixed(2)}` });
  }

  const noteIds = input.noteIds.filter((id: string) => id.trim());
  const uniqueIds = Array.from(new Set(noteIds));
  await validateNoteIdsExist(uniqueIds);

  const slug = await uniqueSlug("group", input.name);

  return prisma.group.create({
    data: {
      name: input.name,
      description: input.description,
      categoryId: input.categoryId,
      price: pricePaise,
      compareAtPrice: input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null,
      coverImageUrl: input.coverImage?.url ?? null,
      coverImagePublicId: input.coverImage?.publicId ?? null,
      visibility: input.visibility,
      isFeatured: input.isFeatured,
      slug,
      createdBy: ctx.admin.id,
      updatedBy: ctx.admin.id,
      noteGroups: { create: uniqueIds.map((noteId: string) => ({ noteId })) },
    },
    include: { category: true } as any,
  });
}

export async function updateGroup(
  id: string,
  input: UpdateGroupInput,
  ctx: RouteContext & { admin: { id: string; name: string; email: string; isHead: boolean } },
): Promise<import("@prisma/client").Group> {
  const existing = await prisma.group.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Group");

  const updates: Record<string, unknown> = { updatedBy: ctx.admin.id };

  if (input.noteIds !== undefined) {
    const noteIds = input.noteIds.filter((n: string) => n.trim());
    const uniqueIds = Array.from(new Set(noteIds));
    await validateNoteIdsExist(uniqueIds);
  }

  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.categoryId !== undefined) updates.categoryId = input.categoryId;
  if (input.price !== undefined) updates.price = rupeesToPaise(Number(input.price));
  if (input.compareAtPrice !== undefined) updates.compareAtPrice = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;
  if (input.coverImage !== undefined && input.coverImage) {
    updates.coverImageUrl = input.coverImage.url;
    updates.coverImagePublicId = input.coverImage.publicId;
  }
  if (input.visibility !== undefined) updates.visibility = input.visibility;
  if (input.isFeatured !== undefined) updates.isFeatured = input.isFeatured;

  if (input.noteIds !== undefined) {
    const noteIds = input.noteIds.filter((n: string) => n.trim());
    const uniqueIds = Array.from(new Set(noteIds));
    await prisma.noteGroup.deleteMany({ where: { groupId: id } });
    updates.noteGroups = { create: uniqueIds.map((noteId: string) => ({ noteId })) };
  }

  return prisma.group.update({ where: { id }, data: updates as any, include: { category: true } as any });
}

export async function deleteGroup(
  id: string,
  _ctx: RouteContext & { admin: { id: string; name: string; email: string; isHead: boolean } },
): Promise<{ deleted: true }> {
  const group = await prisma.group.findUnique({ where: { id } });
  if (!group) throw AppError.notFound("Group");

  await prisma.group.delete({ where: { id } });
  return { deleted: true };
}

export async function getRelatedGroups(categoryId: string, groupId: string, limit: number): Promise<import("@prisma/client").Group[]> {
  return prisma.group.findMany({
    where: { id: { not: groupId }, categoryId, visibility: "public" },
    include: { category: true } as any,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getFeaturedGroups(limit: number): Promise<import("@prisma/client").Group[]> {
  return prisma.group.findMany({
    where: { isFeatured: true, visibility: "public" },
    include: { category: true } as any,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
