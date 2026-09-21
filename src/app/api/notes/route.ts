import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";
import { toPublicNote } from "@/helpers/mappers/note.mapper";
import { parsePagination, buildPagination, buildNoteFilter, buildNoteSort } from "@/helpers/query";
import type { NoteLevel, NotePricingType, NoteSort } from "@/lib/types";

const NOTE_LEVEL_SET = new Set<string>(["basics", "intermediate", "advance"]);

function parseArrayParam(searchParams: URLSearchParams, key: string): string[] {
  return Array.from(new Set(
    searchParams.getAll(key).flatMap((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
  ));
}

function parseBooleanParam(searchParams: URLSearchParams, key: string): boolean | undefined {
  const value = searchParams.get(key);
  if (value === null) return undefined;
  return value === "true" || value === "1";
}

function parseNumberParam(searchParams: URLSearchParams, key: string): number | undefined {
  const raw = searchParams.get(key);
  if (raw === null || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

const SORTS: NoteSort[] = ["newest", "oldest", "price_asc", "price_desc", "popular", "title_asc"];

export const GET = handler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams);
  const sortParam = ctx.searchParams.get("sort");
  const sort: NoteSort = SORTS.includes(sortParam as NoteSort) ? (sortParam as NoteSort) : "newest";

  const levels = parseArrayParam(ctx.searchParams, "level").filter((l) => NOTE_LEVEL_SET.has(l)) as NoteLevel[];
  const pricingRaw = ctx.searchParams.get("pricing");
  const pricing = pricingRaw === "free" || pricingRaw === "paid" ? (pricingRaw as NotePricingType) : undefined;

  const query = {
    q: ctx.searchParams.get("q")?.trim() || undefined,
    category: parseArrayParam(ctx.searchParams, "category"),
    level: levels,
    tags: parseArrayParam(ctx.searchParams, "tags"),
    pricing,
    minPrice: parseNumberParam(ctx.searchParams, "minPrice"),
    maxPrice: parseNumberParam(ctx.searchParams, "maxPrice"),
    sort,
    featured: parseBooleanParam(ctx.searchParams, "featured"),
  };

  const filter = await buildNoteFilter(query, { publicOnly: true });
  const sortSpec = buildNoteSort(sort);

  const [items, total] = await Promise.all([
    prisma.note.findMany({ where: filter.where as any, include: { category: true }, orderBy: sortSpec as any, skip, take: limit }),
    prisma.note.count({ where: filter.where as any }),
  ]);

  const res = ok({ items: items.map(toPublicNote), pagination: buildPagination(total, page, limit) });
  res.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
  return res;
});
