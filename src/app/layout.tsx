import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Outfit, Caveat, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { APP_URL, BRAND, SEO } from "@/lib/constants";
import { AppProviders } from "@/providers/app-providers";
import JsonLd, {
  organizationJsonLd,
  websiteJsonLd,
} from "@/components/seo/json-ld";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

const safeMetadataBase = URL.canParse(APP_URL) ? new URL(APP_URL) : undefined;
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: safeMetadataBase,
  title: {
    default: SEO.defaultTitle,
    template: `%s | ${BRAND.name}`,
  },
  description: SEO.defaultDescription,
  keywords: [
    "coding notes",
    "web development notes",
    "frontend notes",
    "backend notes",
    "DSA notes",
    "DBMS notes",
    "system design notes",
    "interview preparation notes",
    "developer resources",
    "coding PDFs",
    "notes bundle",
    "notes provider",
    "web dev notes",
    "software engineering notes",
    "programming notes",
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    url: APP_URL,
    images: [
      {
        url: `${APP_URL}/og/home.png`,
        width: SEO.ogImageWidth,
        height: SEO.ogImageHeight,
        alt: SEO.ogImageAlt,
        type: "image/png",
      },
    ],
    locale: SEO.locale,
    countryName: SEO.countryName,
  },
  twitter: {
    card: SEO.twitterCard,
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [`${APP_URL}/og/home.png`],
    creator: "@notesprovider",
    site: "@notesprovider",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} ${caveat.variable} ${instrumentSans.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cloudinary.com" />
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cloudinary.com" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={BRAND.name} />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow" />
        <meta name="revisit-after" content="1 days" />
        <meta name="language" content="English" />
        <meta name="content-language" content="en" />
        <meta name="document-state" content="Dynamic" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="ICBM" content="20.5937, 78.9629" />
        <meta name="classification" content="Education, E-commerce, Developer Resources, Programming Notes" />
        <meta name="subject" content="Coding Notes, Web Development, DSA, DBMS, Backend, Frontend, System Design" />
        <meta name="abstract" content="Curated coding notes, developer resources, and interview-prep bundles for web dev and software engineering learners." />
        <JsonLd scripts={[...organizationJsonLd(), ...websiteJsonLd()]} />
        {measurementId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}');`}</Script>
          </>
        ) : null}
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        {measurementId && <GoogleAnalytics gaId={measurementId} />}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
