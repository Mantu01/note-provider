import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutContent from "@/components/checkout/checkout-content";
import { CheckoutSkeleton } from "@/components/shared/shimmer-loader";
import { APP_URL, SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Secure Checkout — Notes Provider",
  description: "Complete your purchase for study notes securely via Razorpay.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${APP_URL}/checkout` },
  openGraph: {
    title: "Secure Checkout — Notes Provider",
    description: "Complete your purchase securely.",
    url: `${APP_URL}/checkout`,
    type: "website",
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Secure Checkout — Notes Provider",
    description: "Complete your purchase securely.",
  },
};

export default function CheckoutRoute() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}
