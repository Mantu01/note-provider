import { StaticPage } from "@/components/layout/static-page";
import { BRAND } from "@/lib/constants";

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
      <h2>1. Information We Collect</h2>
      <p>
        We keep data collection minimal and focused strictly on order fulfilment and customer support. When you place an order on {BRAND.name}, we collect:
      </p>
      <ul>
        <li><strong>Full Name:</strong> Used to identify your order.</li>
        <li><strong>Delivery Handle:</strong> One handle chosen by you (Instagram handle, WhatsApp phone number, or Email address) to receive your purchased PDF notes.</li>
        <li><strong>Technical Identifiers:</strong> IP address and user-agent string captured automatically for fraud prevention and security audit logs.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        Your information is used strictly for:
      </p>
      <ul>
        <li>Fulfilling and manually delivering your ordered study notes within the 4–6 hour window.</li>
        <li>Responding to customer support requests and verifying purchase status.</li>
        <li>Detecting, preventing, and addressing fraud or security concerns.</li>
      </ul>
      <p>
        <strong>Zero Marketing Spam:</strong> We never send promotional messages, marketing emails, or unsolicited broadcasts to your social handle or email. Your details are used strictly for order delivery.
      </p>

      <h2>3. Payment Security & Third-Party Processors</h2>
      <p>
        All financial transactions are handled securely by <strong>Razorpay</strong>, our payment gateway partner. {BRAND.name} never collects, stores, or sees your credit/debit card numbers, net banking passwords, or UPI credentials. Razorpay collects transaction details necessary to process payment securely in accordance with applicable legal and financial standards.
      </p>

      <h2>4. Data Sharing & Selling</h2>
      <p>
        We do not sell, rent, trade, or share your personal information or contact handles with any third-party advertisers, data brokers, or external companies under any circumstances.
      </p>

      <h2>5. Security</h2>
      <p>
        We implement industry-standard encryption and security practices to safeguard all lead data and administrative records.
      </p>

      <h2>6. Contact Regarding Privacy</h2>
      <p>
        If you have questions regarding this Privacy Policy or wish to request data erasure for past order records, please reach out to us via our support channels.
      </p>
    </StaticPage>
  );
}
