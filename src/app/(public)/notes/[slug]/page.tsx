import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd, {
  productJsonLd,
  courseJsonLd,
  breadcrumbJsonLd,
  webpageJsonLd,
  articleJsonLd,
} from "@/components/seo/json-ld";
import { NoteDetailPage } from "@/features/notes/components/note-detail-page";
import { Note } from "@/server/db/models/note.model";
import type { NoteDoc } from "@/server/db/models/note.model";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface PopulatedNote extends Omit<NoteDoc, "category"> {
  category?: { _id: import("mongoose").Types.ObjectId; name: string };
  priceLabel?: string;
}

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;

  const noteDoc = await Note.findOne({ slug, visibility: "public" })
    .populate<PopulatedNote>("category")
    .lean()
    .exec();

  if (!noteDoc) {
    return {
      title: "Note Not Found — Notes Provider",
      description: "This study note could not be found or may have been removed.",
      openGraph: { url: `${APP_URL}/notes/${slug}`, type: "website" },
    };
  }

  const note = noteDoc as unknown as PopulatedNote;
  const title = `${note.title} — ${note.level.charAt(0).toUpperCase() + note.level.slice(1)} Notes | ${note.category?.name || "Coding Notes"}`;
  const desc = note.description?.slice(0, 160) || `Download ${note.title} — ${note.level} developer notes for ${note.category?.name || "coding"}. ${note.pricingType === "free" ? "Completely free." : `Priced at ${note.priceLabel || "affordable rate"}.`}`;
  const imageUrl = note.coverImageUrl ?? `${APP_URL}/og/note/${slug}.png`;
  const pageUrl = `${APP_URL}/notes/${slug}`;

  return {
    title,
    description: desc,
    keywords: [
      note.title.toLowerCase(),
      `${note.level} notes`,
      `${note.category?.name} notes`,
      "coding notes",
      "developer notes",
      "web dev notes",
      ...(note.tags || []),
      "programming notes",
      "download notes",
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description: desc,
      url: pageUrl,
      siteName: "Notes Provider",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: note.title, type: "image/png" }],
      type: "article",
      publishedTime: note.createdAt.toISOString(),
      modifiedTime: note.updatedAt.toISOString(),
      authors: ["Notes Provider"],
      section: note.category?.name || "Study Notes",
      tags: note.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [imageUrl],
    },
    other: {
      "article:published_time": note.createdAt.toISOString(),
      "article:modified_time": note.updatedAt.toISOString(),
      "article:section": note.category?.name || "Study Notes",
    },
  };
}

export default async function NoteRoute({ params }: NotePageProps) {
  const { slug } = await params;

  const noteDoc = await Note.findOne({ slug, visibility: "public" })
    .populate<PopulatedNote>("category")
    .lean()
    .exec();

  if (!noteDoc) {
    notFound();
  }

  const note = noteDoc as unknown as PopulatedNote;
  const pageUrl = `${APP_URL}/notes/${note.slug}`;
  const imageUrl = note.coverImageUrl ?? `${APP_URL}/og/note/${note.slug}.png`;

  const jsonLd = [
    productJsonLd({
      title: note.title,
      description: note.description || "",
      price: note.price,
      priceLabel: note.pricingType === "free" ? "Free" : `₹${note.price}`,
      currency: "INR",
      imageUrl: note.coverImageUrl ?? null,
      category: { name: note.category?.name || "Study Notes" },
      level: note.level,
      pageCount: note.pageCount ?? null,
      url: `/notes/${note.slug}`,
    }),
    courseJsonLd({
      title: note.title,
      description: note.description || "",
      url: `/notes/${note.slug}`,
      category: { name: note.category?.name || "Study Notes" },
      level: note.level,
      imageUrl: note.coverImageUrl ?? null,
    }),
    articleJsonLd({
      title: note.title,
      description: note.description || "",
      url: `/notes/${note.slug}`,
      imageUrl: note.coverImageUrl ?? null,
      category: { name: note.category?.name || "Study Notes" },
      level: note.level,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
      tags: note.tags,
    }),
    breadcrumbJsonLd([
      { name: "Home", url: APP_URL },
      { name: "Notes", url: `${APP_URL}/notes` },
      { name: note.title, url: pageUrl },
    ]),
    webpageJsonLd({
      title: note.title,
      description: note.description?.slice(0, 160) || "",
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
