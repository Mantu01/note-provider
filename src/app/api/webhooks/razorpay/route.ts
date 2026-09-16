import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/helpers/razorpay";
import { prisma } from "@/helpers/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Missing signature" } },
      { status: 400 },
    );
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid signature" } },
      { status: 400 },
    );
  }

  try {
    const payload = JSON.parse(rawBody) as {
      event: string;
      payload?: { payment?: { entity?: { id: string; order_id?: string; error_description?: string; method?: string; amount?: number } } };
    };
    const event = payload.event;
    const payment = payload.payload?.payment?.entity;

    if (!payment) return NextResponse.json({ success: true, data: { received: true } });

    const razorpayOrderId = payment.order_id;
    const amount = payment.amount ?? 0;

    if ((event === "payment.captured" || event === "order.paid") && razorpayOrderId) {
      await prisma.order.updateMany({
        where: { razorpayOrderId, paymentStatus: { not: "paid" } },
        data: {
          paymentStatus: "paid",
          fulfillmentStatus: "completed",
          razorpayPaymentId: payment.id,
          paymentMethod: payment.method ?? "online",
          paidAt: new Date(),
          completedAt: new Date(),
          ...(amount ? { amount } : {}),
        },
      });

      const order = await prisma.order.findFirst({ where: { razorpayOrderId } });
      if (order && order.paymentStatus === "paid") {
        if (order.itemType === "note" && order.noteId) {
          await prisma.note.update({ where: { id: order.noteId }, data: { purchaseCount: { increment: 1 }, revenuePaise: { increment: amount } } });
        } else if (order.itemType === "group" && order.groupId) {
          await prisma.group.update({ where: { id: order.groupId }, data: { purchaseCount: { increment: 1 }, revenuePaise: { increment: amount } } });
        }
      }
    } else if ((event === "payment.failed" || event === "payment.canceled" || event === "order.canceled") && razorpayOrderId) {
      await prisma.order.updateMany({
        where: { razorpayOrderId, paymentStatus: "created" },
        data: { paymentStatus: "failed", failureReason: payment.error_description ?? "Payment failed or canceled" },
      });
    }

    return NextResponse.json({ success: true, data: { received: true } });
  } catch (error) {
    console.error("[webhook] error", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Webhook processing failed" } },
      { status: 500 },
    );
  }
}
