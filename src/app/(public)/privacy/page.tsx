import Link from "next/link";
import type { Metadata } from "next";
import JsonLd, { webpageJsonLd } from "@/components/seo/json-ld";
import { StaticPage } from "@/components/layout/static-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BRAND, SEO, PRIVACY_POLICY_SECTIONS } from "@/lib/constants";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Privacy Policy — How We Protect Your Data | Notes Provider",
  description:
    "Information on how Notes Provider collects, uses, and protects your personal data. Read our complete privacy policy for study notes purchases.",
  keywords: [
    "privacy policy",
    "data protection",
    "personal data",
    "Notes Provider privacy",
    "student data privacy",
  ],
  alternates: { canonical: `${APP_URL}/privacy` },
  openGraph: {
    title: "Privacy Policy — Notes Provider",
    description: "Information on how Notes Provider collects, uses, and protects your personal data.",
    url: `${APP_URL}/privacy`,
    siteName: SEO.siteName,
    images: [{ url: `${APP_URL}/og/home.png`, width: SEO.ogImageWidth, height: SEO.ogImageHeight, alt: "Privacy Policy" }],
    type: "website",
    locale: SEO.locale,
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Privacy Policy — Notes Provider",
    description: "How we collect, use, and protect your personal data.",
    images: [`${APP_URL}/og/home.png`],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        scripts={[
          webpageJsonLd({
            title: "Privacy Policy — Notes Provider",
            description: "Information on how Notes Provider collects, uses, and protects your personal data.",
            url: `${APP_URL}/privacy`,
          }),
        ]}
      />
      <StaticPage
        title="Privacy Policy"
        description={`Last updated: August 15, 2026. Your privacy is paramount to ${BRAND.name}.`}
      >
        <Accordion className="w-full space-y-4">
          {PRIVACY_POLICY_SECTIONS.map((section) => (
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
