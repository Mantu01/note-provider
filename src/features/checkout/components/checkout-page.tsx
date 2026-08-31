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
import { PriceTag } from "@/components/shared/price-tag";
import { useGroup } from "@/features/groups/api/use-group";
import { useNote } from "@/features/notes/api/use-note";
import { useCreateOrder } from "@/features/checkout/api/use-create-order";
import { BRAND } from "@/lib/constants";
import { checkoutSchema, type CheckoutValues } from "@/lib/schemas/checkout.schema";
import type { PurchaseItemType } from "@/lib/types";

function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="h-80 shimmer-premium rounded-2xl" />
    </div>
  );
}

function FreeNoteGuard({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <div className="text-center space-y-4">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-success/10">
          <PackageCheck aria-hidden="true" className="size-8 text-success" />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Completely free</p>
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
      <div className="rounded-2xl border border-border bg-card shadow-lg lg:sticky lg:top-20">
        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl bg-muted/20">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <FileText className="size-10" />
              <span className="text-xs font-medium uppercase tracking-widest">PDF Document</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Order summary</p>
            <h2 className="mt-1 text-sm font-bold leading-snug line-clamp-1">{title}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{categoryName}</p>
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
            <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
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
            .getPropertyValue("--brand-green")
            .trim();

          const checkout = new Razorpay({
            key: order.razorpayKeyId,
            amount: order.amount,
            currency: "INR",
            name: BRAND.name,
            description: order.itemTitle,
            order_id: order.razorpayOrderId,
            prefill: { name: order.buyer.fullName },
            notes: order.orderNumber,
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
      {/* Back link */}
      <Link
        href={itemType === "group" ? `/groups/${slug}` : `/notes/${slug}`}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-6"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to {itemType === "group" ? "bundle" : "note"}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Form */}
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary">
              Secure checkout
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">
              Complete your purchase
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your details below. Your notes will be available instantly after payment.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            {/* Full name field */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                aria-invalid={Boolean(form.formState.errors.fullName)}
                {...form.register("fullName")}
                className="h-10 rounded-xl"
              />
              {form.formState.errors.fullName?.message && (
                <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            {/* Consent checkbox */}
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
                    </Link>{" "}
                    and{" "}
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

            {/* Pay button */}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl font-semibold shadow-lg"
              disabled={submitting || !form.formState.isValid}
            >
              {submitting ? (
                <><Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />Processing payment…</>
              ) : (
                <>Pay {item.priceLabel} with Razorpay</>
              )}
            </Button>
          </div>

          {/* Security notice */}
          <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="size-3 text-primary" />
            Payments are securely processed by Razorpay. We never store your payment details.
          </p>
        </form>

        {/* Order summary */}
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
