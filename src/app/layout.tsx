import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { APP_URL, BRAND, SEO } from "@/lib/constants";
import { AppProviders } from "@/providers/app-providers";
import JsonLd, {
  organizationJsonLd,
  websiteJsonLd,
} from "@/components/seo/json-ld";
import { GoogleAnalytics } from '@next/third-parties/google';
import { ShimmerLoader } from "@/components/shared/shimmer-loader";

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

const safeMetadataBase = URL.canParse(APP_URL) ? new URL(APP_URL) : undefined;
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: safeMetadataBase,
  title: {
    default: SEO.defaultTitle,
    template: `%s | ${BRAND.name}`,
  },
  description: SEO.defaultDescription,
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
        url: `${APP_URL}/og/home`,
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
    images: [`${APP_URL}/og/home`],
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
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
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
      className={`${inter.variable} ${outfit.variable}`}
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={BRAND.name} />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <JsonLd scripts={[...organizationJsonLd(), ...websiteJsonLd()]} />
        {measurementId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}');`}</Script>
          </>
        ) : null}
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:p-3">
          Skip to main content
        </a>
        {measurementId && <GoogleAnalytics gaId={measurementId} />}
        <AppProviders>
          <Suspense fallback={<ShimmerLoader className="h-14 w-full" />}>
            {children}
          </Suspense>
        </AppProviders>
      </body>
    </html>
  );
}
