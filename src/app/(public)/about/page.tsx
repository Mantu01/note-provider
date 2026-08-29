import type { Metadata } from "next";
import JsonLd, { webpageJsonLd, collectionPageJsonLd } from "@/components/seo/json-ld";
import { StaticPage } from "@/components/layout/static-page";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND, SEO, ABOUT_VALUES } from "@/lib/constants";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "About Us — Notes Provider | Mission & Values",
  description:
    "Learn about Notes Provider — our mission to help developers discover clear, practical notes on frontend, backend, DSA, DBMS, and system design.",
  keywords: [
    "about notes provider",
    "developer notes company",
    "coding notes platform",
    "web dev notes",
    "programming resources",
  ],
  alternates: { canonical: `${APP_URL}/about` },
  openGraph: {
    title: "About Us — Notes Provider",
    description:
      "Learn about Notes Provider — our mission to make developer-focused learning resources easier to discover and use.",
    url: `${APP_URL}/about`,
    siteName: SEO.siteName,
    images: [{ url: `${APP_URL}/og/home.png`, width: SEO.ogImageWidth, height: SEO.ogImageHeight, alt: "About Notes Provider" }],
    type: "website",
    locale: SEO.locale,
  },
  twitter: {
    card: SEO.twitterCard,
    title: "About Us — Notes Provider",
    description: "Learn about Notes Provider — our mission and values.",
    images: [`${APP_URL}/og/home.png`],
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        scripts={[
          webpageJsonLd({
            title: "About Us — Notes Provider",
            description: "Learn about Notes Provider — our mission to make developer-focused learning resources easier to discover.",
            url: `${APP_URL}/about`,
            image: `${APP_URL}/og/home.png`,
          }),
        ]}
      />
      <StaticPage title="About us" description={BRAND.description}>
        <p>{BRAND.name} exists to make clear, high-quality learning material easier to discover, trust, and use for developers.</p>
        <p>We believe serious learners and engineers need resources that cut through noise and help them understand what matters most. That is why every note and bundle is selected to be practical, readable, and relevant to real-world software work.</p>
        <h2>Built for better learning</h2>
        <p>From first-time revision to interview prep and system design practice, our approach stays simple: less clutter, better structure, and a clearer path to growth.</p>
        <div className="not-prose grid gap-4 md:grid-cols-3">
          {ABOUT_VALUES.map((value) => (
            <Card key={value.title} className="group rounded-2xl border border-border/80 bg-card transition-shadow hover:shadow-md">
              <CardContent className="space-y-3 p-5">
                <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{value.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </StaticPage>
    </>
  );
}
