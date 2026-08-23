import type { Model, QueryFilter, SortOrder } from "mongoose";
import { Types } from "mongoose";
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from "@/lib/constants";
import { rupeesToPaise } from "@/lib/format";
import type { NotesQuerySchema, OrdersQuerySchema } from "@/lib/schemas/query.schema";
import type { Pagination } from "@/lib/types";
import type { NoteDoc } from "../db/models/note.model";
import type { OrderDoc } from "../db/models/order.model";

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

export function parseArrayParam(searchParams: URLSearchParams, key: string): string[] {
  const values = searchParams
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
  return Array.from(new Set(values));
}

export function parseBooleanParam(searchParams: URLSearchParams, key: string): boolean | undefined {
  const value = searchParams.get(key);
  if (value === null) return undefined;
  return value === "true" || value === "1";
}

export function parseNumberParam(searchParams: URLSearchParams, key: string): number | undefined {
  const raw = searchParams.get(key);
  if (raw === null || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
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

export function toObjectIds(ids: string[]): Types.ObjectId[] {
  return ids.filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id));
}

export async function resolveCategoryIds(
  categoryModel: Model<Record<string, unknown>>,
  slugs: string[],
): Promise<Types.ObjectId[]> {
  if (slugs.length === 0) return [];
  const categories = await categoryModel.find({ slug: { $in: slugs } }).select("_id").lean();
  return categories.map((category) => category._id as unknown as Types.ObjectId);
}

export function buildNoteFilter(
  query: Omit<NotesQuerySchema, "page" | "limit"> & Partial<Pick<NotesQuerySchema, "page" | "limit">>,
  options: { publicOnly: boolean; categoryIds?: Types.ObjectId[] },
): QueryFilter<NoteDoc> {
  const filter: QueryFilter<NoteDoc> = {};

  if (options.publicOnly) {
    filter.visibility = "public";
  }

  if (options.categoryIds && options.categoryIds.length > 0) {
    filter.category = { $in: options.categoryIds };
  }

  if (query.level && query.level.length > 0) filter.level = { $in: query.level };
  if (query.tags && query.tags.length > 0) filter.tags = { $in: query.tags.map((tag: string) => tag.toLowerCase()) };
  if (query.pricing) filter.pricingType = query.pricing;
  if (query.featured !== undefined) filter.isFeatured = query.featured;

  const priceFilter: Record<string, number> = {};
  if (query.minPrice !== null && query.minPrice !== undefined) priceFilter.$gte = rupeesToPaise(query.minPrice);
  if (query.maxPrice !== null && query.maxPrice !== undefined) priceFilter.$lte = rupeesToPaise(query.maxPrice);
  if (Object.keys(priceFilter).length > 0) filter.price = priceFilter;

  if (query.q) {
    const pattern = new RegExp(escapeRegex(query.q), "i");
    filter.$or = [
      { title: pattern },
      { tags: pattern },
    ];
  }

  return filter;
}

export function buildNoteSort(sort: NotesQuerySchema["sort"]): Record<string, SortOrder> {
  const sorts: Record<NonNullable<NotesQuerySchema["sort"]>, Record<string, SortOrder>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1, createdAt: -1 },
    price_desc: { price: -1, createdAt: -1 },
    popular: { purchaseCount: -1, downloadCount: -1, createdAt: -1 },
    title_asc: { title: 1 },
  };
  return sorts[sort ?? "newest"] ?? sorts.newest;
}

export function buildOrderFilter(query: Omit<OrdersQuerySchema, "page" | "limit"> & Partial<Pick<OrdersQuerySchema, "page" | "limit">>): QueryFilter<OrderDoc> {
  const filter: QueryFilter<OrderDoc> = {};

  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.fulfillmentStatus) filter.fulfillmentStatus = query.fulfillmentStatus;
  if (query.itemType) filter.itemType = query.itemType;

  const createdAt: Record<string, unknown> = {};
  if (query.from) createdAt.$gte = query.from;
  if (query.to) createdAt.$lte = query.to;
  if (Object.keys(createdAt).length > 0) filter.createdAt = createdAt;

  if (query.q) {
    const pattern = new RegExp(escapeRegex(query.q), "i");
    filter.$or = [
      { orderNumber: pattern },
      { "buyer.fullName": pattern },
      { "itemSnapshot.title": pattern },
    ];
  }

  return filter;
}

export function buildOrderSort(sort: OrdersQuerySchema["sort"]): Record<string, SortOrder> {
  const sorts: Record<NonNullable<OrdersQuerySchema["sort"]>, Record<string, SortOrder>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    amount_desc: { amount: -1, createdAt: -1 },
    amount_asc: { amount: 1, createdAt: -1 },
  };
  return sorts[sort ?? "newest"] ?? sorts.newest;
}
