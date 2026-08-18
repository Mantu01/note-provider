import { handler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { Group } from "@/server/db/models/group.model";
import { Note } from "@/server/db/models/note.model";
import { toPublicGroup } from "@/server/mappers/group.mapper";
import { parsePagination, buildPagination } from "@/server/lib/query";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export const GET = handler(async (ctx) => {
  const { page, limit, skip } = parsePagination(ctx.searchParams);

  const [items, total] = await Promise.all([
    Group.find({ visibility: "public" }).populate("category").sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
    Group.countDocuments({ visibility: "public" }).exec(),
  ]);

  const res = ok({
    items: items.map((item) => toPublicGroup(item as unknown as Record<string, unknown>)),
    pagination: buildPagination(total, page, limit),
  });
  res.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
  return res;
});
