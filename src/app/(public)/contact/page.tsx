import Link from "next/link";
import { ArrowUpRight, Clock3, Code2, HelpCircle, Mail, MessageSquareText, PlayCircle, ShieldCheck, type LucideIcon } from "lucide-react";
import { StaticPage } from "@/components/layout/static-page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import { APP_URL, SEO, CONTACT_CHANNELS } from "@/lib/constants";
import JsonLd, { webpageJsonLd } from "@/components/seo/json-ld";

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
        description="Need help with a note, preview, or delivery? We're here to assist."
      >
        <div className="not-prose grid gap-4 md:grid-cols-3">
          {CONTACT_CHANNELS.map(({ title, description, href, icon, label }) => {
            const Icon = ICON_MAP[icon];
            return (
              <Card key={title} className="rounded-2xl border border-border/80 bg-card">
                <CardContent className="flex flex-col gap-4 p-5">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                  <Button
                    render={<a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="w-full">{label} <ArrowUpRight aria-hidden="true" className="ml-1 size-3.5" /></a>}
                    variant="outline"
                    className="mt-auto w-full justify-center gap-2"
                  >
                    <span className="sr-only">Visit {label}</span>
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-muted/20 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h3 className="m-0 text-base font-semibold text-foreground">Instant note delivery</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Paid orders are fulfilled automatically right after payment. Download your PDF directly from the order confirmation page.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-muted/20 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircle aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h3 className="m-0 text-base font-semibold text-foreground">Preview before you buy</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Browse every note preview to check formatting and quality. Browse our FAQ for common questions first.
              </p>
              <div className="mt-3">
                <Button render={<Link href="/" />} variant="link" className="h-auto p-0 text-sm font-medium">
                  Visit home page →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </StaticPage>
    </>
  );
}
