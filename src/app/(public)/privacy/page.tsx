import { StaticPage } from "@/components/layout/static-page";
import { BRAND } from "@/lib/constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "Privacy Policy",
  description: "Information on how Notes Provider collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy Policy"
      description={`Last updated: August 4, 2026. Your privacy is paramount to ${BRAND.name}.`}
    >
      <Accordion className="w-full space-y-4">
        <AccordionItem value="item-1" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            1. Information Collection
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            We take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal information. We collect information you provide directly to us, such as when you create an account, make a purchase, or communicate with us.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            2. Use of Information
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            We use this information to process transactions, send order confirmations, and respond to customer service requests.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            3. Data Sharing
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            We do not sell your personal information to third parties. Your data is strictly used for the provision of our services and to enhance your experience.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StaticPage>
  );
}
