"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Search, Edit3, CheckCircle2, Clock, XCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { FulfillmentDialog } from "@/features/admin/components/orders/fulfillment-dialog";
import { useAdminOrders } from "@/features/admin/api/use-admin-orders";
import { formatDateTime } from "@/lib/format";
import type { AdminOrder } from "@/lib/types";
import { toast } from "sonner";

export function OrdersTable() {
  const [{ page, search, editId }, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    editId: parseAsString,
  });

  const { data, isLoading } = useAdminOrders({ page, limit: 15, q: search });

  const orders = data?.items ?? [];
  const pagination = data?.pagination;
  const editingOrder = orders.find((o) => o.id === editId) ?? null;

  const setPage = (p: number) => setParams({ page: p });
  const setSearch = (q: string) => setParams({ search: q, page: 1 });
  const setEditingOrder = (o: AdminOrder | null) => setParams({ editId: o?.id ?? null });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied social handle to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order #, buyer name or handle..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Buyer Info</TableHead>
              <TableHead>Item Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Fulfillment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <div className="h-10 animate-pulse rounded bg-muted/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState
                    title="No orders found"
                    description="Submitted buyer checkout orders will appear here."
                  />
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm font-semibold">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{order.buyerFull?.fullName || order.buyer?.fullName}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="capitalize font-medium text-primary">{order.buyerFull?.socialPlatform}</span>:
                      <code className="bg-muted px-1 rounded">{order.buyerFull?.socialHandle}</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(order.buyerFull?.socialHandle || "")}
                        className="hover:text-foreground p-0.5"
                        title="Copy handle"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm font-medium">
                    {order.itemTitle}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {order.amountLabel}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setEditingOrder(order)}>
                      <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Fulfil
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      <FulfillmentDialog
        open={Boolean(editingOrder)}
        onOpenChange={() => setEditingOrder(null)}
        order={editingOrder}
      />
    </div>
  );
}
