"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Download, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
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
  { num: "01", title: "Browse", desc: "Explore our curated catalogue by topic." },
  { num: "02", title: "Preview", desc: "Review any note with a free sample PDF." },
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
        <SectionHead eyebrow="Browse by topic" title="Find the right notes" />
        <CategoryStrip categories={home.data?.categories} isLoading={home.isPending} />
      </HomeSection>

      <div className="section-divider" />

      <HomeSection>
        <SectionHead eyebrow="Editor's picks" title="Featured notes" action={<SeeAll href="/notes" />} />
        <NoteGrid items={home.data?.featuredNotes ?? []} isLoading={home.isPending} emptyTitle="Featured notes coming soon" emptyDesc="Our editor picks are being prepared." />
      </HomeSection>

      <HomeSection className="bg-muted/20">
        <SectionHead eyebrow="Start free" title="Zero cost, full value" action={<SeeAll href="/notes?pricing=free" />} />
        <NoteGrid items={home.data?.freeNotes ?? []} isLoading={home.isPending} emptyTitle="Free notes coming soon" emptyDesc="Check back for resources you can download immediately." />
      </HomeSection>

      <div className="section-divider" />

      <HomeSection>
        <SectionHead eyebrow="Value bundles" title="Save with complete packs" action={<SeeAll href="/groups" />} />
        <GroupGrid groups={home.data?.featuredGroups ?? []} isLoading={home.isPending} />
      </HomeSection>

      <div className="section-divider" />

      <HomeSection>
        <SectionHead eyebrow="How it works" title="Four simple steps" center />
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
    <section className="relative overflow-hidden pt-12 pb-10 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--brand-green-soft),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--brand-orange-soft),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase backdrop-blur-md shadow-sm">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Developer notes that scale
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl font-extrabold tracking-tighter leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
            Learn the stack{" "}
            <span className="brand-gradient-text">with notes</span>
            <br className="hidden sm:block" />{" "}
            <span className="text-foreground">that ship.</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            {BRAND.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              render={<Link href="/notes" />}
              size="lg"
              className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            >
              Browse catalogue
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Button>
            <Button
              render={<Link href="/notes?pricing=free" />}
              variant="outline"
              size="lg"
              className="h-11 rounded-full border-2 px-6 text-sm font-semibold backdrop-blur-sm"
            >
              Free notes
            </Button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => <ShimmerStatCard key={i} />)
            : STATS_CONFIG.map((s) => (
                <div key={s.key} className="rounded-2xl border border-border/50 bg-card/70 px-4 py-3 text-center backdrop-blur-md shadow-sm">
                  <p className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
                    {stats ? formatCompactNumber(stats[s.key]) : "—"}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
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
    <section className={`py-10 md:py-16 ${className ?? ""}`}>
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
    <div className={center ? "mb-6 text-center" : "mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between"}>
      <div className={center ? "mx-auto max-w-md space-y-1" : "max-w-md space-y-1"}>
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
      className="h-8 rounded-full text-xs font-medium shadow-sm"
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
    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
      {isLoading ? (
        Array.from({ length: 5 }, (_, i) => (
          <ShimmerLoader key={i} className="min-w-40 h-12 rounded-xl shrink-0" />
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }, (_, i) => <ShimmerNoteCard key={i} />)
        : items.length
          ? items.slice(0, 4).map((n) => <NoteCard key={n.id} note={n} variant="featured" />)
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }, (_, i) => <ShimmerNoteCard key={i} />)
        : groups.length
          ? groups.slice(0, 3).map((g) => <GroupCard key={g.id} group={g} variant="featured" />)
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map(({ num, title, desc }, index) => (
        <div key={num} className="group relative rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">
          <span className="mb-3 block font-heading text-3xl font-black tracking-tighter text-primary/12 group-hover:text-primary/20 transition-colors">
            {num}
          </span>
          <h3 className="mb-1.5 text-sm font-bold">{title}</h3>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
          {index < STEPS.length - 1 && (
            <ArrowRight aria-hidden="true" className="absolute -right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 hidden lg:block" />
          )}
        </div>
      ))}
    </div>
  );
}

function TrustBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      {TRUST_ITEMS.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2.5">
          <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
          <span className="text-xs font-semibold text-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function CTABanner() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-accent/8 px-6 py-12 text-center md:px-12 md:py-16 shadow-xl">
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-lg space-y-4">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Ready?</p>
            <h2 className="font-heading text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
              Start learning smarter today.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Join thousands of developers who accelerated their growth with curated notes.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                render={<Link href="/notes" />}
                size="lg"
                className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg"
              >
                Browse notes
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Button>
              <Button
                render={<Link href="/contact" />}
                variant="outline"
                size="lg"
                className="h-11 rounded-full px-6 text-sm font-semibold backdrop-blur-sm"
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
    <Accordion defaultValue={["faq-0"]} className="rounded-2xl border border-border bg-card shadow-sm">
      {FAQS.map(([q, a], i) => (
        <AccordionItem key={q} value={`faq-${i}`} className="border-b-0">
          <AccordionTrigger className="text-sm font-semibold py-4 px-6 hover:no-underline">
            {q}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed px-6 pb-4">
            {a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
