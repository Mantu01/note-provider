import { NextResponse } from "next/server";
import { adminHandler } from "@/helpers/api-handler";
import { prisma } from "@/helpers/db";
import { buildOrderFilter, buildOrderSort } from "@/helpers/query";
import { toCsv } from "@/helpers/csv";


export const GET = adminHandler(async (ctx) => {
  const query = {
    q: ctx.searchParams.get("q") || undefined,
    paymentStatus: (ctx.searchParams.get("paymentStatus") as "created" | "paid" | "failed") || undefined,
    fulfillmentStatus: (ctx.searchParams.get("fulfillmentStatus") as "pending" | "completed" | "cancelled") || undefined,
    itemType: (ctx.searchParams.get("itemType") as "note" | "group") || undefined,
    from: ctx.searchParams.get("from") || undefined,
    to: ctx.searchParams.get("to") || undefined,
    sort: (ctx.searchParams.get("sort") as "newest" | "oldest" | "amount_desc" | "amount_asc") || "newest",
  };

  const filter = buildOrderFilter(query);
  const sort = buildOrderSort(query.sort);

  const items = await prisma.order.findMany({ where: filter.where as any, orderBy: sort as any, take: 10000 });

  const rows = items.map((o) => ({
    "Order Number": o.orderNumber,
    Date: new Date(o.createdAt).toISOString(),
    "Full Name": (o.buyer as any)?.fullName,
    "Item Type": o.itemType,
    "Item Title": (o.itemSnapshot as any)?.title,
    "Amount (INR)": (o.amount / 100).toFixed(2),
    "Payment Status": o.paymentStatus,
    "Fulfillment Status": o.fulfillmentStatus,
  }));

  const csv = toCsv(rows as unknown as Array<Record<string, unknown>>);
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="notes-provider-leads-${date}.csv"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
});
