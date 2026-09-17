import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";
import { prisma } from "@/helpers/db";

const STATIC_PAGES = [
  { path: "", priority: 1.0 },
  { path: "/notes", priority: 0.9 },
  { path: "/groups", priority: 0.9 },
  { path: "/about", priority: 0.7 },
  { path: "/contact", priority: 0.6 },
  { path: "/terms", priority: 0.4 },
  { path: "/privacy", priority: 0.4 },
  { path: "/refund-policy", priority: 0.4 },
] as const;

async function safeQuery<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${APP_URL}${page.path}`,
      priority: page.priority,
    });
  }

  const [notes, groups] = await Promise.all([
    safeQuery(() => prisma.note.findMany({ where: { visibility: "public" }, select: { slug: true, updatedAt: true }, orderBy: { updatedAt: "desc" } })),
    safeQuery(() => prisma.group.findMany({ where: { visibility: "public" }, select: { slug: true, updatedAt: true }, orderBy: { updatedAt: "desc" } })),
  ]);

  if (notes) {
    for (const note of notes) {
      entries.push({
        url: `${APP_URL}/notes/${note.slug}`,
        lastModified: note.updatedAt,
        priority: 0.8,
      });
    }
  }

  if (groups) {
    for (const group of groups) {
      entries.push({
        url: `${APP_URL}/groups/${group.slug}`,
        lastModified: group.updatedAt,
        priority: 0.8,
      });
    }
  }

  return entries;
}
