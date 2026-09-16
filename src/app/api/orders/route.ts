import { handler } from "@/helpers/api-handler";
import { fail, ok } from "@/helpers/api-response";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";
import { createOrder } from "@/helpers/services/order.service";
import { checkoutSchema } from "@/schemas/checkout.schema";
import { enforceRateLimit } from "@/helpers/rate-limit";
import { getRazorpayKeyId } from "@/helpers/razorpay";

export const runtime = "nodejs";

export const POST = handler(async (ctx) => {
  const body = await ctx.req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return fail(AppError.validation(parsed.error.flatten().fieldErrors as Record<string, string>, parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  enforceRateLimit("createOrder", ctx.ip, { limit: 10, windowMs: 600000 });

  const { itemType, itemSlug } = body as { itemType: "note" | "group"; itemSlug: string };

  let itemTitle = "";
  let amount = 0;

  if (itemType === "note") {
    const item = await prisma.note.findFirst({ where: { slug: itemSlug, visibility: "public" } });
    if (!item) throw AppError.notFound("Note");
    if (item.pricingType === "free" || item.price === 0) throw AppError.validation({}, "Free notes do not require checkout");
    itemTitle = item.title;
    amount = item.price;
  } else {
    const item = await prisma.group.findFirst({ where: { slug: itemSlug, visibility: "public" } });
    if (!item) throw AppError.notFound("Group");
    if (item.price === 0) throw AppError.validation({}, "Free bundles do not require checkout");
    itemTitle = item.name;
    amount = item.price;
  }

  if (amount < 100) throw AppError.validation({}, "Minimum order amount is ₹1");

  const result = await createOrder(
    { fullName: parsed.data.fullName, consentAccepted: parsed.data.consentAccepted },
    itemSlug,
    itemType,
    amount,
    { ip: ctx.ip, userAgent: ctx.userAgent },
  );

  return ok({
    orderId: result.order.id,
    orderNumber: result.order.orderNumber,
    razorpayOrderId: result.razorpayOrderId,
    razorpayKeyId: getRazorpayKeyId(),
    amount,
    currency: "INR" as const,
    itemTitle,
    buyer: { fullName: parsed.data.fullName },
  });
});
