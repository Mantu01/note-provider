import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
import { BRAND } from "@/lib/constants";

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
      <h2>1. Digital Goods Policy</h2>
      <p>
        Due to the digital nature of the products sold on {BRAND.name} (PDF study notes, revision guides, and note bundles) which are delivered directly to your social handle or email, <strong>all sales are non-refundable once the digital material has been delivered.</strong>
      </p>

      <h2>2. Previewing Before Purchase</h2>
      <p>
        To ensure complete satisfaction before making a payment:
      </p>
      <ul>
        <li>Every paid note features a downloadable <strong>Preview PDF</strong> allowing you to assess structure, contents, and readability.</li>
        <li>Note detail pages specify exact page counts, covered topics, subjects, and skill levels.</li>
        <li>Free study notes are available for immediate download without payment so you can evaluate our content quality beforehand.</li>
      </ul>

      <h2>3. Non-Delivery & Exceptional Assistance</h2>
      <p>
        While completed orders are final, we ensure every customer receives what they paid for:
      </p>
      <ul>
        <li><strong>Delivery Delay:</strong> If you have not received your study notes within 6 hours of payment confirmation, please check your Instagram Message Requests, WhatsApp chats, or Email Spam folder.</li>
        <li><strong>Unfulfilled Orders:</strong> If your order has not been delivered due to an incorrect handle submission or system oversight, contact support with your order number. We will verify payment and resend your files immediately.</li>
        <li><strong>Double Charge / Duplicate Payment:</strong> If you were accidentally charged twice for the same transaction via Razorpay, any excess payment will be refunded to your original payment source.</li>
      </ul>

      <h2>4. How to Request Assistance</h2>
      <p>
        If you experience any issues with order delivery or payment status, reach out to our support team with your order number and transaction proof:
      </p>
      <p>
        <Link href="/contact" className="text-primary underline font-medium">
          Contact Support Team →
        </Link>
      </p>
    </StaticPage>
  );
}
