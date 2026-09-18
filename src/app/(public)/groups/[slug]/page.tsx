import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import JsonLd, {
  productJsonLd,
  webpageJsonLd,
  articleJsonLd,
} from "@/components/seo/json-ld";
import { APP_URL } from "@/lib/constants";
import { GroupDetailPage } from "@/components/groups/group-detail";
import { GroupDetailSkeleton } from "@/components/shared/shimmer-loader";
import { prisma } from "@/helpers/db";

interface GroupRouteProps {
  params: Promise<{ slug: string }>;
}

type GroupWithRelations = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  coverImageUrl: string | null;
  category: { id: string; name: string; slug: string } | null;
  noteGroups: Array<{ id: string; noteId: string }>;
  createdAt: Date;
  updatedAt: Date;
};

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
    include: { category: true, noteGroups: true },
  }) as GroupWithRelations | null;

  if (!groupDoc) {
    notFound();
  }

  const noteCount = groupDoc.noteGroups?.length || 0;
  const pageUrl = `${APP_URL}/groups/${groupDoc.slug}`;
  const imageUrl = groupDoc.coverImageUrl ?? `${APP_URL}/og/group/${groupDoc.slug}`;

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
