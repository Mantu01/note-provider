import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderLookupPage } from "@/components/orders/order-lookup-page";
import { APP_URL, SEO } from "@/lib/constants";
import { OrderLookupSkeleton } from "@/components/shared/shimmer-loader";

export const metadata: Metadata = {
  title: "Track Your Order — Notes Provider",
  description:
    "View your order status and download your study notes after purchase.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${APP_URL}/order/track` },
  openGraph: {
    title: "Track Your Order — Notes Provider",
    description: "View your order status and download your study notes.",
    url: `${APP_URL}/order/track`,
    siteName: SEO.siteName,
    type: "website",
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Track Your Order — Notes Provider",
    description: "View your order status and download your study notes.",
  },
};

export default function TrackOrderRoute() {
  return (
    <Suspense fallback={<OrderLookupSkeleton />}>
      <OrderLookupPage />
    </Suspense>
  );
}
