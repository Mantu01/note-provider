"use client";

import Link from "next/link";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRazorpay } from "react-razorpay";
import { ArrowLeft, FileText, Loader2, ShieldCheck, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorState } from "@/components/shared/error-state";
import { CheckoutSkeleton } from "@/components/shared/shimmer-loader";
import { PriceTag } from "@/components/shared/price-tag";
import { useGroup } from "@/hooks/useGroups";
import { useNote } from "@/hooks/useNotes";
import { useCreateOrder } from "@/hooks/useCheckout";
import { BRAND } from "@/lib/constants";
import { checkoutSchema, type CheckoutValues } from "@/schemas/checkout.schema";
import type { PurchaseItemType } from "@/lib/types";

function FreeNoteGuard({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-success/10 border border-success/20">
          <PackageCheck aria-hidden="true" className="size-8 text-success" />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">Completely free</p>
          <h1 className="mt-2 text-xl font-bold tracking-tight">This note is free to download</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No payment needed — head back to the note page to get it instantly.
          </p>
        </div>
        <Button render={<Link href={`/notes/${slug}`} />} size="lg" className="rounded-full">
          Go to note
          <ArrowLeft aria-hidden="true" className="ml-2 size-4 rotate-180" />
        </Button>
      </div>
    </div>
  );
}

function OrderSummaryCard({
  title,
  categoryName,
  price,
  priceLabel,
  compareAtPrice,
  coverImageUrl,
}: {
  title: string;
  categoryName: string;
  price: number;
  priceLabel: string;
  compareAtPrice: number | null;
  coverImageUrl?: string | null;
}) {
  return (
    <aside className="order-first lg:order-last">
      <div className="rounded-xl border border-border bg-card shadow-lg lg:sticky lg:top-20">
        <div className="relative hidden aspect-[16/9] overflow-hidden rounded-t-xl bg-muted/20 sm:block">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={title}
              loading="eager"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/5 to-transparent text-primary/30">
              <FileText aria-hidden="true" className="size-10" />
              <span className="text-xs font-medium uppercase tracking-widest">PDF document</span>
            </div>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-center gap-3">
            {coverImageUrl && (
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted/20 sm:hidden">
                <Image src={coverImageUrl} alt="" fill sizes="48px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Order summary
              </p>
              <h2 className="mt-1 line-clamp-1 text-sm font-bold leading-snug">{title}</h2>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{categoryName}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <PriceTag
              price={price}
              priceLabel={priceLabel}
              compareAtPrice={compareAtPrice}
              size="large"
            />
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-success" />
            Instant download after payment.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function CheckoutPage({
  slug,
  itemType,
}: {
  slug: string;
  itemType: PurchaseItemType;
}) {
  const note = useNote(slug, { enabled: itemType === "note" });
  const group = useGroup(slug, { enabled: itemType === "group" });
  const itemQuery = itemType === "group" ? group : note;
  const item = itemType === "group" ? group.data?.group : note.data?.note;

  const router = useRouter();
  const { Razorpay, isLoading } = useRazorpay();
  const createOrder = useCreateOrder();

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      consentAccepted: false,
    },
  });

  const submit = (values: CheckoutValues) => {
    createOrder.mutate(
      {
        itemType,
        itemSlug: slug,
        fullName: values.fullName,
        consentAccepted: true,
      },
      {
        onSuccess: (order) => {
          const themeColor = getComputedStyle(document.documentElement)
            .getPropertyValue("--primary")
            .trim();

          const checkout = new Razorpay({
            key: order.razorpayKeyId,
            amount: order.amount,
            currency: "INR",
            name: BRAND.name,
            description: order.itemTitle,
            order_id: order.razorpayOrderId,
            prefill: { name: order.buyer.fullName },
            notes: JSON.stringify({ orderNumber: order.orderNumber }),
            theme: { color: themeColor },
            handler: () => {
              router.push(`/order/success/${order.orderId}`);
            },
            modal: {
              ondismiss: () => {
                router.push(`/order/success/${order.orderId}`);
              },
            },
          });
          checkout.open();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to initiate payment");
        },
      },
    );
  };

  const submitting = createOrder.isPending || isLoading;

  if (itemQuery.isPending) return <CheckoutSkeleton />;

  if (itemQuery.isError || !item) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <ErrorState
          message="This item is unavailable for checkout."
          onRetry={() => itemQuery.refetch()}
        />
      </div>
    );
  }

  if (itemType === "note" && "pricingType" in item && item.pricingType === "free") {
    return <FreeNoteGuard slug={slug} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={itemType === "group" ? `/groups/${slug}` : `/notes/${slug}`}
        className="mb-5 inline-flex min-h-9 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to {itemType === "group" ? "bundle" : "note"}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <div className="rounded-2xl border border-border bg-muted/30 p-5">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-accent">
              Secure checkout
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">
              Complete your purchase
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your details below. Your notes will be available instantly after payment.
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                aria-invalid={Boolean(form.formState.errors.fullName)}
                {...form.register("fullName")}
                className="h-11 rounded-xl sm:h-10"
              />
              {form.formState.errors.fullName?.message && (
                <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            <Controller
              name="consentAccepted"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                  <Label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary underline">
                      Terms of Service
                    </Link>
                    ,{" "}
                    <Link href="/refund-policy" className="text-primary underline">
                      Refund Policy
                    </Link>
                    , and{" "}
                    <Link href="/privacy" className="text-primary underline">
                      Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>
              )}
            />
            {form.formState.errors.consentAccepted?.message && (
              <p className="text-xs text-destructive">{form.formState.errors.consentAccepted.message}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-xl text-sm font-semibold bg-accent text-accent-foreground shadow-lg"
              disabled={submitting || !form.formState.isValid}
            >
              {submitting ? (
                <><Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />Processing payment…</>
              ) : (
                <>Pay {item.priceLabel} with Razorpay</>
              )}
            </Button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="size-3 text-success" />
            Payments are securely processed by Razorpay. We never store your payment details.
          </p>
        </form>

        <OrderSummaryCard
          title={"name" in item ? item.name : item.title}
          categoryName={item.category.name}
          price={item.price}
          priceLabel={item.priceLabel}
          compareAtPrice={item.compareAtPrice}
          coverImageUrl={item.coverImageUrl}
        />
      </div>
    </div>
  );
}
