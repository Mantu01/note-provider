import { adminHandler } from "@/server/lib/api-handler";
import { Order } from "@/server/db/models/order.model";
import { toCsv } from "@/server/lib/csv";
import { buildOrderFilter, buildOrderSort } from "@/server/lib/query";

export const runtime = "nodejs";


export const GET = adminHandler(async (ctx) => {
  const query = {
    q: ctx.searchParams.get("q") || undefined,
    paymentStatus: (ctx.searchParams.get("paymentStatus") as "created" | "paid" | "failed") || undefined,
    fulfillmentStatus: (ctx.searchParams.get("fulfillmentStatus") as "pending" | "completed" | "cancelled") || undefined,
    itemType: (ctx.searchParams.get("itemType") as "note" | "group") || undefined,
    from: ctx.searchParams.get("from") ? new Date(ctx.searchParams.get("from")!) : undefined,
    to: ctx.searchParams.get("to") ? new Date(ctx.searchParams.get("to")!) : undefined,
    sort: (ctx.searchParams.get("sort") as "newest" | "oldest" | "amount_desc" | "amount_asc") || "newest",
  };

  const filter = buildOrderFilter(query);
  const sort = buildOrderSort(query.sort);

  const items = await Order.find(filter).sort(sort).limit(10000).lean().exec();

  const rows = items.map((o) => ({
    "Order Number": o.orderNumber,
    Date: new Date(o.createdAt).toISOString(),
    "Full Name": o.buyer.fullName,
    Platform: o.buyer.socialPlatform,
    Handle: o.buyer.socialHandle,
    "Item Type": o.itemType,
    "Item Title": o.itemSnapshot.title,
    "Amount (INR)": (o.amount / 100).toFixed(2),
    "Payment Status": o.paymentStatus,
    "Fulfillment Status": o.fulfillmentStatus,
  }));

  const columns = Object.keys(rows[0] ?? []);
  const csv = toCsv(rows.map((r) => r as Record<string, unknown>));
  const date = new Date().toISOString().split("T")[0];

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="notes-provider-leads-${date}.csv"`,
      "Cache-Control": "no-store, max-age=0",
    },
  }) as unknown as ReturnType<typeof import("@/server/lib/api-response").ok>;
});
