import type { Model, QueryFilter } from "mongoose";

const DIACRITICS = /[̀-ͯ]/g;

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uniqueSlug<TDoc = any>(
  model: Model<TDoc>,
  base: string,
  excludeId?: string,
): Promise<string> {
  const root = slugify(base) || "item";
  let candidate = root;
  let suffix = 1;

  for (;;) {
    const existing = await model.findOne({ slug: candidate } as QueryFilter<TDoc>).select("_id").lean();
    if (!existing || (excludeId && String(existing._id) === excludeId)) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}
