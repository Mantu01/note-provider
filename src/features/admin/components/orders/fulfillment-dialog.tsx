"use client";

import { useForm } from "react-hook-form";
import { Loader2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUpdateOrderFulfillment } from "@/features/admin/api/use-admin-orders";
import type { AdminOrder, FulfillmentStatus } from "@/lib/types";

type FulfillmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: AdminOrder | null;
};

export function FulfillmentDialog({ open, onOpenChange, order }: FulfillmentDialogProps) {
  const updateMutation = useUpdateOrderFulfillment(order?.id ?? "");

  const form = useForm<{ fulfillmentStatus: FulfillmentStatus; adminNote: string }>({
    values: {
      fulfillmentStatus: order?.fulfillmentStatus ?? "pending",
      adminNote: order?.adminNote ?? "",
    },
  });

  const onSubmit = (values: { fulfillmentStatus: FulfillmentStatus; adminNote: string }) => {
    if (!order) return;
    updateMutation.mutate(values, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update Order #{order?.orderNumber}</DialogTitle>
            <DialogDescription>
              Buyer: <strong className="text-foreground">{order?.buyerFull?.fullName}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="fulfillment-status" className="text-sm font-medium">Fulfillment Status</label>
              <Select
                id="fulfillment-status"
                value={form.watch("fulfillmentStatus")}
                onValueChange={(val) => form.setValue("fulfillmentStatus", val as FulfillmentStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2 text-warning">
                      <Clock className="h-4 w-4" /> Pending Delivery
                    </span>
                  </SelectItem>
                  <SelectItem value="completed">
                    <span className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-4 w-4" /> Completed (PDF Sent)
                    </span>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <span className="flex items-center gap-2 text-destructive">
                      <XCircle className="h-4 w-4" /> Cancelled
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="admin-note" className="text-sm font-medium">Internal Admin Note (Optional)</label>
              <Textarea
                id="admin-note"
                rows={3}
                placeholder="e.g. Notes delivered via email on Aug 4, 2:30 PM..."
                {...form.register("adminNote")}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
