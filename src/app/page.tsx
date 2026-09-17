import type { Metadata } from "next";
import JsonLd, { webpageJsonLd, organizationJsonLd } from "@/components/seo/json-ld";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HomePage } from "@/components/home/home-page";
import { APP_URL, SEO } from "@/lib/constants";

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
        url: `${APP_URL}/og/home`,
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
    images: [`${APP_URL}/og/home`],
  },
};

export default function HomePageRoute() {
  return (
    <>
      <JsonLd
        scripts={[
          ...organizationJsonLd(),
          ...webpageJsonLd({
            title: SEO.defaultTitle,
            description: SEO.defaultDescription,
            url: APP_URL,
            image: `${APP_URL}/og/home`,
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
