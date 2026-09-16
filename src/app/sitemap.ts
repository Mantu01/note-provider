import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";
import { prisma } from "@/helpers/db";

const STATIC_PAGES = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/notes", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/groups", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/refund-policy", priority: 0.4, changeFrequency: "yearly" as const },
] as const;

async function safeQuery<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${APP_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  const [notes, groups, categories] = await Promise.all([
    safeQuery(() => prisma.note.findMany({ where: { visibility: "public" }, select: { slug: true, updatedAt: true }, orderBy: { updatedAt: "desc" } })),
    safeQuery(() => prisma.group.findMany({ where: { visibility: "public" }, select: { slug: true, updatedAt: true }, orderBy: { updatedAt: "desc" } })),
    safeQuery(() => prisma.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true }, orderBy: { order: "asc" } })),
  ]);

  if (notes) {
    for (const note of notes) {
      entries.push({
        url: `${APP_URL}/notes/${note.slug}`,
        lastModified: note.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  if (groups) {
    for (const group of groups) {
      entries.push({
        url: `${APP_URL}/groups/${group.slug}`,
        lastModified: group.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  if (categories) {
    for (const category of categories) {
      entries.push({
        url: `${APP_URL}/notes?category=${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      });
      entries.push({
        url: `${APP_URL}/groups?category=${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  const levels = ["basics", "intermediate", "advance"] as const;
  for (const level of levels) {
    entries.push({
      url: `${APP_URL}/notes?level=${level}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
    entries.push({
      url: `${APP_URL}/groups?level=${level}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  const pricingTypes = ["free", "paid"] as const;
  for (const pricing of pricingTypes) {
    entries.push({
      url: `${APP_URL}/notes?pricing=${pricing}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  const noteSorts = ["newest", "oldest", "price_asc", "price_desc", "popular", "title_asc"] as const;
  for (const sort of noteSorts) {
    entries.push({
      url: `${APP_URL}/notes?sort=${sort}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  const groupSorts = ["newest", "oldest", "popular", "title_asc"] as const;
  for (const sort of groupSorts) {
    entries.push({
      url: `${APP_URL}/groups?sort=${sort}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  entries.push({
    url: `${APP_URL}/notes?featured=true`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  });
  entries.push({
    url: `${APP_URL}/groups?featured=true`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  });

  return entries;
}
