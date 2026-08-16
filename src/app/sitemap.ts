import type { MetadataRoute } from "next";
import { Note } from "@/server/db/models/note.model";
import { Group } from "@/server/db/models/group.model";
import { Category } from "@/server/db/models/category.model";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://notesprovider.online";

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

  // ── Static pages ────────────────────────────────────────────────
  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${APP_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // ── Dynamic data queries ────────────────────────────────────────
  const [notes, groups, categories] = await Promise.all([
    safeQuery(async () =>
      Note.find({ visibility: "public" })
        .select("slug updatedAt")
        .sort({ updatedAt: -1 })
        .lean()
        .exec(),
    ),
    safeQuery(async () =>
      Group.find({ visibility: "public" })
        .select("slug updatedAt")
        .sort({ updatedAt: -1 })
        .lean()
        .exec(),
    ),
    safeQuery(async () =>
      Category.find({ isActive: true })
        .select("slug updatedAt")
        .sort({ order: 1 })
        .lean()
        .exec(),
    ),
  ]);

  // ── Note detail pages ───────────────────────────────────────────
  if (notes) {
    for (const note of notes) {
      entries.push({
        url: `${APP_URL}/notes/${note.slug}`,
        lastModified: note.updatedAt ? new Date(note.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // ── Group (bundle) detail pages ─────────────────────────────────
  if (groups) {
    for (const group of groups) {
      entries.push({
        url: `${APP_URL}/groups/${group.slug}`,
        lastModified: group.updatedAt ? new Date(group.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // ── Category-filtered catalog pages ─────────────────────────────
  if (categories) {
    for (const category of categories) {
      // Category landing on notes
      entries.push({
        url: `${APP_URL}/notes?category=${category.slug}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
      // Category landing on groups
      entries.push({
        url: `${APP_URL}/groups?category=${category.slug}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  // ── Level-filtered catalog pages ────────────────────────────────
  const levels = ["basics", "intermediate", "advance"] as const;
  for (const level of levels) {
    // Notes by level
    entries.push({
      url: `${APP_URL}/notes?level=${level}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
    // Groups by level (bundles often have a level)
    entries.push({
      url: `${APP_URL}/groups?level=${level}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // ── Pricing-filtered catalog pages ──────────────────────────────
  const pricingTypes = ["free", "paid"] as const;
  for (const pricing of pricingTypes) {
    entries.push({
      url: `${APP_URL}/notes?pricing=${pricing}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // ── Sort & search pages ─────────────────────────────────────────
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

  // ── Featured / latest pages ─────────────────────────────────────
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
