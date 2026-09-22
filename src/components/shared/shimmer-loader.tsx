import { cn } from "@/lib/utils";

export function ShimmerLoader({ className }: { className?: string }) {
  return <div className={cn("shimmer-premium", className)} aria-hidden="true" />;
}

export function ShimmerNoteCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card max-sm:flex-row">
      <ShimmerLoader className="aspect-[16/9] w-full shrink-0 rounded-none max-sm:aspect-auto max-sm:w-24" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <ShimmerLoader className="h-4 w-14 rounded-full" />
          <ShimmerLoader className="h-4 w-10 shrink-0 rounded-full" />
        </div>
        <ShimmerLoader className="h-4 w-4/5" />
        <ShimmerLoader className="h-3 w-full max-sm:hidden" />
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <ShimmerLoader className="h-4 w-16 rounded-md" />
          <ShimmerLoader className="h-4 w-12 rounded-md max-sm:hidden" />
        </div>
      </div>
    </div>
  );
}

export function ShimmerGroupCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card max-sm:flex-row">
      <ShimmerLoader className="aspect-[16/9] w-full shrink-0 rounded-none max-sm:aspect-auto max-sm:w-28" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <ShimmerLoader className="h-4 w-16 rounded-full" />
          <ShimmerLoader className="h-4 w-14 shrink-0 rounded-md" />
        </div>
        <ShimmerLoader className="h-4 w-3/4" />
        <ShimmerLoader className="h-3 w-full" />
      </div>
    </div>
  );
}

export function ShimmerStatCard() {
  return (
    <div className="rounded-xl border border-border/50 bg-card px-4 py-3.5 text-center">
      <ShimmerLoader className="mx-auto mb-1.5 h-6 w-16 rounded" />
      <ShimmerLoader className="mx-auto h-2.5 w-12 rounded" />
    </div>
  );
}

export function NoteDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-3 pt-3 pb-24 sm:px-4 sm:pt-6 lg:pb-10">
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="space-y-4 sm:space-y-5">
          <ShimmerLoader className="aspect-[16/9] w-full rounded-xl" />
          <div className="space-y-3">
            <div className="flex gap-2">
              <ShimmerLoader className="h-5 w-24 rounded-full" />
              <ShimmerLoader className="h-5 w-20 rounded-full" />
            </div>
            <ShimmerLoader className="h-8 w-3/4 rounded" />
            <ShimmerLoader className="h-3 w-1/2 rounded" />
            <div className="space-y-2 pt-2">
              <ShimmerLoader className="h-3 w-full rounded" />
              <ShimmerLoader className="h-3 w-full rounded" />
              <ShimmerLoader className="h-3 w-2/3 rounded" />
            </div>
          </div>
        </article>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-lg sm:p-5">
            <ShimmerLoader className="h-5 w-32 rounded" />
            <ShimmerLoader className="mt-2 h-3 w-40 rounded" />
            <ShimmerLoader className="mt-4 h-8 w-24 rounded" />
            <ShimmerLoader className="mt-4 h-10 w-full rounded-xl" />
            <ShimmerLoader className="mt-3 h-12 w-full rounded-xl" />
          </div>
        </aside>
      </div>
    </div>
  );
}

export function GroupDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-3 pt-4 pb-28 sm:px-4 sm:pt-6 lg:px-6 lg:pb-10">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="space-y-4 sm:space-y-5">
          <ShimmerLoader className="aspect-[16/9] w-full rounded-xl" />
          <div className="space-y-2">
            <ShimmerLoader className="h-3 w-28 rounded" />
            <ShimmerLoader className="h-8 w-2/3 rounded" />
            <div className="space-y-2 pt-1">
              <ShimmerLoader className="h-3 w-full rounded" />
              <ShimmerLoader className="h-3 w-3/4 rounded" />
            </div>
          </div>
          <div className="border-t border-border/40 pt-5">
            <ShimmerLoader className="mb-4 h-5 w-40 rounded" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <ShimmerLoader key={index} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </article>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-lg sm:p-5">
            <ShimmerLoader className="h-5 w-32 rounded" />
            <ShimmerLoader className="mt-2 h-3 w-36 rounded" />
            <ShimmerLoader className="mt-4 h-8 w-24 rounded" />
            <ShimmerLoader className="mt-4 h-12 w-full rounded-xl" />
          </div>
        </aside>
      </div>
    </div>
  );
}

export function OrderStatusSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <ShimmerLoader className="size-16 rounded-2xl" />
        <ShimmerLoader className="h-7 w-56 rounded" />
        <ShimmerLoader className="h-8 w-44 rounded-full" />
      </div>
      <ShimmerLoader className="mt-6 h-20 w-full rounded-xl" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="rounded-xl border border-border/50 bg-card p-4">
            <ShimmerLoader className="h-4 w-28 rounded" />
            <div className="mt-3 space-y-2">
              <ShimmerLoader className="h-3 w-full rounded" />
              <ShimmerLoader className="h-3 w-5/6 rounded" />
              <ShimmerLoader className="h-3 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderLookupSkeleton() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <ShimmerLoader className="size-12 rounded-xl" />
        <ShimmerLoader className="h-6 w-48 rounded" />
        <ShimmerLoader className="h-3 w-64 rounded" />
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <ShimmerLoader className="h-4 w-28 rounded" />
        <ShimmerLoader className="mt-3 h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <ShimmerLoader className="h-3 w-32 rounded" />
            <ShimmerLoader className="mt-2 h-8 w-2/3 rounded" />
            <ShimmerLoader className="mt-2 h-3 w-3/4 rounded" />
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <ShimmerLoader className="h-3 w-20 rounded" />
            <ShimmerLoader className="mt-3 h-10 w-full rounded-xl" />
            <ShimmerLoader className="mt-4 h-5 w-40 rounded" />
            <ShimmerLoader className="mt-4 h-12 w-full rounded-xl" />
          </div>
        </div>
        <aside>
          <div className="rounded-xl border border-border bg-card shadow-lg">
            <ShimmerLoader className="aspect-[16/9] rounded-b-none rounded-t-xl" />
            <div className="space-y-3 p-4">
              <ShimmerLoader className="h-4 w-3/4 rounded" />
              <ShimmerLoader className="h-3 w-1/2 rounded" />
              <ShimmerLoader className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <ShimmerLoader className="h-3 w-36 rounded" />
          <ShimmerLoader className="h-8 w-40 rounded" />
        </div>
        <div className="flex gap-3">
          <ShimmerLoader className="h-9 w-32 rounded-full" />
          <ShimmerLoader className="h-9 w-32 rounded-full" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <ShimmerLoader className="h-3 w-24 rounded" />
                <ShimmerLoader className="h-6 w-20 rounded" />
              </div>
              <ShimmerLoader className="size-11 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
      <ShimmerLoader className="h-80 w-full rounded-2xl" />
      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <ShimmerLoader className="h-5 w-32 rounded" />
        <div className="mt-4 space-y-3">
          <ShimmerLoader className="h-10 w-full rounded-lg" />
          <ShimmerLoader className="h-10 w-full rounded-lg" />
          <ShimmerLoader className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function AdminOrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShimmerLoader className="size-8 rounded-lg" />
          <div className="space-y-2">
            <ShimmerLoader className="h-7 w-48 rounded" />
            <ShimmerLoader className="h-3 w-40 rounded" />
          </div>
        </div>
        <ShimmerLoader className="h-9 w-40 rounded-lg" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="rounded-xl bg-card ring-1 ring-foreground/10 p-5">
              <ShimmerLoader className="h-5 w-36 rounded" />
              <ShimmerLoader className="mt-4 h-4 w-2/3 rounded" />
              <ShimmerLoader className="mt-2 h-3 w-1/3 rounded" />
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-5">
            <ShimmerLoader className="h-5 w-40 rounded" />
            <div className="mt-4 space-y-2">
              <ShimmerLoader className="h-3 w-full rounded" />
              <ShimmerLoader className="h-3 w-4/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotesCatalogueSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <ShimmerNoteCard key={index} />
      ))}
    </div>
  );
}

export function GroupsCatalogueSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <ShimmerGroupCard key={index} />
      ))}
    </div>
  );
}

