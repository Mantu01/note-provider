import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutContent from "@/features/checkout/components/checkout-content";
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
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="h-96 animate-pulse rounded-3xl bg-muted" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
