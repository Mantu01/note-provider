"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { useAdminOrders } from "@/hooks/useAdmin";
import { useAdminListState } from "@/hooks/use-admin-table-state";
import { useRouter } from "next/navigation";

export function OrdersTable() {
  const { page, search, setPage, setSearch } = useAdminListState();
  const { data, isLoading } = useAdminOrders({ page, limit: 15, q: search });
  const router = useRouter();

  const orders = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order # or buyer name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Downloaded</TableHead>
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
                <TableCell colSpan={6} className="py-12 text-center">
                  <p className="text-sm font-medium text-foreground">No orders found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitted checkout orders will appear here.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <TableCell className="font-mono text-xs font-semibold">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.coverImageUrl && (
                        <div className="relative size-8 shrink-0 overflow-hidden rounded-md border border-border/60">
                          <Image src={order.coverImageUrl} alt="" fill sizes="32px" className="object-cover" />
                        </div>
                      )}
                      <span className="font-medium text-foreground">
                        {order.buyerFull?.fullName || order.buyer?.fullName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[12rem] truncate text-sm font-medium">
                    {order.itemTitle}
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums">{order.amountLabel}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </TableCell>
                  <TableCell>
                    {order.isDownloaded ? (
                      <Badge variant="secondary" className="text-[11px] font-medium text-success">
                        Downloaded
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <PaginationBar page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
