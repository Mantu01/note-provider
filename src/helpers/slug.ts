import { prisma } from "./db";

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

export async function uniqueSlug(
  table: "note" | "group" | "category",
  base: string,
  excludeId?: string,
): Promise<string> {
  const root = slugify(base) || "item";
  let candidate = root;
  let suffix = 1;

  const findUnique = async (tbl: string, slug: string) => {
    if (tbl === "note") return prisma.note.findUnique({ where: { slug }, select: { id: true } });
    if (tbl === "group") return prisma.group.findUnique({ where: { slug }, select: { id: true } });
    return prisma.category.findUnique({ where: { slug }, select: { id: true } });
  };

  for (;;) {
    const existing = await findUnique(table, candidate);
    if (!existing || (excludeId && existing.id === excludeId)) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}
