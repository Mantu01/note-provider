import { handler } from "@/helpers/api-handler";
import { ok } from "@/helpers/api-response";
import { prisma } from "@/helpers/db";


export const GET = handler(async () => {
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc", name: "asc" } });
  return ok(categories);
});
