import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
import { BRAND } from "@/lib/constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "Refund Policy",
  description: "Guidelines regarding refunds, cancellations, and order issues at Notes Provider.",
};

export default function RefundPolicyPage() {
  return (
    <StaticPage
      title="Refund Policy"
      description="Please review our refund and delivery policy prior to making a purchase."
    >
      <Accordion className="w-full space-y-4">
        <AccordionItem value="item-1" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            1. Digital Goods Policy
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            Due to the digital nature of the products sold on {BRAND.name} (PDF study notes, revision guides, and note bundles) which are delivered directly to your social handle or email, <strong>all sales are non-refundable once the digital material has been delivered.</strong>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            2. Previewing Before Purchase
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            <p className="mb-3">To ensure complete satisfaction before making a payment:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Every paid note features a downloadable <strong>Preview PDF</strong> allowing you to assess structure, contents, and readability.</li>
              <li>Note detail pages specify exact page counts, covered topics, subjects, and skill levels.</li>
              <li>Free study notes are available for immediate download without payment so you can evaluate our content quality beforehand.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            3. Non-Delivery & Exceptional Assistance
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            <p className="mb-3">While completed orders are final, we ensure every customer receives what they paid for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Delivery Delay:</strong> If you have not received your study notes within 6 hours of payment confirmation, please check your Instagram Message Requests, WhatsApp chats, or Email Spam folder.</li>
              <li><strong>Unfulfilled Orders:</strong> If your order has not been delivered due to an incorrect handle submission or system oversight, contact support with your order number. We will verify payment and resend your files immediately.</li>
              <li><strong>Double Charge / Duplicate Payment:</strong> If you were accidentally charged twice for the same transaction via Razorpay, any excess payment will be refunded to your original payment source.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border rounded-xl bg-card px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline text-lg font-semibold">
            4. How to Request Assistance
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
            <p className="mb-3">If you experience any issues with order delivery or payment status, reach out to our support team with your order number and transaction proof:</p>
            <Link href="/contact" className="text-primary underline font-medium hover:text-primary/80 transition-colors">
              Contact Support Team →
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StaticPage>
  );
}
