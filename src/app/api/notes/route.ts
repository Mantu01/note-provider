import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { toPublicNote } from "@/helpers/mappers/note.mapper";
import { parsePagination, buildPagination, buildNoteFilter, buildNoteSort, parseArrayParam, parseBooleanParam, parseNumberParam } from "@/helpers/query";
import type { NoteSort } from "@/lib/types";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export const GET = handler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams);
  const sortParam = ctx.searchParams.get("sort");
  const sort: NoteSort = (sortParam as NoteSort) || "newest";

  const query = {
    q: ctx.searchParams.get("q") || undefined,
    category: parseArrayParam(ctx.searchParams, "category"),
    level: parseArrayParam(ctx.searchParams, "level") as ("basics" | "intermediate" | "advance")[],
    tags: parseArrayParam(ctx.searchParams, "tags"),
    pricing: (ctx.searchParams.get("pricing") as "free" | "paid") || undefined,
    minPrice: parseNumberParam(ctx.searchParams, "minPrice"),
    maxPrice: parseNumberParam(ctx.searchParams, "maxPrice"),
    sort,
    featured: parseBooleanParam(ctx.searchParams, "featured"),
  };

  const filter = buildNoteFilter(query, { publicOnly: true });
  const sortSpec = buildNoteSort(sort);

  const [items, total] = await Promise.all([
    prisma.note.findMany({ where: filter.where as any, include: { category: true }, orderBy: sortSpec as any, skip, take: limit }),
    prisma.note.count({ where: filter.where as any }),
  ]);

  const res = ok({ items: items.map(toPublicNote), pagination: buildPagination(total, page, limit) });
  res.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
  return res;
});
