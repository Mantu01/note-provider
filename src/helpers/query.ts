import { prisma } from "./db";
import type { NotesQuerySchema, OrdersQuerySchema } from "@/schemas/query.schema";
import type { Pagination } from "@/lib/types";
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from "@/lib/constants";
import { rupeesToPaise } from "@/lib/format";

export function parsePagination(
  searchParams: URLSearchParams,
  defaultLimit = DEFAULT_PAGE_LIMIT,
): { page: number; limit: number; skip: number } {
  const rawPage = Number(searchParams.get("page"));
  const rawLimit = Number(searchParams.get("limit"));

  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
  const limit =
    Number.isFinite(rawLimit) && rawLimit >= 1
      ? Math.min(Math.floor(rawLimit), MAX_PAGE_LIMIT)
      : defaultLimit;

  return { page, limit, skip: (page - 1) * limit };
}

export function buildPagination(total: number, page: number, limit: number): Pagination {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function buildNoteFilter(
  query: Omit<NotesQuerySchema, "page" | "limit"> & Partial<Pick<NotesQuerySchema, "page" | "limit">>,
  options: { publicOnly: boolean; categoryIds?: string[] },
): Promise<{ where: Record<string, unknown>; categories?: { in: string[] } }> {
  const where: Record<string, unknown> = {};

  if (options.publicOnly) {
    where.visibility = "public";
  }

  if (options.categoryIds && options.categoryIds.length > 0) {
    where.categoryId = { in: options.categoryIds };
  }

  if (query.q && query.q.trim().length > 0) {
    const search = escapeRegex(query.q.trim());
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  if (query.level && query.level.length > 0) where.level = { in: query.level };
  if (query.tags && query.tags.length > 0) where.tags = { hasSome: query.tags.map((tag: string) => tag.toLowerCase()) };
  if (query.pricing) where.pricingType = query.pricing;
  if (query.featured !== undefined) where.isFeatured = query.featured;

  if (query.category && query.category.length > 0) {
    if (options.publicOnly) {
      const categories = await prisma.category.findMany({
        where: { slug: { in: query.category } },
        select: { id: true },
      });
      where.categoryId = categories.length > 0 ? { in: categories.map((c) => c.id) } : { in: [] };
    } else {
      where.categoryId = { in: query.category };
    }
  }

  const priceFilter: Record<string, number> = {};
  if (query.minPrice !== null && query.minPrice !== undefined) priceFilter.gte = rupeesToPaise(query.minPrice);
  if (query.maxPrice !== null && query.maxPrice !== undefined) priceFilter.lte = rupeesToPaise(query.maxPrice);
  if (Object.keys(priceFilter).length > 0) where.price = priceFilter;

  return { where };
}

export function buildNoteSort(sort: NotesQuerySchema["sort"]): Record<string, "asc" | "desc"> {
  const sorts: Record<NonNullable<NotesQuerySchema["sort"]>, Record<string, "asc" | "desc">> = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    price_asc: { price: "asc", createdAt: "desc" },
    price_desc: { price: "desc", createdAt: "desc" },
    popular: { purchaseCount: "desc", downloadCount: "desc", createdAt: "desc" },
    title_asc: { title: "asc" },
  };
  return sorts[sort ?? "newest"] ?? sorts.newest;
}

export type NoteQueryWithCategory = Omit<NotesQuerySchema, "page" | "limit"> & {
  category?: string[] | { slug: string }[];
};

export function buildOrderFilter(query: Omit<OrdersQuerySchema, "page" | "limit"> & Partial<Pick<OrdersQuerySchema, "page" | "limit">>): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
  if (query.itemType) where.itemType = query.itemType;

  const createdAt: Record<string, unknown> = {};
  if (query.from) createdAt.gte = new Date(query.from);
  if (query.to) createdAt.lte = new Date(query.to);
  if (Object.keys(createdAt).length > 0) where.createdAt = createdAt;

  return where;
}

export function buildOrderSort(sort: OrdersQuerySchema["sort"]): Record<string, "asc" | "desc"> {
  const sorts: Record<NonNullable<OrdersQuerySchema["sort"]>, Record<string, "asc" | "desc">> = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    amount_desc: { amount: "desc", createdAt: "desc" },
    amount_asc: { amount: "asc", createdAt: "desc" },
  };
  return sorts[sort ?? "newest"] ?? sorts.newest;
}
