import type { Metadata } from "next";
import JsonLd, { webpageJsonLd } from "@/components/seo/json-ld";
import { StaticPage } from "@/components/layout/static-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRight, Code2, HelpCircle, Mail, MessageSquareText, PlayCircle, ShieldCheck } from "lucide-react";
import { APP_URL, SEO, CONTACT_CHANNELS } from "@/lib/constants";
import { InstagramIcon } from "@/components/shared/social-icons";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquareText,
  PlayCircle,
  Mail,
  Code2,
  Instagram: InstagramIcon,
};

export const metadata: Metadata = {
  title: "Contact Support — Get Help with Developer Notes | Notes Provider",
  description:
    "Need help with a note purchase, download, or preview? Contact the Notes Provider support team via GitHub, X, or email. Fast responses for all your developer note queries.",
  alternates: { canonical: `${APP_URL}/contact` },
  openGraph: {
    title: "Contact Support — Notes Provider",
    description:
      "Get in touch with the Notes Provider support team for purchase or download help on developer notes and coding resources.",
    url: `${APP_URL}/contact`,
    siteName: SEO.siteName,
    images: [{ url: `${APP_URL}/og/home`, width: SEO.ogImageWidth, height: SEO.ogImageHeight, alt: "Contact Notes Provider" }],
    type: "website",
    locale: SEO.locale,
  },
  twitter: {
    card: SEO.twitterCard,
    title: "Contact Support — Notes Provider",
    description: "Get in touch with the Notes Provider support team.",
    images: [`${APP_URL}/og/home`],
  },
};

type ContactChannel = (typeof CONTACT_CHANNELS)[number];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        scripts={[
          webpageJsonLd({
            title: "Contact Support — Notes Provider",
            description: "Get in touch with the Notes Provider support team for purchase or download help on developer notes and coding resources.",
            url: `${APP_URL}/contact`,
            image: `${APP_URL}/og/home`,
          }),
        ]}
      />
      <StaticPage
        title="Contact Support"
        description="Need help with a note, preview, or download? We are here to assist."
      >
        <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_CHANNELS.map((channel: ContactChannel) => {
            const Icon = ICON_MAP[channel.icon];
            const external = channel.href.startsWith("http");
            return (
              <Card key={channel.title} className="rounded-2xl border border-border/80 bg-card">
                <CardContent className="flex flex-col gap-4 p-5">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{channel.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{channel.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-auto w-full justify-center gap-2"
                    render={
                      <Link
                        href={channel.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                      />
                    }
                  >
                    {channel.label}
                    <ArrowUpRight aria-hidden="true" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-muted/20 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h3 className="m-0 text-base font-semibold text-foreground">Instant note access</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Paid orders activate immediately after payment. Download your PDF directly from the order confirmation page.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-muted/20 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <HelpCircle aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h3 className="m-0 text-base font-semibold text-foreground">Preview before you buy</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Browse every note preview to check formatting and quality. Browse our FAQ for common questions first.
              </p>
              <div className="mt-3">
                <Button render={<Link href="/" />} variant="link" className="h-auto p-0 text-sm font-medium">
                  Visit home page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </StaticPage>
    </>
  );
}
