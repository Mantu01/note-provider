"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Search, PackageCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrderLookup } from "@/hooks/useOrders";

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
    <div className="mx-auto max-w-xl px-3 py-6 sm:px-6 sm:py-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PackageCheck aria-hidden="true" className="size-6" />
        </div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
          Order tracking
        </p>
        <h1 className="text-base font-bold tracking-tight sm:text-lg md:text-xl">
          Track Your Order
        </h1>
        <p className="text-sm text-muted-foreground text-balance">
          Enter your order number to view your order status and download your notes.
        </p>
      </div>

      <Card className="mt-5 rounded-xl border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Look up order</CardTitle>
          <p className="text-xs text-muted-foreground">
            Find your order number on your payment receipt or order confirmation.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="orderNumber" className="text-xs font-medium">
                Order Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="orderNumber"
                  placeholder="20260918-0001a3b2c4d5"
                  className="h-10 font-mono text-sm uppercase sm:h-9"
                  aria-invalid={Boolean(form.formState.errors.orderNumber)}
                  {...form.register("orderNumber")}
                />
                <Button type="submit" disabled={lookup.isPending} className="h-10 shrink-0 sm:h-9">
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

          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-muted/30 p-3 text-[11px] text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <p>
              Paid orders give you immediate download access. After the initial session, links work once per note to prevent unauthorized sharing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
