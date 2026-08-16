"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CreditCard,
  Download,
  Headphones,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryCard } from "@/components/shared/category-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { GroupCard } from "@/components/shared/group-card";
import { NoteCard } from "@/components/shared/note-card";
import { NoteCardSkeleton } from "@/components/shared/note-card-skeleton";
import { Section } from "@/components/layout/section";
import { BRAND } from "@/lib/constants";
import { formatCompactNumber } from "@/lib/format";
import { useHome } from "@/features/home/api/use-home";

const FAQS = [
  [
    "When will I receive paid notes?",
    "Paid notes are delivered to your selected Instagram, WhatsApp, or email handle within 4–6 hours of a successful payment.",
  ],
  [
    "How do free notes work?",
    "Free notes are available for immediate PDF download. No sign-up is required.",
  ],
  [
    "Which topics do you cover?",
    "We focus on web development, frontend, backend, DSA, DBMS, system design, and interview-prep topics.",
  ],
  [
    "Which payment methods can I use?",
    "Payments are securely processed by Razorpay and support its available Indian payment methods.",
  ],
  [
    "Can I get a refund?",
    "Digital notes are non-refundable after delivery. Please review the preview and description before paying.",
  ],
  [
    "Will you send promotional messages?",
    "No. Your delivery handle is used only to fulfil your purchase and provide support.",
  ],
];

const HERO_STATS = [
  { label: "Notes", key: "totalNotes" },
  { label: "Categories", key: "totalCategories" },
  { label: "Downloads", key: "totalDownloads" },
  { label: "Happy learners", key: "happyLearners" },
] as const;

const HOW_IT_WORKS = [
  {
    icon: BookOpen,
    title: "Choose your topic",
    description:
      "Browse structured resources for frontend, backend, DSA, DBMS, and system design.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    description:
      "Share one delivery handle and complete payment through Razorpay.",
  },
  {
    icon: Send,
    title: "Receive on your handle",
    description:
      "We deliver paid notes within 4–6 hours. Free notes download instantly.",
  },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Secure Razorpay payments" },
  { icon: Download, label: "Instant free downloads" },
  { icon: BadgeCheck, label: "Curated original notes" },
  { icon: Headphones, label: "Human support" },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
        <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function HeroSection({
  stats,
}: {
  stats?: {
    totalNotes: number;
    totalCategories: number;
    totalDownloads: number;
    happyLearners: number;
  };
}) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-orange-500/20 to-transparent blur-3xl z-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-500/20 via-rose-500/20 to-transparent blur-3xl z-0" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md">
            <Sparkles aria-hidden="true" className="size-4 text-primary" />
            <span className="font-bold text-primary">Developer notes that scale</span>
          </div>
          <h1 className="font-heading text-5xl font-extrabold tracking-tighter md:text-7xl lg:text-8xl">
            Learn the stack with{" "}
            <span className="brand-gradient-text">
              notes that ship.
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl font-medium">
            {BRAND.description}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row pt-4">
            <Button render={<Link href="/notes" />} size="lg" className="h-14 rounded-2xl bg-primary px-8 text-base text-primary-foreground">
              Browse the catalogue
              <ArrowRight aria-hidden="true" className="ml-2" />
            </Button>
            <Button
              render={<Link href="/notes?pricing=free" />}
              variant="outline"
              size="lg"
              className="h-14 rounded-2xl border-2 px-8 text-base"
            >
              Explore free notes
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:mt-24 md:grid-cols-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          {HERO_STATS.map((stat) => (
            <Card
              key={stat.label}
              className="rounded-3xl border border-border/80 bg-card/80 py-2 shadow-sm"
            >
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-2">
                  {stats?.[stat.key] === undefined
                    ? "—"
                    : formatCompactNumber(stats[stat.key])}
                </p>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryStrip({
  categories,
  isLoading,
}: {
  categories?: { id: string; name: string; slug: string; noteCount: number; description: string | null; icon: string | null; subjects: { id: string; name: string; slug: string; order: number; isActive: boolean }[] }[];
  isLoading: boolean;
}) {
  return (
    <Section className="pt-6">
      <SectionHeading
        eyebrow="Explore"
        title="Find your stack"
        description="Focused resources for frontend, backend, DSA, DBMS, and system design."
      />
      <div className="flex gap-4 overflow-x-auto pb-3">
        {categories?.length ? (
          categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))
        ) : isLoading ? (
          Array.from({ length: 5 }, (_, index) => (
            <Card key={index} className="min-w-48 rounded-2xl">
              <CardContent className="h-20" />
            </Card>
          ))
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Categories are coming soon"
            description="The catalogue is being prepared. Check back shortly for focused study resources."
          />
        )}
      </div>
    </Section>
  );
}

function FeaturedNotesSection({
  notes,
  isLoading,
}: {
  notes?: { id: string; slug: string; [key: string]: unknown }[];
  isLoading: boolean;
}) {
  return (
    <Section>
      <SectionHeading
        eyebrow="Featured"
        title="Notes worth keeping"
        action={
          <Button render={<Link href="/notes" />} variant="outline">
            View all
            <ArrowRight aria-hidden="true" />
          </Button>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }, (_, index) => (
            <NoteCardSkeleton key={index} />
          ))
        ) : notes?.length ? (
          notes
            .slice(0, 3)
            .map((note) => (
              <NoteCard
                key={note.id}
                note={note as never}
                variant="featured"
              />
            ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState
              icon={BookOpen}
              title="Featured notes will appear here"
              description="Our hand-picked study resources are on their way."
            />
          </div>
        )}
      </div>
    </Section>
  );
}

function FreeNotesSection({
  notes,
}: {
  notes?: { id: string; slug: string; [key: string]: unknown }[];
}) {
  return (
    <Section className="bg-brand-green-soft/30">
      <SectionHeading
        eyebrow="Start free"
        title="Build momentum with free developer notes"
        description="Download selected resources instantly, no account required."
        action={
          <Button render={<Link href="/notes?pricing=free" />} variant="outline">
            See free notes
            <ArrowRight aria-hidden="true" />
          </Button>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {notes?.length ? (
          notes
            .slice(0, 3)
            .map((note) => (
              <NoteCard key={note.id} note={note as never} />
            ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState
              icon={Download}
              title="Free resources are on their way"
              description="Check back soon for notes you can download immediately."
            />
          </div>
        )}
      </div>
    </Section>
  );
}

function BundlesSection({
  groups,
}: {
  groups?: { id: string; slug: string; [key: string]: unknown }[];
}) {
  return (
    <Section>
      <SectionHeading
        eyebrow="Save with bundles"
        title="One topic, one complete pack"
        action={
          <Button render={<Link href="/groups" />} variant="outline">
            View bundles
            <ArrowRight aria-hidden="true" />
          </Button>
        }
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {groups?.length ? (
          groups
            .slice(0, 3)
            .map((group) => (
              <GroupCard key={group.id} group={group as never} />
            ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState
              icon={BookOpen}
              title="Bundles will appear here"
              description="We are putting together focused collections to simplify your revision."
            />
          </div>
        )}
      </div>
    </Section>
  );
}

function HowItWorksSection() {
  return (
    <Section className="bg-muted/50">
      <SectionHeading eyebrow="Simple by design" title="From topic discovery to delivery" />
      <div className="grid gap-5 md:grid-cols-3">
        {HOW_IT_WORKS.map(({ icon: Icon, title, description }, index) => (
          <Card key={title} className="rounded-2xl border">
            <CardContent className="space-y-4">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                {index + 1}
              </span>
              <Icon aria-hidden="true" className="size-6 text-primary" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function TrustSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why learners trust us"
        title="Prepared with care, delivered securely"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map(({ icon: Icon, label }) => (
          <Card key={label} className="rounded-2xl">
            <CardContent className="flex items-center gap-3">
              <Icon aria-hidden="true" className="size-5 text-primary" />
              <span className="font-medium">{label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function FaqSection() {
  return (
    <Section className="bg-muted/50">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
        <Accordion
          className="rounded-2xl border bg-card px-5"
          defaultValue={["faq-0"]}
        >
          {FAQS.map(([question, answer], index) => (
            <AccordionItem key={question} value={`faq-${index}`}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

function CtaBanner() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-[3rem] border border-border/80 bg-gradient-to-br from-primary/16 via-card to-accent/10 p-10 text-foreground shadow-sm md:p-16 lg:p-24">
        <div className="absolute inset-0 bg-gradient-to-t from-background/75 to-transparent" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center space-y-8">
          <p className="text-sm font-bold tracking-widest uppercase text-primary">
            Ready when you are
          </p>
          <h2 className="font-heading text-4xl font-black tracking-tight md:text-5xl lg:text-6xl drop-shadow-md">
            Find the notes that make building feel easier.
          </h2>
          <div className="pt-4 flex justify-center">
            <Button render={<Link href="/notes" />} size="lg" className="h-14 rounded-full bg-primary px-10 text-lg font-bold text-primary-foreground">
              Browse the catalogue
              <ArrowRight aria-hidden="true" className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function HomePage() {
  const home = useHome();

  if (home.isError) {
    return (
      <Section>
        <ErrorState
          message="We could not load the latest catalogue."
          onRetry={() => home.refetch()}
        />
      </Section>
    );
  }

  const data = home.data;

  return (
    <>
      <HeroSection stats={data?.stats} />
      <CategoryStrip
        categories={data?.categories}
        isLoading={home.isPending}
      />
      <FeaturedNotesSection
        notes={data?.featuredNotes}
        isLoading={home.isPending}
      />
      <FreeNotesSection notes={data?.freeNotes} />
      <BundlesSection groups={data?.featuredGroups} />
      <HowItWorksSection />
      <TrustSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
