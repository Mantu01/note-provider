import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { Note } from "@/server/db/models/note.model";
import { Category } from "@/server/db/models/category.model";
import { toPublicNote } from "@/server/mappers/note.mapper";
import {
  parsePagination,
  buildPagination,
  buildNoteFilter,
  buildNoteSort,
  parseArrayParam,
  parseBooleanParam,
  parseNumberParam,
  resolveCategoryIds,
} from "@/server/lib/query";
import type { NoteSort } from "@/lib/types";

export const runtime = "nodejs";
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

  const categoryIds = query.category.length > 0 
    ? await resolveCategoryIds(Category, query.category) 
    : undefined;

  const filter = buildNoteFilter(query, { publicOnly: true, categoryIds });
  const sortSpec = buildNoteSort(sort);

  const [items, total] = await Promise.all([
    Note.find(filter).populate("category").sort(sortSpec).skip(skip).limit(limit).lean().exec(),
    Note.countDocuments(filter).exec(),
  ]);

  return ok({
    items: items.map(toPublicNote),
    pagination: buildPagination(total, page, limit),
  });
});
