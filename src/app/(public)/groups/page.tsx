import type { Metadata } from "next";
import JsonLd, { webpageJsonLd } from "@/components/seo/json-ld";
import { GroupsPage } from "@/features/groups/components/groups-catalogue";
import { SEO } from "@/lib/constants";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: `Developer Bundles — Web Dev, DSA & System Design | ${SEO.siteName}`,
  description: "Get curated developer bundles covering web development, DSA, frontend, backend, DBMS, and system design. Save more with complete topic packs.",
  keywords: ["web dev bundles", "DSA bundle", "backend bundle", "frontend bundle", "system design bundle", "coding bundle"],
  alternates: { canonical: `${APP_URL}/groups` },
  openGraph: {
    title: "Developer Bundles — Web Dev, DSA & System Design",
    description: "Get curated developer bundles covering web development, DSA, backend, frontend, DBMS, and system design.",
    url: `${APP_URL}/groups`,
    siteName: SEO.siteName,
    images: [
      {
        url: `${APP_URL}/og/home.png`,
        width: SEO.ogImageWidth,
        height: SEO.ogImageHeight,
        alt: "Developer bundles at Notes Provider",
      },
    ],
    type: "website",
    locale: SEO.locale,
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Developer Bundles — Web Dev, DSA & System Design",
    description: "Get curated developer bundles covering the core topics you need to ship and interview better.",
    images: [`${APP_URL}/og/home.png`],
  },
};

export default function GroupsPageRoute() {
  return (
    <>
      <JsonLd
        scripts={[
          webpageJsonLd({
            title: "Developer Bundles — Web Dev, DSA & System Design",
            description:
              "Get curated developer bundles covering web development, DSA, frontend, backend, DBMS, and system design.",
            url: `${APP_URL}/groups`,
            image: `${APP_URL}/og/home.png`,
            itemCount: 0,
          }),
        ]}
      />
      <GroupsPage />
    </>
  );
}
