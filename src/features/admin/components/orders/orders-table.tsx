"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Search, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useAdminOrders } from "@/features/admin/api/use-admin-orders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function OrdersTable() {
  const [{ page, search }, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
  });

  const { data, isLoading } = useAdminOrders({ page, limit: 15, q: search });
  const router=useRouter();

  const orders = data?.items ?? [];
  const pagination = data?.pagination;

  const setPage = (p: number) => setParams({ page: p });
  const setSearch = (q: string) => setParams({ search: q, page: 1 });

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <div className="h-10 animate-pulse rounded bg-muted/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    title="No orders found"
                    description="Submitted buyer checkout orders will appear here."
                  />
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow 
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
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
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(order.buyerFull?.socialHandle || ""); }}
                        className="p-0.5"
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
    </div>
  );
}
