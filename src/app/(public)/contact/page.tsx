import Link from "next/link";
import { ArrowUpRight, Clock3, Code2, HelpCircle, Mail, MessageSquareText, PlayCircle, type LucideIcon } from "lucide-react";
import { StaticPage } from "@/components/layout/static-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import { SEO, CONTACT_CHANNELS } from "@/lib/constants";
import JsonLd, { webpageJsonLd } from "@/components/seo/json-ld";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const ICON_MAP: Record<string, LucideIcon> = {
  MessageSquareText,
  PlayCircle,
  Mail,
  Code2,
};

export const metadata: Metadata = {
  title: "Contact Support — Get Help with Developer Notes | Notes Provider",
  description:
    "Need help with a note purchase, delivery, or preview? Contact the Notes Provider support team via GitHub, X, or email. Fast responses for all your developer note queries.",
  keywords: [
    "contact notes provider",
    "support",
    "developer notes help",
    "customer service",
    "notes delivery support",
  ],
  alternates: { canonical: `${APP_URL}/contact` },
  openGraph: {
    title: "Contact Support — Notes Provider",
    description:
      "Get in touch with the Notes Provider support team for purchase or delivery help on developer notes and coding resources.",
    url: `${APP_URL}/contact`,
    siteName: SEO.siteName,
    images: [{ url: `${APP_URL}/og/home.png`, width: SEO.ogImageWidth, height: SEO.ogImageHeight, alt: "Contact Notes Provider" }],
    type: "website",
    locale: SEO.locale,
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Contact Support — Notes Provider",
    description: "Get in touch with the Notes Provider support team.",
    images: [`${APP_URL}/og/home.png`],
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        scripts={[
          webpageJsonLd({
            title: "Contact Support — Notes Provider",
            description: "Get in touch with the Notes Provider support team for purchase or delivery help on developer notes and coding resources.",
            url: `${APP_URL}/contact`,
            image: `${APP_URL}/og/home.png`,
          }),
        ]}
      />
      <StaticPage
        title="Contact Support"
        description="Need help with a note, preview, or delivery? We are here to assist."
      >
        <div className="not-prose grid gap-4 md:grid-cols-3">
          {CONTACT_CHANNELS.map(({ title, description, href, icon, label }) => {
            const Icon = ICON_MAP[icon];
            return (
              <Card key={title} className="rounded-2xl border border-border/80 bg-card">
                <CardContent className="space-y-4 p-5">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                  <Button
                    render={<a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{label}<ArrowUpRight aria-hidden="true" className="size-4" /></a>}
                    variant="outline"
                    className="w-full justify-center gap-2"
                  >
                    <span className="sr-only">{label}</span>
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-4 rounded-2xl border border-border/80 bg-muted/30 p-5">
            <Clock3 aria-hidden="true" className="mt-0.5 size-5 text-primary" />
            <div>
              <h3 className="m-0 text-base font-semibold text-foreground">Note delivery</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Paid note orders are fulfilled instantly after payment. You can download your PDF notes directly from the order status page once payment is confirmed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-border/80 bg-muted/30 p-5">
            <HelpCircle aria-hidden="true" className="mt-0.5 size-5 text-primary" />
            <div>
              <h3 className="m-0 text-base font-semibold text-foreground">Have a general question?</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Browse the FAQ on the home page or open any note preview before buying to confirm the format and quality.
              </p>
              <div className="mt-3">
                <Button render={<Link href="/" />} variant="link" className="h-auto p-0 text-sm font-medium">
                  View home page →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </StaticPage>
    </>
  );
}
