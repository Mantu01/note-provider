import type { Metadata } from "next";
import { OrderLookupPage } from "@/features/orders/components/order-lookup-page";
import { APP_URL, SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Track Your Order — Check Note Delivery Status | Notes Provider",
  description:
    "Track your study note order and check delivery status. Enter your order ID to see when your PDF notes are ready.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${APP_URL}/order/track` },
  openGraph: {
    title: "Track Your Order — Notes Provider",
    description: "Track your study note order and check delivery status.",
    url: `${APP_URL}/order/track`,
    siteName: SEO.siteName,
    type: "website",
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Track Your Order — Notes Provider",
    description: "Track your study note order and check delivery status.",
  },
};

export default function TrackOrderRoute() {
  return <OrderLookupPage />;
}
