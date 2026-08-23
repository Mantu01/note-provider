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
  ["When will I receive paid notes?", "Paid notes are available for instant download after successful payment."],
  ["How do free notes work?", "Free notes are available for immediate PDF download. No sign-up is required."],
  ["Which topics do you cover?", "We focus on web development, frontend, backend, DSA, DBMS, system design, and interview-prep topics."],
  ["Which payment methods can I use?", "Payments are securely processed by Razorpay and support its available Indian payment methods."],
  ["Can I get a refund?", "Digital notes are non-refundable after delivery. Please review the preview and description before paying."],
] as const;

const STEPS = [
  { num: "01", title: "Browse", desc: "Explore curated catalogue by topic." },
  { num: "02", title: "Preview", desc: "Review any note with a free sample." },
  { num: "03", title: "Pay", desc: "Checkout securely via Razorpay." },
  { num: "04", title: "Download", desc: "Get your notes instantly after payment." },
] satisfies Array<{ num: string; title: string; desc: string }>;

const STATS_CONFIG = [
  { label: "Notes", key: "totalNotes" as const },
  { label: "Topics", key: "totalCategories" as const },
  { label: "Downloads", key: "totalDownloads" as const },
  { label: "Learners", key: "happyLearners" as const },
] as const;

export function HomePage() {
  const home = useHome();

  if (home.isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message="Unable to load the homepage. Please try again." onRetry={() => home.refetch()} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <HeroSection stats={home.data?.stats} isLoading={home.isPending} />

      <div className="section-divider" />

      <HomeSection>
        <SectionHead eyebrow="Categories" title="Browse by topic" />
        <CategoryStrip categories={home.data?.categories} isLoading={home.isPending} />
      </HomeSection>

      <div className="section-divider" />

      <HomeSection>
        <SectionHead eyebrow="Featured" title="Hand-picked notes" action={<SeeAll href="/notes" />} />
        <NoteGrid items={home.data?.featuredNotes ?? []} isLoading={home.isPending} emptyTitle="Featured notes coming soon" emptyDesc="Our editor picks are being prepared." />
      </HomeSection>

      <HomeSection className="bg-muted/20">
        <SectionHead eyebrow="Start free" title="Zero cost, full value" action={<SeeAll href="/notes?pricing=free" />} />
        <NoteGrid items={home.data?.freeNotes ?? []} isLoading={home.isPending} emptyTitle="Free notes coming soon" emptyDesc="Check back for resources you can download immediately." />
      </HomeSection>

      <HomeSection>
        <SectionHead eyebrow="Bundles" title="Save with complete packs" action={<SeeAll href="/groups" />} />
        <GroupGrid groups={home.data?.featuredGroups ?? []} isLoading={home.isPending} />
      </HomeSection>

      <div className="section-divider" />

      <HomeSection>
        <SectionHead eyebrow="How it works" title="Four simple steps" />
        <StepsRow />
      </HomeSection>

      <HomeSection className="bg-muted/20">
        <TrustBar />
      </HomeSection>

      <div className="section-divider" />

      <HomeSection>
        <div className="mx-auto max-w-2xl">
          <SectionHead eyebrow="FAQ" title="Common questions" center />
          <FAQAccordion />
        </div>
      </HomeSection>

      <CTABanner />
    </div>
  );
}

function HeroSection({
  stats,
  isLoading,
}: {
  stats?: { totalNotes: number; totalCategories: number; totalDownloads: number; happyLearners: number };
  isLoading: boolean;
}) {
  return (
    <section className="relative overflow-hidden pt-10 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--brand-green-soft),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--brand-orange-soft),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase backdrop-blur-md">
            <Sparkles aria-hidden="true" className="size-2.5" />
            Developer notes that scale
          </div>

          <h1 className="font-heading text-3xl font-extrabold tracking-tighter leading-[1.08] text-foreground md:text-4xl lg:text-5xl">
            Learn the stack{" "}
            <span className="brand-gradient-text">with notes that ship.</span>
          </h1>

          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {BRAND.description}
          </p>

          <div className="flex flex-wrap gap-2.5 pt-0.5">
            <Button
              render={<Link href="/notes" />}
              size="lg"
              className="h-9 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground"
            >
              Browse catalogue
              <ArrowRight aria-hidden="true" className="ml-1.5 size-3.5" />
            </Button>
            <Button
              render={<Link href="/notes?pricing=free" />}
              variant="outline"
              size="lg"
              className="h-9 rounded-full border-2 px-5 text-xs font-semibold"
            >
              Free notes
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2.5 md:mt-10 md:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => <ShimmerStatCard key={i} />)
            : STATS_CONFIG.map((s) => (
                <div key={s.key} className="rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 text-center backdrop-blur-sm">
                  <p className="text-lg font-black tracking-tight text-foreground md:text-xl">
                    {stats ? formatCompactNumber(stats[s.key]) : "—"}
                  </p>
                  <p className="mt-0.5 text-[9px] font-medium text-muted-foreground uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

function HomeSection({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={`py-8 md:py-12 ${className ?? ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function SectionHead({
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
    <div className={center ? "mb-5 text-center" : "mb-5 flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between"}>
      <div className={center ? "mx-auto max-w-md space-y-0.5" : "max-w-md space-y-0.5"}>
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary">{eyebrow}</p>
        <h2 className="font-heading text-lg font-bold tracking-tight md:text-xl">{title}</h2>
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
      className="h-7 rounded-full text-[10px]"
    >
      {label}
      <ArrowRight aria-hidden="true" className="ml-1 size-2.5" />
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
    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
      {isLoading ? (
        Array.from({ length: 5 }, (_, i) => (
          <ShimmerLoader key={i} className="min-w-36 h-10 rounded-lg shrink-0" />
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
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
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

function StepsRow() {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map(({ num, title, desc }) => (
        <div key={num} className="rounded-xl border border-border/50 bg-card p-3">
          <span className="mb-1.5 block font-heading text-2xl font-black tracking-tighter text-primary/12">
            {num}
          </span>
          <h3 className="mb-0.5 text-xs font-semibold">{title}</h3>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
        </div>
      ))}
    </div>
  );
}

function TrustBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {TRUST_ITEMS.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2">
          <Icon aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function CTABanner() {
  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/8 via-card to-accent/6 px-5 py-8 text-center md:px-8 md:py-10">
          <div className="absolute -top-20 -right-20 size-48 rounded-full bg-primary/5 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 size-48 rounded-full bg-accent/5 blur-[80px]" />
          <div className="relative z-10 mx-auto max-w-md space-y-3">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary">Ready?</p>
            <h2 className="font-heading text-lg font-black tracking-tight md:text-xl lg:text-2xl">
              Start learning smarter today.
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Join thousands of developers who accelerated their growth with curated notes.
            </p>
            <div className="flex justify-center gap-2.5 pt-0.5">
              <Button
                render={<Link href="/notes" />}
                size="lg"
                className="h-9 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground"
              >
                Browse notes
                <ArrowRight aria-hidden="true" className="ml-1.5 size-3.5" />
              </Button>
              <Button
                render={<Link href="/contact" />}
                variant="outline"
                size="lg"
                className="h-9 rounded-full px-5 text-xs font-semibold"
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
    <Accordion defaultValue={["faq-0"]} className="rounded-xl border bg-card">
      {FAQS.map(([q, a], i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-b-0 px-4">
          <AccordionTrigger className="text-xs font-medium py-2.5">
            {q}
          </AccordionTrigger>
          <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-2.5">
            {a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
