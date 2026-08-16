import type { Metadata } from "next";
import JsonLd, { webpageJsonLd } from "@/components/seo/json-ld";
import { StaticPage } from "@/components/layout/static-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BRAND, SEO, TERMS_OF_SERVICE_SECTIONS } from "@/lib/constants";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Terms of Service — Legal Agreement | Notes Provider",
  description:
    "Terms and conditions governing the use of Notes Provider and purchase of developer notes and digital resources. Please read carefully before using our services.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "legal agreement",
    "Notes Provider",
    "digital notes terms",
  ],
  alternates: { canonical: `${APP_URL}/terms` },
  openGraph: {
    title: "Terms of Service — Notes Provider",
    description: "Terms and conditions governing the use of Notes Provider and purchase of developer notes and digital resources.",
    url: `${APP_URL}/terms`,
    siteName: SEO.siteName,
    images: [{ url: `${APP_URL}/og/home.png`, width: SEO.ogImageWidth, height: SEO.ogImageHeight, alt: "Terms of Service" }],
    type: "website",
    locale: SEO.locale,
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Terms of Service — Notes Provider",
    description: "Terms and conditions for using Notes Provider.",
    images: [`${APP_URL}/og/home.png`],
  },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        scripts={[
          webpageJsonLd({
            title: "Terms of Service — Notes Provider",
            description: "Terms and conditions governing the use of Notes Provider and purchase of developer notes and digital resources.",
            url: `${APP_URL}/terms`,
          }),
        ]}
      />
      <StaticPage
        title="Terms of Service"
        description={`Last updated: August 15, 2026. Please read these terms carefully before using ${BRAND.name}.`}
      >
        <Accordion className="w-full space-y-4">
          {TERMS_OF_SERVICE_SECTIONS.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border rounded-xl bg-card px-4 shadow-sm">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </StaticPage>
    </>
  );
}
