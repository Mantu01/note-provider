import { StaticPage } from "@/components/layout/static-page";
import { BRAND } from "@/lib/constants";

export default function AboutPage() {
  return <StaticPage title="About us" description={BRAND.description}><p>{BRAND.name} exists to make focused, high-quality revision material easier to find. Every resource is curated for learners who value clarity and momentum.</p><h2>Made for serious learners</h2><p>We believe the best study notes cut through noise, surface the important ideas, and give you a useful place to begin.</p></StaticPage>;
}
