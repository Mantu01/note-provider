"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
        router.push(`/order/success/${data.orderId}`);
      },
      onError: (error) => {
        toast.error(error.message || "Order not found. Please check your order number.");
      },
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="text-center space-y-2.5">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl brand-gradient-soft text-primary">
          <PackageCheck className="size-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Track Your Order</h1>
        <p className="text-sm text-muted-foreground text-balance">
          Enter your order number (e.g. <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono font-semibold text-foreground">NP-20260810-0001</code>) to check status.
        </p>
      </div>

      <Card className="mt-6 rounded-2xl border border-border">
        <CardHeader>
          <CardTitle className="text-sm">Look up order</CardTitle>
          <CardDescription className="text-xs">
            Find your order number on your payment receipt or order confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
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
                    <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                  ) : (
                    <>
                      <Search aria-hidden="true" className="mr-1.5 size-3.5" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              {form.formState.errors.orderNumber?.message && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.orderNumber.message}
                </p>
              )}
            </div>
          </form>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-muted/30 p-3 text-[10px] text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <p>
              Paid orders are fulfilled instantly. Check this page anytime for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
