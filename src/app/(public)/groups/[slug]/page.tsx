import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd, {
  productJsonLd,
  breadcrumbJsonLd,
  webpageJsonLd,
  articleJsonLd,
} from "@/components/seo/json-ld";
import { APP_URL } from "@/lib/constants";
import { GroupDetailPage } from "@/features/groups/components/group-detail";
import { Group } from "@/server/db/models/group.model";
import type { GroupDoc } from "@/server/db/models/group.model";
import "@/server/db/models/category.model";

interface PopulatedGroup extends Omit<GroupDoc, "category"> {
  category?: { _id: import("mongoose").Types.ObjectId; name: string };
  noteCount?: number;
}

interface GroupRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GroupRouteProps): Promise<Metadata> {
  const { slug } = await params;

  const groupDoc = await Group.findOne({ slug, visibility: "public" })
    .populate<PopulatedGroup>("category")
    .lean()
    .exec();

  if (!groupDoc) {
    return {
      title: "Bundle Not Found — Notes Provider",
      description: "This study note bundle could not be found or may have been removed.",
      openGraph: { url: `${APP_URL}/groups/${slug}`, type: "website" },
    };
  }

  const group = groupDoc as unknown as PopulatedGroup;
  const title = `${group.name} — Complete ${group.category?.name || "Developer"} Bundle | Notes Provider`;
  const desc = group.description?.slice(0, 160) || `Get the complete ${group.name} bundle with ${group.noteCount} coding notes for ${group.category?.name || "developer topics"}.`;
  const imageUrl = group.coverImageUrl ?? `${APP_URL}/og/group/${slug}.png`;
  const pageUrl = `${APP_URL}/groups/${slug}`;

  return {
    title,
    description: desc,
    keywords: [
      group.name.toLowerCase(),
      `${group.category?.name} bundle`,
      "developer bundle",
      "coding bundle",
      "web dev bundle",
      ...(group.notes?.length ? [` ${group.noteCount} notes bundle`, ` ${group.category?.name} bundle`] : []),
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description: desc,
      url: pageUrl,
      siteName: "Notes Provider",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: group.name, type: "image/png" }],
      type: "article",
      publishedTime: group.createdAt.toISOString(),
      modifiedTime: group.updatedAt.toISOString(),
      authors: ["Notes Provider"],
      section: group.category?.name || "Study Bundles",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [imageUrl],
    },
    other: {
      "article:published_time": group.createdAt.toISOString(),
      "article:modified_time": group.updatedAt.toISOString(),
      "article:section": group.category?.name || "Study Bundles",
    },
  };
}

export default async function GroupRoute({ params }: GroupRouteProps) {
  const { slug } = await params;

  const groupDoc = await Group.findOne({ slug, visibility: "public" })
    .populate<PopulatedGroup>("category")
    .lean()
    .exec();

  if (!groupDoc) {
    notFound();
  }

  const group = groupDoc as unknown as PopulatedGroup;
  const pageUrl = `${APP_URL}/groups/${group.slug}`;
  const imageUrl = group.coverImageUrl ?? `${APP_URL}/og/group/${group.slug}.png`;

  const jsonLd = [
    productJsonLd({
      title: group.name,
      description: group.description || "",
      price: group.price,
      priceLabel: `₹${group.price}`,
      currency: "INR",
      imageUrl: group.coverImageUrl ?? null,
      category: { name: group.category?.name || "Study Bundles" },
      level: "bundle",
      pageCount: group.noteCount ?? null,
      url: `/groups/${group.slug}`,
    }),
    articleJsonLd({
      title: group.name,
      description: group.description || "",
      url: `/groups/${group.slug}`,
      imageUrl: group.coverImageUrl ?? null,
      category: { name: group.category?.name || "Study Bundles" },
      level: "bundle",
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    }),
    breadcrumbJsonLd([
      { name: "Home", url: APP_URL },
      { name: "Bundles", url: `${APP_URL}/groups` },
      { name: group.name, url: pageUrl },
    ]),
    webpageJsonLd({
      title: group.name,
      description: group.description?.slice(0, 160) || "",
      url: pageUrl,
      image: imageUrl,
    }),
  ].flat();

  return (
    <>
      <JsonLd scripts={jsonLd} />
      <GroupDetailPage slug={slug} />
    </>
  );
}
