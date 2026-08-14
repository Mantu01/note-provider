import Link from "next/link";
import { ArrowUpRight, Clock3, HelpCircle, Mail, MessageSquareText, PlayCircle } from "lucide-react";
import { StaticPage } from "@/components/layout/static-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CONTACT_ITEMS = [
  {
    title: "X",
    description: "Quick updates, support replies, and announcements.",
    href: "https://x.com",
    icon: MessageSquareText,
    label: "Follow on X",
  },
  {
    title: "YouTube",
    description: "Video summaries and revision guidance for learners.",
    href: "https://youtube.com",
    icon: PlayCircle,
    label: "Watch on YouTube",
  },
  {
    title: "Email",
    description: "For order help, delivery questions, and support requests.",
    href: "mailto:support@notesprovider.com",
    icon: Mail,
    label: "Send an email",
  },
] as const;

export const metadata = {
  title: "Contact Support",
  description: "Get in touch with the Notes Provider support team for purchase or delivery help.",
};

export default function ContactPage() {
  return (
    <StaticPage title="Contact Support" description="Need help with a note, preview, or delivery? We are here to assist.">
      <div className="not-prose grid gap-4 md:grid-cols-3">
        {CONTACT_ITEMS.map(({ title, description, href, icon: Icon, label }) => (
          <Card key={title} className="rounded-2xl border border-border/80 bg-card">
            <CardContent className="space-y-4 p-5">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
              <Button render={<a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} />} variant="outline" className="w-full justify-center gap-2">
                {label}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-4 rounded-2xl border border-border/80 bg-muted/30 p-5">
          <Clock3 aria-hidden="true" className="mt-0.5 size-5 text-primary" />
          <div>
            <h3 className="m-0 text-base font-semibold text-foreground">Expected response time</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Paid note orders are usually fulfilled within 4–6 hours. Support replies are typically answered within a few hours during active working hours.
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
  );
}
