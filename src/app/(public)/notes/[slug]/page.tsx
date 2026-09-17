import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd, {
  productJsonLd,
  courseJsonLd,
  breadcrumbJsonLd,
  webpageJsonLd,
  articleJsonLd,
} from "@/components/seo/json-ld";
import { APP_URL } from "@/lib/constants";
import { NoteDetailPage } from "@/components/notes/note-detail-page";
import { prisma } from "@/helpers/db";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

// Route reads per-request DB data (prisma.note.findFirst) and has no generateStaticParams.
// Mark as intentionally non-instant so Next.js stops logging the prerender-warning.
export const instant = false;

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;

  const noteDoc = await prisma.note.findFirst({ where: { slug, visibility: "public" }, include: { category: true } });

  if (!noteDoc) {
    return {
      title: "Note Not Found — Notes Provider",
      description: "This study note could not be found or may have been removed.",
      openGraph: { url: `${APP_URL}/notes/${slug}`, type: "website" },
    };
  }

  const title = `${noteDoc.title} — ${noteDoc.level.charAt(0).toUpperCase() + noteDoc.level.slice(1)} Notes | ${noteDoc.category?.name || "Coding Notes"}`;
  const desc = noteDoc.description?.slice(0, 160) || `Download ${noteDoc.title} — ${noteDoc.level} developer notes for ${noteDoc.category?.name || "coding"}. ${noteDoc.pricingType === "free" ? "Completely free." : `Priced at affordable rate.`}`;
  const imageUrl = noteDoc.coverImageUrl ?? `${APP_URL}/og/note/${slug}`;
  const pageUrl = `${APP_URL}/notes/${slug}`;

  return {
    title,
    description: desc,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description: desc,
      url: pageUrl,
      siteName: "Notes Provider",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: noteDoc.title, type: "image/png" }],
      type: "article",
      publishedTime: noteDoc.createdAt.toISOString(),
      modifiedTime: noteDoc.updatedAt.toISOString(),
      authors: ["Notes Provider"],
      section: noteDoc.category?.name || "Study Notes",
      tags: noteDoc.tags as string[] | undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [imageUrl],
    },
    other: {
      "article:published_time": noteDoc.createdAt.toISOString(),
      "article:modified_time": noteDoc.updatedAt.toISOString(),
      "article:section": noteDoc.category?.name || "Study Notes",
    },
  };
}

export default async function NoteRoute({ params }: NotePageProps) {
  const { slug } = await params;

  const noteDoc = await prisma.note.findFirst({ where: { slug, visibility: "public" }, include: { category: true } });

  if (!noteDoc) {
    notFound();
  }

  const pageUrl = `${APP_URL}/notes/${noteDoc.slug}`;
  const imageUrl = noteDoc.coverImageUrl ?? `${APP_URL}/og/note/${noteDoc.slug}`;

  const jsonLd = [
    productJsonLd({
      title: noteDoc.title,
      description: noteDoc.description || "",
      price: noteDoc.price,
      priceLabel: noteDoc.pricingType === "free" ? "Free" : `₹${noteDoc.price}`,
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
    breadcrumbJsonLd([
      { name: "Home", url: APP_URL },
      { name: "Notes", url: `${APP_URL}/notes` },
      { name: noteDoc.title, url: pageUrl },
    ]),
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
