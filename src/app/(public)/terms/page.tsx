import { StaticPage } from "@/components/layout/static-page";
import { BRAND } from "@/lib/constants";
import { TERMS_AND_CONDITIONS } from "@/lib/policies";

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
      <div className="whitespace-pre-wrap">{TERMS_AND_CONDITIONS}</div>
    </StaticPage>
  );
}
