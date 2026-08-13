import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { BRAND } from "@/lib/constants";
import { AppProviders } from "@/providers/app-providers";
import { BodyCleanup } from "@/components/layout/body-cleanup";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: BRAND.name, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  openGraph: { type: "website", siteName: BRAND.name, title: BRAND.name, description: BRAND.description },
  twitter: { card: "summary_large_image", title: BRAND.name, description: BRAND.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth"><body><BodyCleanup /><AppProviders>{children}</AppProviders>{measurementId ? <><Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}');`}</Script></> : null}</body></html>;
}
