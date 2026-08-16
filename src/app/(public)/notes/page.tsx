import type { Metadata } from "next";
import JsonLd, { webpageJsonLd } from "@/components/seo/json-ld";
import { NotesCatalogue } from "@/features/notes/components/notes-catalogue";
import { SEO } from "@/lib/constants";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: `Coding Notes — Web Dev, DSA, DBMS & System Design | ${SEO.siteName}`,
  description: "Browse coding notes for web development, frontend, backend, DSA, DBMS, system design, and interview preparation. Free and premium developer resources.",
  keywords: ["web development notes", "DSA notes", "DBMS notes", "backend notes", "frontend notes", "system design notes", "coding notes"],
  alternates: { canonical: `${APP_URL}/notes` },
  openGraph: {
    title: "Coding Notes — Web Dev, DSA, DBMS & System Design",
    description: "Browse coding notes for web development, frontend, backend, DSA, DBMS, and system design.",
    url: `${APP_URL}/notes`,
    siteName: SEO.siteName,
    images: [
      {
        url: `${APP_URL}/og/home.png`,
        width: SEO.ogImageWidth,
        height: SEO.ogImageHeight,
        alt: "Coding notes collection at Notes Provider",
      },
    ],
    type: "website",
    locale: SEO.locale,
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Coding Notes — Web Dev, DSA, DBMS & System Design",
    description: "Browse coding notes for web development, backend, DSA, and system design.",
    images: [`${APP_URL}/og/home.png`],
  },
};

export default function NotesPage() {
  return (
    <>
      <JsonLd
        scripts={[
          webpageJsonLd({
            title: "Coding Notes — Web Dev, DSA, DBMS & System Design",
            description:
              "Browse coding notes for web development, frontend, backend, DSA, DBMS, and system design. Free and paid developer resources.",
            url: `${APP_URL}/notes`,
            image: `${APP_URL}/og/home.png`,
            itemCount: 0,
          }),
        ]}
      />
      <NotesCatalogue />
    </>
  );
}
