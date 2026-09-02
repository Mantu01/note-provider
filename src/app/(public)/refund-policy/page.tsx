import type { Metadata } from "next";
import JsonLd, { webpageJsonLd } from "@/components/seo/json-ld";
import { StaticPage } from "@/components/layout/static-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { APP_URL, BRAND, SEO, REFUND_POLICY_SECTIONS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy — Digital Goods & Cancellations | Notes Provider",
  description:
    "Guidelines regarding refunds, cancellations, and order issues. Read our complete refund and delivery policy before purchasing study notes.",
  keywords: [
    "refund policy",
    "cancellation policy",
    "digital goods",
    "Notes Provider refund",
    "study notes refund",
  ],
  alternates: { canonical: `${APP_URL}/refund-policy` },
  openGraph: {
    title: "Refund Policy — Notes Provider",
    description: "Guidelines regarding refunds, cancellations, and order issues at Notes Provider.",
    url: `${APP_URL}/refund-policy`,
    siteName: SEO.siteName,
    images: [{ url: `${APP_URL}/og/home.png`, width: SEO.ogImageWidth, height: SEO.ogImageHeight, alt: "Refund Policy" }],
    type: "website",
    locale: SEO.locale,
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Refund Policy — Notes Provider",
    description: "Guidelines regarding refunds, cancellations, and order issues.",
    images: [`${APP_URL}/og/home.png`],
  },
};

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd
        scripts={[
          webpageJsonLd({
            title: "Refund Policy — Notes Provider",
            description: "Guidelines regarding refunds, cancellations, and order issues at Notes Provider.",
            url: `${APP_URL}/refund-policy`,
          }),
        ]}
      />
      <StaticPage
        title="Refund Policy"
        description="Please review our refund and delivery policy prior to making a purchase."
      >
        <Accordion className="w-full space-y-4">
          {REFUND_POLICY_SECTIONS.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border rounded-xl bg-card px-4 shadow-sm">
              <AccordionTrigger className="text-lg font-semibold">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </StaticPage>
    </>
  );
}
