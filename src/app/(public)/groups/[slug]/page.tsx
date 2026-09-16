import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd, {
  productJsonLd,
  breadcrumbJsonLd,
  webpageJsonLd,
  articleJsonLd,
} from "@/components/seo/json-ld";
import { APP_URL } from "@/lib/constants";
import { GroupDetailPage } from "@/components/groups/group-detail";
import { prisma } from "@/helpers/db";

interface GroupRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GroupRouteProps): Promise<Metadata> {
  const { slug } = await params;

  const groupDoc = (await prisma.group.findFirst({ where: { slug, visibility: "public" }, include: { category: true, noteGroups: true } })) as any;

  if (!groupDoc) {
    return {
      title: "Bundle Not Found — Notes Provider",
      description: "This study note bundle could not be found or may have been removed.",
      openGraph: { url: `${APP_URL}/groups/${slug}`, type: "website" },
    };
  }

  const title = `${groupDoc.name} — Complete ${groupDoc.category?.name || "Developer"} Bundle | Notes Provider`;
  const noteCount = groupDoc.noteGroups?.length || 0;
  const desc = groupDoc.description?.slice(0, 160) || `Get the complete ${groupDoc.name} bundle with ${noteCount} coding notes for ${groupDoc.category?.name || "developer topics"}.`;
  const imageUrl = groupDoc.coverImageUrl ?? `${APP_URL}/og/group/${slug}.png`;
  const pageUrl = `${APP_URL}/groups/${slug}`;

  return {
    title,
    description: desc,
    keywords: [
      groupDoc.name.toLowerCase(),
      `${groupDoc.category?.name} bundle`,
      "developer bundle",
      "coding bundle",
      "web dev bundle",
      ...(groupDoc.noteGroups?.length ? [` ${noteCount} notes bundle`, ` ${groupDoc.category?.name} bundle`] : []),
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description: desc,
      url: pageUrl,
      siteName: "Notes Provider",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: groupDoc.name, type: "image/png" }],
      type: "article",
      publishedTime: groupDoc.createdAt.toISOString(),
      modifiedTime: groupDoc.updatedAt.toISOString(),
      authors: ["Notes Provider"],
      section: groupDoc.category?.name || "Study Bundles",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [imageUrl],
    },
    other: {
      "article:published_time": groupDoc.createdAt.toISOString(),
      "article:modified_time": groupDoc.updatedAt.toISOString(),
      "article:section": groupDoc.category?.name || "Study Bundles",
    },
  };
}

export default async function GroupRoute({ params }: GroupRouteProps) {
  const { slug } = await params;

  const groupDoc = (await prisma.group.findFirst({ where: { slug, visibility: "public" }, include: { category: true, noteGroups: true } })) as any;

  if (!groupDoc) {
    notFound();
  }

  const noteCount = groupDoc.noteGroups?.length || 0;
  const pageUrl = `${APP_URL}/groups/${groupDoc.slug}`;
  const imageUrl = groupDoc.coverImageUrl ?? `${APP_URL}/og/group/${groupDoc.slug}.png`;

  const jsonLd = [
    productJsonLd({
      title: groupDoc.name,
      description: groupDoc.description || "",
      price: groupDoc.price,
      priceLabel: `₹${groupDoc.price}`,
      currency: "INR",
      imageUrl: groupDoc.coverImageUrl ?? null,
      category: { name: groupDoc.category?.name || "Study Bundles" },
      level: "bundle",
      pageCount: noteCount ?? null,
      url: `/groups/${groupDoc.slug}`,
    }),
    articleJsonLd({
      title: groupDoc.name,
      description: groupDoc.description || "",
      url: `/groups/${groupDoc.slug}`,
      imageUrl: groupDoc.coverImageUrl ?? null,
      category: { name: groupDoc.category?.name || "Study Bundles" },
      level: "bundle",
      createdAt: groupDoc.createdAt.toISOString(),
      updatedAt: groupDoc.updatedAt.toISOString(),
    }),
    breadcrumbJsonLd([
      { name: "Home", url: APP_URL },
      { name: "Bundles", url: `${APP_URL}/groups` },
      { name: groupDoc.name, url: pageUrl },
    ]),
    webpageJsonLd({
      title: groupDoc.name,
      description: groupDoc.description?.slice(0, 160) || "",
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
