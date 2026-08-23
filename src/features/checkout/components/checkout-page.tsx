"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRazorpay } from "react-razorpay";
import { ArrowLeft, FileText, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="mx-auto max-w-xl px-4 py-12">
      <Card className="rounded-2xl">
        <CardContent className="space-y-3 text-center">
          <h1 className="text-xl font-bold">This note is free</h1>
          <p className="text-sm text-muted-foreground">
            Free notes are ready for immediate download — no payment needed.
          </p>
          <Button render={<Link href={`/notes/${slug}`} />}>Go to note</Button>
        </CardContent>
      </Card>
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
      <Card className="rounded-2xl lg:sticky lg:top-16">
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold">Order summary</p>
          <div className="relative aspect-video overflow-hidden rounded-xl brand-gradient-soft">
            {coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-primary/40">
                <FileText className="size-8" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{categoryName}</p>
          </div>
          <div className="border-y py-3">
            <PriceTag
              price={price}
              priceLabel={priceLabel}
              compareAtPrice={compareAtPrice}
            />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mr-1 inline size-3.5 shrink-0 text-primary" />
            Instant download after payment.
          </p>
        </CardContent>
      </Card>
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
      <div className="mx-auto max-w-5xl px-4 py-8">
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
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to item
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <div>
            <p className="text-[10px] font-semibold tracking-wide text-primary uppercase">
              Secure checkout
            </p>
            <h1 className="mt-1.5 text-xl font-bold tracking-tight md:text-2xl">
              Complete your purchase
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your details below. Your notes will be available instantly after payment.
            </p>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  aria-invalid={Boolean(form.formState.errors.fullName)}
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName?.message && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <Controller
                name="consentAccepted"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="consent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary underline">
                        Terms
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
                <p className="text-xs text-destructive">
                  {form.formState.errors.consentAccepted.message}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting || !form.formState.isValid}
              >
                {submitting ? (
                  <>
                    <Loader2 aria-hidden="true" className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  `Pay ${item.priceLabel}`
                )}
              </Button>
            </CardContent>
          </Card>
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
