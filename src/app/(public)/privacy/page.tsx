import { StaticPage } from "@/components/layout/static-page";
import { BRAND } from "@/lib/constants";
import { PRIVACY_POLICY } from "@/lib/policies";

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
      <div className="whitespace-pre-wrap">{PRIVACY_POLICY}</div>
    </StaticPage>
  );
}
