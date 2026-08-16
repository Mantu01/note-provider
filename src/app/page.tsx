import type { Metadata } from "next";
import JsonLd, {
  faqJsonLd,
  webpageJsonLd,
  websiteJsonLd,
  organizationJsonLd,
  howToJsonLd,
} from "@/components/seo/json-ld";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HomePage } from "@/features/home/components/home-page";
import { SEO } from "@/lib/constants";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: SEO.defaultTitle,
  description: SEO.defaultDescription,
  alternates: { canonical: APP_URL },
  openGraph: {
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    url: APP_URL,
    siteName: SEO.siteName,
    images: [
      {
        url: `${APP_URL}/og/home.png`,
        width: SEO.ogImageWidth,
        height: SEO.ogImageHeight,
        alt: SEO.ogImageAlt,
      },
    ],
    locale: SEO.locale,
    type: "website",
    countryName: SEO.countryName,
  },
  twitter: {
    card: SEO.twitterCard,
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [`${APP_URL}/og/home.png`],
  },
};

export default function HomePageRoute() {
  return (
    <>
      <JsonLd
        scripts={[
          ...websiteJsonLd(),
          ...organizationJsonLd(),
          ...faqJsonLd(SEO.faqs),
          howToJsonLd([
            { name: "Browse notes", text: "Explore our collection of free and premium PDF study notes for every exam." },
            { name: "Preview & select", text: "Preview any note for free and choose the ones that match your needs." },
            { name: "Secure checkout", text: "Pay securely via Razorpay using UPI, cards, or net banking." },
            { name: "Instant delivery", text: "Receive your notes on Instagram, WhatsApp, or email within 4–6 hours." },
          ]),
          webpageJsonLd({
            title: SEO.defaultTitle,
            description: SEO.defaultDescription,
            url: APP_URL,
            image: `${APP_URL}/og/home.png`,
          }),
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <HomePage />
        </main>
        <Footer />
      </div>
    </>
  );
}
