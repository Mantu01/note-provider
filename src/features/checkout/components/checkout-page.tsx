"use client";

import Image from "next/image";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorState } from "@/components/shared/error-state";
import { PriceTag } from "@/components/shared/price-tag";
import { useGroup } from "@/features/groups/api/use-group";
import { useNote } from "@/features/notes/api/use-note";
import { useCreateOrder } from "@/features/checkout/api/use-create-order";
import { BRAND } from "@/lib/constants";
import { checkoutSchema, type CheckoutValues } from "@/lib/schemas/checkout.schema";
import type { PurchaseItemType } from "@/lib/types";

const PLATFORM_HINTS = {
  instagram: { prefix: "@", placeholder: "yourusername", type: "text" as const },
  whatsapp: { prefix: "+91", placeholder: "10-digit number", type: "tel" as const },
  email: { prefix: "", placeholder: "you@example.com", type: "email" as const },
} as const;

function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="h-96 animate-pulse rounded-3xl bg-muted" />
    </div>
  );
}

function FreeNoteGuard({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card className="rounded-3xl">
        <CardContent className="space-y-4 text-center">
          <h1 className="text-2xl font-bold">This note is free</h1>
          <p className="text-muted-foreground">
            Free notes are ready for immediate download and do not need checkout.
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
      <Card className="rounded-3xl lg:sticky lg:top-24">
        <CardContent className="space-y-5">
          <p className="text-sm font-semibold">Order summary</p>
          <div className="relative aspect-video overflow-hidden rounded-2xl brand-gradient-soft">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-primary/60">
                <FileText className="size-10" />
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{categoryName}</p>
          </div>
          <div className="border-y py-4">
            <PriceTag
              price={price}
              priceLabel={priceLabel}
              compareAtPrice={compareAtPrice}
            />
          </div>
          <p className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
            />
            Delivered within 4–6 hours after successful payment.
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
      socialPlatform: "instagram",
      socialHandle: "",
      consentAccepted: false,
    },
  });

  const platform = useWatch({ control: form.control, name: "socialPlatform" });
  const hints = PLATFORM_HINTS[platform];

  const submit = (values: CheckoutValues) => {
    createOrder.mutate(
      {
        itemType,
        itemSlug: slug,
        ...values,
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
            prefill: order.buyer,
            notes: order.orderNumber,
            theme: { color: themeColor },
            handler: () => {
              toast.success("Payment successful!");
              router.push(`/order/${order.orderId}`);
            },
            modal: {
              ondismiss: () => {
                router.push(`/order/${order.orderId}`);
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

  const submitting = createOrder.isPending || isLoading;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href={itemType === "group" ? `/groups/${slug}` : `/notes/${slug}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to item
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Secure checkout
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Where should we deliver your notes?
            </h1>
            <p className="mt-2 text-muted-foreground">
              We only use these details to fulfil your order.
            </p>
          </div>

          <Card className="rounded-3xl">
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  aria-invalid={Boolean(form.formState.errors.fullName)}
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName?.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <Controller
                name="socialPlatform"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Delivery channel</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="socialHandle">
                  {platform === "email"
                    ? "Email address"
                    : `${platform === "instagram" ? "Instagram" : "WhatsApp"} handle`}
                </Label>
                <div className="flex rounded-lg border border-input focus-within:ring-2 focus-within:ring-ring">
                  <span className="flex items-center border-r px-3 text-sm text-muted-foreground">
                    {hints.prefix || "@"}
                  </span>
                  <Input
                    id="socialHandle"
                    type={hints.type}
                    placeholder={hints.placeholder}
                    className="border-0"
                    {...form.register("socialHandle")}
                  />
                </div>
                {form.formState.errors.socialHandle?.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.socialHandle.message}
                  </p>
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
                    />
                    <Label htmlFor="consent" className="leading-relaxed text-muted-foreground">
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
                <p className="text-sm text-destructive">
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
