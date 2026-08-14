import { StaticPage } from "@/components/layout/static-page";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND } from "@/lib/constants";

const VALUES = [
  { title: "Focused learning", text: "We curate the study material that actually helps students move faster with less friction." },
  { title: "Clear structure", text: "Every note is designed to reduce confusion and make revision feel manageable and reliable." },
  { title: "Practical value", text: "We keep the experience simple, useful, and tailored to the way learners study in real life." },
] as const;

export default function AboutPage() {
  return (
    <StaticPage title="About us" description={BRAND.description}>
      <p>{BRAND.name} exists to make focused, high-quality revision material easier to discover, trust, and use.</p>

      <p>We believe serious learners need resources that cut through noise and help them understand what matters most. That is why every note and bundle is selected to be practical, readable, and exam-oriented.</p>

      <h2>Built for better revision</h2>
      <p>From first-time review to final exam preparation, our approach stays simple: less clutter, better structure, and an easier path to progress.</p>

      <div className="not-prose grid gap-4 md:grid-cols-3">
        {VALUES.map((value) => (
          <Card key={value.title} className="rounded-2xl border border-border/80 bg-card">
            <CardContent className="space-y-3 p-5">
              <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{value.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </StaticPage>
  );
}
