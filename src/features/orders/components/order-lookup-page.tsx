"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Search, PackageCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrderLookup } from "@/features/orders/api/use-order-lookup";

const lookupSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .min(1, "Please enter your order number.")
    .max(50, "Order number is too long."),
});

type LookupValues = z.infer<typeof lookupSchema>;

export function OrderLookupPage() {
  const router = useRouter();
  const lookup = useOrderLookup();

  const form = useForm<LookupValues>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      orderNumber: "",
    },
  });

  const onSubmit = (values: LookupValues) => {
    lookup.mutate(values.orderNumber, {
      onSuccess: (data) => {
        toast.success(`Order #${data.orderNumber} found`);
        router.push(`/order/${data.orderId}`);
      },
      onError: (error) => {
        toast.error(error.message || "Order not found. Please check your order number.");
      },
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="text-center space-y-3">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl brand-gradient-soft text-primary shadow-sm">
          <PackageCheck className="size-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Track Your Order</h1>
        <p className="text-muted-foreground text-balance">
          Enter your unique order number (e.g. <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-semibold text-foreground">NP-20260810-0001</code>) to check your payment and delivery status anytime.
        </p>
      </div>

      <Card className="mt-8 rounded-3xl border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Look up order</CardTitle>
          <CardDescription>
            You can find your order number on your payment receipt or order confirmation page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <div className="flex gap-2">
                <Input
                  id="orderNumber"
                  placeholder="NP-20260810-0001"
                  className="font-mono uppercase"
                  aria-invalid={Boolean(form.formState.errors.orderNumber)}
                  {...form.register("orderNumber")}
                />
                <Button type="submit" disabled={lookup.isPending} className="shrink-0">
                  {lookup.isPending ? (
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Search aria-hidden="true" className="mr-2 size-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              {form.formState.errors.orderNumber?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.orderNumber.message}
                </p>
              )}
            </div>
          </form>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              Orders stay pending until reviewed and fulfilled by the admin team within 4–6 hours. You can check this page as many times as you like.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
