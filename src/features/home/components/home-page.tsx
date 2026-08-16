"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Download, ShieldCheck, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/shared/category-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
import { ShimmerLoader, ShimmerNoteCard, ShimmerStatCard } from "@/components/shared/shimmer-loader";
import { useHome } from "@/features/home/api/use-home";
import { BRAND } from "@/lib/constants";
import { formatCompactNumber } from "@/lib/format";
import type { PublicNote, PublicGroup, PublicCategory } from "@/lib/types";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Download, label: "Instant downloads" },
  { icon: Sparkles, label: "Curated notes" },
  { icon: BookOpen, label: "Human support" },
] satisfies Array<{ icon: React.ComponentType<{ className?: string }>; label: string }>;

const FAQS = [
  ["When will I receive paid notes?", "Paid notes are delivered to your selected Instagram, WhatsApp, or email handle within 4–6 hours of a successful payment."],
  ["How do free notes work?", "Free notes are available for immediate PDF download. No sign-up is required."],
  ["Which topics do you cover?", "We focus on web development, frontend, backend, DSA, DBMS, system design, and interview-prep topics."],
  ["Which payment methods can I use?", "Payments are securely processed by Razorpay and support its available Indian payment methods."],
  ["Can I get a refund?", "Digital notes are non-refundable after delivery. Please review the preview and description before paying."],
] as const;

const STEPS = [
  { num: "01", title: "Browse", desc: "Explore our curated catalogue by topic or level." },
  { num: "02", title: "Preview", desc: "Review any note with a free sample before you decide." },
  { num: "03", title: "Pay", desc: "Complete checkout securely via Razorpay — UPI, cards, or net banking." },
  { num: "04", title: "Receive", desc: "Get your notes on Instagram, WhatsApp, or email within 4–6 hours." },
] satisfies Array<{ num: string; title: string; desc: string }>;

export function HomePage() {
  const home = useHome();

  if (home.isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState message="Unable to load the homepage. Please try again." onRetry={() => home.refetch()} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Hero stats={home.data?.stats} isLoading={home.isPending} />

      <Section className="border-y border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Categories" title="Browse by topic" />
          <CategoryStrip categories={home.data?.categories} isLoading={home.isPending} />
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Featured"
            title="Hand-picked notes"
            action={<SeeAll href="/notes" />}
          />
          <NoteGrid
            items={home.data?.featuredNotes ?? []}
            isLoading={home.isPending}
            emptyTitle="Featured notes coming soon"
            emptyDesc="Our editor picks are being prepared."
          />
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Start free"
            title="Build momentum at zero cost"
            action={<SeeAll href="/notes?pricing=free" />}
          />
          <NoteGrid
            items={home.data?.freeNotes ?? []}
            isLoading={home.isPending}
            emptyTitle="Free notes coming soon"
            emptyDesc="Check back for resources you can download immediately."
          />
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Bundles"
            title="Save with complete packs"
            action={<SeeAll href="/groups" />}
          />
          <GroupGrid groups={home.data?.featuredGroups ?? []} isLoading={home.isPending} />
        </div>
      </Section>

      <Section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="How it works" title="Four simple steps" />
          <StepsGrid steps={STEPS} />
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Trust" title="Built for serious learners" />
          <TrustGrid items={TRUST_ITEMS} />
        </div>
      </Section>

      <Section className="border-t border-border/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="FAQ" title="Common questions" center />
          <FAQAccordion />
        </div>
      </Section>

      <CTABanner />
    </div>
  );
}

function Hero({
  stats,
  isLoading,
}: {
  stats?: { totalNotes: number; totalCategories: number; totalDownloads: number; happyLearners: number };
  isLoading: boolean;
}) {
  const STATS_CONFIG = [
    { label: "Notes", key: "totalNotes" as const },
    { label: "Topics", key: "totalCategories" as const },
    { label: "Downloads", key: "totalDownloads" as const },
    { label: "Learners", key: "happyLearners" as const },
  ] as const;

  return (
    <section className="relative overflow-hidden pt-14 pb-12 md:pt-20 md:pb-16 lg:pt-28 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--brand-green-soft),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--brand-orange-soft),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase backdrop-blur-md">
            <Sparkles aria-hidden="true" className="size-3" />
            Developer notes that scale
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tighter leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
            Learn the stack{" "}
            <span className="brand-gradient-text">with notes that ship.</span>
          </h1>

          <p className="max-w-sm text-base leading-relaxed text-muted-foreground md:text-lg">
            {BRAND.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              render={<Link href="/notes" />}
              size="lg"
              className="h-11 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground"
            >
              Browse catalogue
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Button>
            <Button
              render={<Link href="/notes?pricing=free" />}
              variant="outline"
              size="lg"
              className="h-11 rounded-full border-2 px-7 text-sm font-semibold"
            >
              Free notes
            </Button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => <ShimmerStatCard key={i} />)
            : STATS_CONFIG.map((s) => (
                <div key={s.key} className="rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-center backdrop-blur-sm">
                  <p className="text-xl font-black tracking-tight text-foreground md:text-2xl">
                    {stats ? formatCompactNumber(stats[s.key]) : "—"}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={`py-12 md:py-16 ${className ?? ""}`}>{children}</section>;
}

function SectionHeader({
  eyebrow,
  title,
  action,
  center,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "mb-6 text-center" : "mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between"}>
      <div className={center ? "mx-auto max-w-xl space-y-1" : "max-w-xl space-y-1"}>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{eyebrow}</p>
        <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function SeeAll({ href, label = "View all" }: { href: string; label?: string }) {
  return (
    <Button
      render={<Link href={href} />}
      variant="outline"
      size="sm"
      className="h-8 rounded-full text-xs"
    >
      {label}
      <ArrowRight aria-hidden="true" className="ml-1 size-3" />
    </Button>
  );
}

function CategoryStrip({
  categories,
  isLoading,
}: {
  categories?: PublicCategory[];
  isLoading: boolean;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {isLoading ? (
        Array.from({ length: 5 }, (_, i) => (
          <ShimmerLoader key={i} className="min-w-44 h-12 rounded-xl shrink-0" />
        ))
      ) : categories?.length ? (
        categories.map((c) => <CategoryCard key={c.id} category={c} />)
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Categories coming soon"
          description="Focused study resources are on their way."
        />
      )}
    </div>
  );
}

function NoteGrid({
  items,
  isLoading,
  emptyTitle,
  emptyDesc,
}: {
  items: PublicNote[];
  isLoading: boolean;
  emptyTitle: string;
  emptyDesc: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }, (_, i) => <ShimmerNoteCard key={i} />)
        : items.length
          ? items.slice(0, 4).map((n) => <NoteCard key={n.id} note={n} />)
          : (
            <div className="col-span-full">
              <EmptyState icon={BookOpen} title={emptyTitle} description={emptyDesc} />
            </div>
          )}
    </div>
  );
}

function GroupGrid({
  groups,
  isLoading,
}: {
  groups: PublicGroup[];
  isLoading: boolean;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }, (_, i) => <ShimmerNoteCard key={i} />)
        : groups.length
          ? groups.slice(0, 3).map((g) => <GroupCard key={g.id} group={g} />)
          : (
            <div className="col-span-full">
              <EmptyState icon={BookOpen} title="Bundles coming soon" description="Value-packed collections are being assembled." />
            </div>
          )}
    </div>
  );
}

function StepsGrid({ steps }: { steps: { num: string; title: string; desc: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map(({ num, title, desc }) => (
        <div key={num} className="rounded-xl border border-border/60 bg-card p-4">
          <span className="mb-2 block font-heading text-3xl font-black tracking-tighter text-primary/15">
            {num}
          </span>
          <h3 className="mb-1 text-sm font-semibold">{title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
        </div>
      ))}
    </div>
  );
}

function TrustGrid({ items }: { items: { icon: React.ComponentType<{ className?: string }>; label: string }[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
          <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}

function CTABanner() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/8 px-6 py-12 text-center shadow-sm md:px-10 md:py-16">
          <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/6 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-accent/6 blur-[100px]" />
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Ready?</p>
            <h2 className="font-heading text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
              Start learning smarter today.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Join thousands of developers who accelerated their growth with curated notes.
            </p>
            <div className="flex justify-center gap-3 pt-1">
              <Button
                render={<Link href="/notes" />}
                size="lg"
                className="h-11 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground"
              >
                Browse notes
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Button>
              <Button
                render={<Link href="/contact" />}
                variant="outline"
                size="lg"
                className="h-11 rounded-full px-7 text-sm font-semibold"
              >
                Contact support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQAccordion() {
  return (
    <Accordion defaultValue={["faq-0"]} className="rounded-2xl border bg-card">
      {FAQS.map(([q, a], i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-b-0 px-5">
          <AccordionTrigger className="text-sm font-medium py-3">
            {q}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-3">
            {a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
