import { StaticPage } from "@/components/layout/static-page";
import { BRAND } from "@/lib/constants";

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
      <h2>1. Overview</h2>
      <p>
        Welcome to {BRAND.name}. By accessing or using our storefront located at this web address, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
      </p>

      <h2>2. Account-Less Purchase Model</h2>
      <p>
        {BRAND.name} operates on a simplified, account-less purchase model. You are not required to register or create a user account to browse free study materials or purchase paid study notes. When purchasing a note or bundle, you provide your full name and a single delivery handle (Instagram, WhatsApp, or Email) where your purchased files will be delivered.
      </p>

      <h2>3. Digital Products & Usage Licence</h2>
      <p>
        All study materials, PDF documents, summaries, and digital guides sold or made available on {BRAND.name} are protected by copyright and intellectual property laws.
      </p>
      <ul>
        <li><strong>Personal Use Only:</strong> Purchased or downloaded materials are licensed exclusively for your individual personal and educational use.</li>
        <li><strong>Prohibition of Redistribution:</strong> You may not share, resell, redistribute, reproduce, upload to public platforms, or broadcast any material obtained from {BRAND.name}.</li>
        <li><strong>Revocation:</strong> Violation of these licence terms may result in cancellation of pending orders and restriction from future access.</li>
      </ul>

      <h2>4. Delivery Timelines</h2>
      <p>
        Free notes are made available for immediate PDF download directly through your browser. Paid notes are delivered manually by our team to your submitted Instagram, WhatsApp, or Email handle within <strong>4 to 6 hours</strong> following verified payment confirmation. If delivery is delayed beyond 6 hours due to technical issues, our support team will assist you promptly.
      </p>

      <h2>5. Pricing & Payments</h2>
      <p>
        All prices are listed in Indian Rupees (INR). Payments are processed securely using Razorpay. We do not store or process your card details, banking credentials, or UPI PINs directly on our servers. You agree to provide accurate delivery handle information during checkout to prevent delivery misdirection.
      </p>

      <h2>6. Modifications to Terms</h2>
      <p>
        We reserve the right to modify these Terms of Service at any time. Any changes will be posted on this page with an updated revision date.
      </p>
    </StaticPage>
  );
}
