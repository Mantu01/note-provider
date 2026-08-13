import Link from "next/link";
import { Camera, Mail, MessageCircle, HelpCircle, Clock } from "lucide-react";
import { StaticPage } from "@/components/layout/static-page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact Support",
  description: "Get in touch with the Notes Provider support team for purchase or delivery help.",
};

export default function ContactPage() {
  return (
    <StaticPage
      title="Contact Support"
      description="Need help with a note, preview, or delivery? We're here for you."
    >
      <div className="not-prose grid gap-6 sm:grid-cols-3 mb-10">
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Camera className="size-5" />
            </div>
            <h3 className="font-semibold text-lg">Instagram DM</h3>
            <p className="text-sm text-muted-foreground">
              Direct message us with your order number for fast resolution.
            </p>
            <Button render={<a href="https://instagram.com" target="_blank" rel="noreferrer" />} variant="outline" size="sm" className="w-full">
              Message on Instagram
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="size-5" />
            </div>
            <h3 className="font-semibold text-lg">WhatsApp</h3>
            <p className="text-sm text-muted-foreground">
              Reach our support agent directly on WhatsApp for delivery status.
            </p>
            <Button render={<a href="https://wa.me" target="_blank" rel="noreferrer" />} variant="outline" size="sm" className="w-full">
              Chat on WhatsApp
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <h3 className="font-semibold text-lg">Email</h3>
            <p className="text-sm text-muted-foreground">
              For complex queries or billing inquiries, drop us an email.
            </p>
            <Button render={<a href="mailto:support@notesprovider.com" />} variant="outline" size="sm" className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-muted/50 border">
          <Clock className="size-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-base m-0">Expected Response Times</h3>
            <p className="text-sm text-muted-foreground m-0 mt-1">
              Paid note orders are fulfilled manually within 4–6 hours of payment. Support inquiries are typically answered within 2 hours during active working hours (9 AM – 10 PM IST).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 rounded-2xl bg-muted/50 border">
          <HelpCircle className="size-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-base m-0">Have a general question?</h3>
            <p className="text-sm text-muted-foreground m-0 mt-1">
              Check out our frequently asked questions on the home page or browse through note previews directly on any note details page.
            </p>
            <div className="mt-3">
              <Button render={<Link href="/" />} variant="link" className="p-0 h-auto font-medium">
                View FAQ on Home Page →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </StaticPage>
  );
}
