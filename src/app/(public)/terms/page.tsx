import { StaticPage } from "@/components/layout/static-page";
import { BRAND } from "@/lib/constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions governing the use of Notes Provider and purchase of study material.",
};

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms of Service"
      description={`Last updated: August 4, 2026. Please read these terms carefully before using ${BRAND.name}.`}
    >
      <Accordion className="w-full space-y-4">
        <AccordionItem value="item-1" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            1. General Agreement
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            By accessing or using our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            2. Personal Use Only
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            Our study notes are provided for personal, non-commercial use only. You may not distribute, modify, or resell any materials purchased from this platform.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            3. Final Sales & Termination
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            All sales are final unless otherwise specified in our refund policy. We reserve the right to terminate access for violation of these terms.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StaticPage>
  );
}
