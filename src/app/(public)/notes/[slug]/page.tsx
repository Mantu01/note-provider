import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import JsonLd, {
  productJsonLd,
  courseJsonLd,
  webpageJsonLd,
  articleJsonLd,
} from "@/components/seo/json-ld";
import { APP_URL, SEO } from "@/lib/constants";
import { NoteDetailPage } from "@/components/notes/note-detail-page";
import { NoteDetailSkeleton } from "@/components/shared/shimmer-loader";
import { prisma } from "@/helpers/db";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await prisma.note.findFirst({
    where: { slug, visibility: "public" },
    select: { title: true, description: true, coverImageUrl: true, updatedAt: true },
  });

  if (!note) return { title: "Note not found" };

  const imageUrl = note.coverImageUrl ?? `${APP_URL}/og/note/${slug}`;
  return {
    title: note.title,
    description: note.description.slice(0, 160),
    alternates: { canonical: `${APP_URL}/notes/${slug}` },
    openGraph: {
      title: note.title,
      description: note.description.slice(0, 160),
      url: `${APP_URL}/notes/${slug}`,
      siteName: SEO.siteName,
      images: [{ url: imageUrl, width: SEO.ogImageWidth, height: SEO.ogImageHeight, alt: note.title }],
      type: "article",
      locale: SEO.locale,
    },
    twitter: {
      card: SEO.twitterCard,
      title: note.title,
      description: note.description.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export default function NoteRoute({ params }: NotePageProps) {
  return (
    <Suspense fallback={<NoteDetailSkeleton />}>
      <NoteDetail params={params} />
    </Suspense>
  );
}

async function NoteDetail({ params }: NotePageProps) {
  const { slug } = await params;

  const noteDoc = await prisma.note.findFirst({
    where: { slug, visibility: "public" },
    include: { category: true },
  });

  if (!noteDoc) {
    notFound();
  }

  const pageUrl = `${APP_URL}/notes/${noteDoc.slug}`;
  const imageUrl = noteDoc.coverImageUrl ?? `${APP_URL}/og/note/${noteDoc.slug}`;

  const jsonLd = [
    productJsonLd({
      title: noteDoc.title,
      description: noteDoc.description || "",
      price: noteDoc.pricingType === "free" ? 0 : noteDoc.price / 100,
      priceLabel: noteDoc.pricingType === "free" ? "Free" : `₹${(noteDoc.price / 100).toFixed(0)}`,
      currency: "INR",
      imageUrl: noteDoc.coverImageUrl ?? null,
      category: { name: noteDoc.category?.name || "Study Notes" },
      level: noteDoc.level,
      pageCount: noteDoc.pageCount ?? null,
      url: `/notes/${noteDoc.slug}`,
    }),
    courseJsonLd({
      title: noteDoc.title,
      description: noteDoc.description || "",
      url: `/notes/${noteDoc.slug}`,
      category: { name: noteDoc.category?.name || "Study Notes" },
      level: noteDoc.level,
      imageUrl: noteDoc.coverImageUrl ?? null,
    }),
    articleJsonLd({
      title: noteDoc.title,
      description: noteDoc.description || "",
      url: `/notes/${noteDoc.slug}`,
      imageUrl: noteDoc.coverImageUrl ?? null,
      category: { name: noteDoc.category?.name || "Study Notes" },
      level: noteDoc.level,
      createdAt: noteDoc.createdAt.toISOString(),
      updatedAt: noteDoc.updatedAt.toISOString(),
      tags: noteDoc.tags as string[] | undefined,
    }),
    webpageJsonLd({
      title: noteDoc.title,
      description: noteDoc.description?.slice(0, 160) || "",
      url: pageUrl,
      image: imageUrl,
    }),
  ].flat();

  return (
    <>
      <JsonLd scripts={jsonLd} />
      <NoteDetailPage slug={slug} />
    </>
  );
}
