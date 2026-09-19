import { adminHandler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { toAdminGroup } from "@/helpers/mappers/group.mapper";
import { parsePagination, buildPagination } from "@/helpers/query";
import { createGroupSchema } from "@/schemas/group.schema";
import { rupeesToPaise } from "@/lib/format";
import { uniqueSlug } from "@/helpers/slug";
import { validateNoteIdsExist } from "@/helpers/note-validation";

export const GET = adminHandler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams, 20);

  const [items, total] = await Promise.all([
    prisma.group.findMany({
      include: { category: true, noteGroups: { include: { note: true } } } as any,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.group.count(),
  ]);

  return ok({
    items: items.map(toAdminGroup),
    pagination: buildPagination(total, page, limit),
  });
});

export const POST = adminHandler(async (ctx) => {
  const body = await ctx.req.json();
  const parsed = createGroupSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fields[path]) fields[path] = issue.message;
    }
    return fail(AppError.validation(fields));
  }

  const { admin } = ctx;
  const input = parsed.data;

  const noteIds = input.noteIds.filter((n: string) => n.trim());
  const uniqueIds = Array.from(new Set(noteIds));
  await validateNoteIdsExist(uniqueIds);

  const compareAtPricePaise = input.compareAtPrice ? rupeesToPaise(input.compareAtPrice) : null;
  const slug = await uniqueSlug("group", input.name);

  const createdDoc = await prisma.group.create({
    data: {
      name: input.name,
      description: input.description,
      categoryId: input.categoryId,
      price: rupeesToPaise(input.price),
      compareAtPrice: compareAtPricePaise,
      coverImageUrl: input.coverImage?.url ?? null,
      visibility: input.visibility,
      isFeatured: input.isFeatured,
      slug,
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });

  if (uniqueIds.length > 0) {
    await prisma.noteGroup.createMany({
      data: uniqueIds.map((noteId) => ({ groupId: createdDoc.id, noteId })),
      skipDuplicates: true,
    });
  }

  const fullDoc = await prisma.group.findUnique({
    where: { id: createdDoc.id },
    include: { category: true, noteGroups: { include: { note: true } } } as any,
  });

  return ok(toAdminGroup(fullDoc!));
});
