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
import { ShimmerLoader, ShimmerNoteCard, ShimmerGroupCard, ShimmerStatCard } from "@/components/shared/shimmer-loader";
import { useHome } from "@/features/home/api/use-home";
import { BRAND, HOME_TRUST_ITEMS, HOME_FAQS, HOME_STEPS, HOME_STATS_CONFIG } from "@/lib/constants";
import { formatCompactNumber } from "@/lib/format";
import type { PublicNote, PublicGroup, PublicCategory } from "@/lib/types";

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

      <div className="section-fold my-0" />

      <HomeSection>
        <SectionHead eyebrow="Browse by topic" title="Find the right notes" />
        <CategoryStrip categories={home.data?.categories} isLoading={home.isPending} />
      </HomeSection>

      <div className="section-fold my-0" />

      <HomeSection>
        <SectionHead eyebrow="Editor's picks" title="Featured notes" action={<SeeAll href="/notes" />} />
        <NoteGrid items={home.data?.featuredNotes ?? []} isLoading={home.isPending} emptyTitle="Featured notes coming soon" emptyDesc="Our editor picks are being prepared." />
      </HomeSection>

      <HomeSection className="bg-muted/20">
        <SectionHead eyebrow="Start free" title="Zero cost, full value" action={<SeeAll href="/notes?pricing=free" />} />
        <NoteGrid items={home.data?.freeNotes ?? []} isLoading={home.isPending} emptyTitle="Free notes coming soon" emptyDesc="Check back for resources you can download immediately." />
      </HomeSection>

      <div className="section-fold my-0" />

      <HomeSection>
        <SectionHead eyebrow="Value bundles" title="Save with complete packs" action={<SeeAll href="/groups" />} />
        <GroupGrid groups={home.data?.featuredGroups ?? []} isLoading={home.isPending} />
      </HomeSection>

      <div className="section-fold my-0" />

      <HomeSection>
        <SectionHead eyebrow="How it works" title="Four simple steps" center />
        <StepsRow />
      </HomeSection>

      <HomeSection className="bg-muted/20">
        <TrustBar />
      </HomeSection>

      <div className="section-fold my-0" />

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
    <section className="relative overflow-hidden pt-16 pb-14 md:pt-28 md:pb-24 lg:pt-36 lg:pb-32 paper-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--brand-green-soft),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--brand-orange-soft),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 page-dot-pattern opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase backdrop-blur-md shadow-sm animate-fade-in-up">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Developer notes that scale
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tighter leading-[1.05] text-foreground md:text-5xl lg:text-6xl animate-fade-in-up stagger-1">
            Learn the stack{" "}
            <span className="brand-gradient-text">with notes</span>
            <br className="hidden sm:block" />{" "}
            <span className="text-foreground">that ship.</span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-muted-foreground animate-fade-in-up stagger-2">
            {BRAND.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-1 animate-fade-in-up stagger-3">
            <Button
              render={<Link href="/notes" />}
              size="lg"
              className="h-12 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            >
              Browse catalogue
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Button>
            <Button
              render={<Link href="/notes?pricing=free" />}
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-2 px-7 text-sm font-semibold backdrop-blur-sm hover:bg-primary/5 transition-colors"
            >
              Free notes
            </Button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:mt-18 md:grid-cols-4 animate-fade-in-up stagger-4">
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => <ShimmerStatCard key={i} />)
            : HOME_STATS_CONFIG.map((s, i) => (
                <div
                  key={s.key}
                  className="rounded-2xl border border-border/50 bg-card/80 px-4 py-3.5 text-center backdrop-blur-md shadow-sm animate-fade-in-up paper-card"
                  style={{ animationDelay: `${0.3 + i * 0.05}s` }}
                >
                  <p className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
                    {stats ? formatCompactNumber(stats[s.key]) : "—"}
                  </p>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
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
    <section className={`py-14 md:py-24 ${className ?? ""}`}>
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
    <div className={center ? "mb-10 text-center" : "mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between"}>
      <div className={center ? "mx-auto max-w-md space-y-1.5" : "max-w-md space-y-1.5"}>
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
      className="h-8 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
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
    <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar">
      {isLoading ? (
        Array.from({ length: 5 }, (_, i) => (
          <ShimmerLoader key={i} className="min-w-40 h-14 rounded-xl shrink-0" />
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
        ? Array.from({ length: 3 }, (_, i) => <ShimmerGroupCard key={i} />)
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
    <div className="relative">
      <div className="absolute top-8 left-0 right-0 hidden border-t-2 border-dashed border-border/60 lg:block" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {HOME_STEPS.map(({ num, title, desc, Icon }, index) => (
          <div key={num} className="relative flex flex-col items-center text-center">
            <div className="relative z-10 mb-4 flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm torn-paper paper-card transition-shadow hover:shadow-md">
              <Icon aria-hidden="true" className="size-6 text-primary" />
            </div>

            <span className="mb-1 inline-flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {num}
            </span>

            <h3 className="mt-1.5 text-sm font-bold tracking-tight">{title}</h3>
            <p className="mt-1 max-w-[200px] text-[11px] leading-relaxed text-muted-foreground">{desc}</p>

            {index < HOME_STEPS.length - 1 && (
              <ArrowRight aria-hidden="true" className="absolute right-0 top-8 hidden size-4 -translate-y-1/2 translate-x-1/2 rotate-0 text-muted-foreground/40 lg:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
      {HOME_TRUST_ITEMS.map(({ icon: Icon, label }) => (
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
    <section className="py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-linear-to-br from-primary/8 via-card to-accent/6 px-6 py-16 text-center md:px-16 md:py-24 shadow-xl torn-paper paper-card">
          <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-primary/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-accent/8 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-lg space-y-6">
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
                className="h-12 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
              >
                Browse notes
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Button>
              <Button
                render={<Link href="/contact" />}
                variant="outline"
                size="lg"
                className="h-12 rounded-full px-7 text-sm font-semibold backdrop-blur-sm hover:bg-primary/5 transition-colors"
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
    <Accordion defaultValue={["faq-0"]} className="rounded-2xl border border-border bg-card shadow-sm torn-paper paper-card">
      {HOME_FAQS.map(([q, a], i) => (
        <AccordionItem key={q} value={`faq-${i}`} className="border-b-0">
          <AccordionTrigger className="text-sm font-semibold py-4 px-6">
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
