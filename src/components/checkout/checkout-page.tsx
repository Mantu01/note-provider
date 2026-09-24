"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRazorpay } from "react-razorpay";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileText,
  Gift,
  Lock,
  Loader2,
  ShieldCheck,
  Truck,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

function BenefitItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-emerald-soft text-brand-emerald">
        <Icon aria-hidden="true" className="size-3.5" />
      </div>
      <span className="text-xs text-muted-foreground">{text}</span>
    </div>
  );
}

function OrderSummaryDesktop({
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
    <aside>
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden lg:sticky lg:top-24">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 300px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-primary/30">
              <FileText aria-hidden="true" className="size-12" />
              <span className="text-xs font-semibold uppercase tracking-widest">PDF Document</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-start gap-3">
            {coverImageUrl && (
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/20">
                <Image src={coverImageUrl} alt={title} fill sizes="56px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Your order
              </p>
              <h2 className="mt-0.5 line-clamp-1 text-base font-bold leading-snug">{title}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{categoryName}</p>
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-border/60 bg-muted/20 p-3">
            <PriceTag price={price} priceLabel={priceLabel} compareAtPrice={compareAtPrice} size="large" />
          </div>

          <div className="space-y-2.5">
            <BenefitItem icon={Truck} text="Instant digital delivery" />
            <BenefitItem icon={Gift} text="Single-use download link" />
            <BenefitItem icon={ShieldCheck} text="Secure payment by Razorpay" />
            <BenefitItem icon={CreditCard} text="Refund if not satisfied" />
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock aria-hidden="true" className="size-3 text-success" />
            <span>256-bit SSL encrypted transaction</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileOrderSummary({
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
    <div className="mb-4 rounded-xl border border-border bg-card p-3 shadow-sm sm:hidden">
      <div className="flex gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted/20">
          {coverImageUrl ? (
            <Image src={coverImageUrl} alt={title} fill sizes="56px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary/20">
              <FileText aria-hidden="true" className="size-6" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Your order
          </p>
          <h2 className="mt-0.5 line-clamp-1 text-sm font-bold leading-snug">{title}</h2>
          <p className="truncate text-xs text-muted-foreground">{categoryName}</p>
          <div className="mt-1">
            <PriceTag price={price} priceLabel={priceLabel} compareAtPrice={compareAtPrice} size="default" />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end justify-between py-0.5">
          <p className="text-[9px] text-muted-foreground">Total</p>
          <p className="text-base font-bold leading-none">{priceLabel}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <CheckCircle2 aria-hidden="true" className="size-3 text-success" />
          <span>Instant delivery</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock aria-hidden="true" className="size-3 text-success" />
          <span>Secure payment</span>
        </div>
      </div>
    </div>
  );
}

function MobileBottomBar({
  title,
  priceLabel,
  submitting,
  onPay,
  isValid,
}: {
  title: string;
  priceLabel: string;
  submitting: boolean;
  onPay: () => void;
  isValid: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md sm:hidden">
      <div className="mx-auto max-w-lg">
        <div className="mb-2 flex items-center justify-between">
          <p className="truncate text-xs text-muted-foreground">{title}</p>
          <p className="text-sm font-bold">{priceLabel}</p>
        </div>
        <Button
          type="button"
          onClick={onPay}
          disabled={submitting || !isValid}
          className="h-12 w-full rounded-xl text-sm font-semibold bg-accent text-accent-foreground shadow-md transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>Pay {priceLabel} with Razorpay</>
          )}
        </Button>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="size-3 text-success" />
          <span>Secure payment · Instant delivery</span>
        </div>
      </div>
    </div>
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (itemQuery.isPending || !mounted) return <CheckoutSkeleton />;

  if (itemQuery.isError || !item) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <ErrorState message="This item is unavailable for checkout." onRetry={() => itemQuery.refetch()} />
      </div>
    );
  }

  if (itemType === "note" && "pricingType" in item && item.pricingType === "free") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-success/20 bg-success/10">
            <CheckCircle2 aria-hidden="true" className="size-8 text-success" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">Completely free</p>
            <h1 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">This note is free</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              No payment needed — head back to the note page to download it instantly.
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

  const itemTitle = "name" in item ? item.name : item.title;
  const itemPriceLabel = item.priceLabel;
  const itemCoverImageUrl = item.coverImageUrl;

  return (
    <div className={cn(
      "mx-auto max-w-5xl px-4 pt-4 pb-32 sm:px-6 sm:pt-6 sm:pb-40 lg:pb-16",
      "min-h-screen"
    )}>
      <Link
        href={itemType === "group" ? `/groups/${slug}` : `/notes/${slug}`}
        className="mb-4 inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to {itemType === "group" ? "bundle" : "note"}
      </Link>

      <MobileOrderSummary
        title={itemTitle}
        categoryName={item.category.name}
        price={item.price}
        priceLabel={itemPriceLabel}
        compareAtPrice={item.compareAtPrice}
        coverImageUrl={itemCoverImageUrl}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.15em] text-accent">
              Secure checkout
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full name
              </Label>
              <Input
                id="fullName"
                autoComplete="name"
                placeholder="Enter your full name…"
                aria-invalid={Boolean(form.formState.errors.fullName)}
                aria-describedby={form.formState.errors.fullName?.message ? "fullName-error" : undefined}
                {...form.register("fullName")}
                className="h-11 rounded-xl text-sm"
              />
              {form.formState.errors.fullName?.message && (
                <p id="fullName-error" className="text-xs text-destructive">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-1.5">
              <Controller
                name="consentAccepted"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="consent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 size-4"
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
            </div>

            <Button
              type="submit"
              className="mt-4 h-12 w-full rounded-xl text-sm font-semibold bg-accent text-accent-foreground shadow-md transition-colors hover:bg-accent/90 disabled:opacity-50"
              disabled={submitting || !form.formState.isValid}
            >
              {submitting ? (
                <>
                  <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />
                  Processing payment…
                </>
              ) : (
                <>Pay {itemPriceLabel} with Razorpay</>
              )}
            </Button>
          </div>

          <p className="hidden text-center text-[10px] text-muted-foreground sm:flex items-center justify-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="size-3 text-success" />
            Payments are securely processed by Razorpay. We never store your payment details.
          </p>
        </form>

        <OrderSummaryDesktop
          title={itemTitle}
          categoryName={item.category.name}
          price={item.price}
          priceLabel={itemPriceLabel}
          compareAtPrice={item.compareAtPrice}
          coverImageUrl={itemCoverImageUrl}
        />
      </div>

      <MobileBottomBar
        title={itemTitle}
        priceLabel={itemPriceLabel}
        submitting={submitting}
        isValid={form.formState.isValid}
        onPay={() => form.handleSubmit(submit)()}
      />
    </div>
  );
}
