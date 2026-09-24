import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import JsonLd, {
  productJsonLd,
  webpageJsonLd,
  articleJsonLd,
} from "@/components/seo/json-ld";
import { APP_URL, SEO } from "@/lib/constants";
import { GroupDetailPage } from "@/components/groups/group-detail";
import { GroupDetailSkeleton } from "@/components/shared/shimmer-loader";
import { prisma } from "@/helpers/db";

interface GroupRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GroupRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const group = await prisma.group.findFirst({
    where: { slug, visibility: "public" },
    select: { name: true, description: true, coverImageUrl: true },
  });

  if (!group) return { title: "Bundle not found" };

  const imageUrl = group.coverImageUrl ?? `${APP_URL}/og/group/${slug}`;
  return {
    title: group.name,
    description: group.description.slice(0, 160),
    alternates: { canonical: `${APP_URL}/groups/${slug}` },
    openGraph: {
      title: group.name,
      description: group.description.slice(0, 160),
      url: `${APP_URL}/groups/${slug}`,
      siteName: SEO.siteName,
      images: [{ url: imageUrl, width: SEO.ogImageWidth, height: SEO.ogImageHeight, alt: group.name }],
      type: "website",
      locale: SEO.locale,
    },
    twitter: {
      card: SEO.twitterCard,
      title: group.name,
      description: group.description.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export default function GroupRoute({ params }: GroupRouteProps) {
  return (
    <Suspense fallback={<GroupDetailSkeleton />}>
      <GroupDetail params={params} />
    </Suspense>
  );
}

async function GroupDetail({ params }: GroupRouteProps) {
  const { slug } = await params;

  const groupDoc = await prisma.group.findFirst({
    where: { slug, visibility: "public" },
    include: { category: true, noteGroups: { where: { note: { visibility: "public" } }, include: { note: { select: { id: true } } } } },
  });

  if (!groupDoc) {
    notFound();
  }

  const noteCount = groupDoc.noteGroups.length;
  const pageUrl = `${APP_URL}/groups/${groupDoc.slug}`;
  const imageUrl = groupDoc.coverImageUrl ?? `${APP_URL}/og/group/${groupDoc.slug}`;

  const jsonLd = [
    productJsonLd({
      title: groupDoc.name,
      description: groupDoc.description || "",
      price: groupDoc.price / 100,
      priceLabel: `₹${(groupDoc.price / 100).toFixed(0)}`,
      currency: "INR",
      imageUrl,
      category: { name: groupDoc.category?.name || "Study Bundles" },
      level: "bundle",
      pageCount: noteCount,
      url: `/groups/${groupDoc.slug}`,
    }),
    articleJsonLd({
      title: groupDoc.name,
      description: groupDoc.description || "",
      url: `/groups/${groupDoc.slug}`,
      imageUrl,
      category: { name: groupDoc.category?.name || "Study Bundles" },
      level: "bundle",
      createdAt: groupDoc.createdAt.toISOString(),
      updatedAt: groupDoc.updatedAt.toISOString(),
    }),
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
