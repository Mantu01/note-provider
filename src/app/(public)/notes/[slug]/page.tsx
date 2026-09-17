import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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

export default function NoteRoute({ params }: NotePageProps) {
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
        data-testid="note-detail-shell"
      >
        <a href="/">Home</a>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <a href="/notes" className="hover:text-foreground transition-colors">
          Notes
        </a>
        <span aria-hidden="true" className="text-muted-foreground/40">/</span>
        <span className="font-medium text-foreground truncate">Loading…</span>
      </nav>
      <Suspense fallback={null}>
        <NoteDetail params={params} />
      </Suspense>
    </>
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
