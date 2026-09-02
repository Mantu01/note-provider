import { NextResponse } from "next/server";
import { connectDB } from "@/server/db/connect";
import { verifyWebhookSignature } from "@/server/lib/razorpay";
import { Order } from "@/server/db/models/order.model";
import { Note } from "@/server/db/models/note.model";
import { Group } from "@/server/db/models/group.model";

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
    await connectDB();

    const payload = JSON.parse(rawBody) as {
      event: string;
      payload?: {
        payment?: {
          entity?: {
            id: string;
            order_id?: string;
            error_description?: string;
            method?: string;
            amount?: number;
          };
        };
      };
    };
    const event = payload.event;
    const payment = payload.payload?.payment?.entity;

    if (!payment) {
      return NextResponse.json({ success: true, data: { received: true } });
    }

    const razorpayOrderId = payment.order_id;
    const amount = payment.amount ?? 0;

    if ((event === "payment.captured" || event === "order.paid") && razorpayOrderId) {
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId, paymentStatus: { $ne: "paid" } },
        {
          paymentStatus: "paid",
          fulfillmentStatus: "completed",
          razorpayPaymentId: payment.id,
          paymentMethod: payment.method ?? "online",
          paidAt: new Date(),
          completedAt: new Date(),
          ...(amount ? { amount } : {}),
        },
        { new: true },
      )
        .lean()
        .exec();

      if (updatedOrder) {
        if (updatedOrder.itemType === "note" && updatedOrder.note) {
          await Note.findByIdAndUpdate(updatedOrder.note, {
            $inc: { purchaseCount: 1, revenuePaise: amount },
          }).exec();
        } else if (updatedOrder.itemType === "group" && updatedOrder.group) {
          await Group.findByIdAndUpdate(updatedOrder.group, {
            $inc: { purchaseCount: 1, revenuePaise: amount },
          }).exec();
        }
      }
    } else if ((event === "payment.failed" || event === "payment.canceled" || event === "order.canceled") && razorpayOrderId) {
      await Order.findOneAndUpdate(
        { razorpayOrderId, paymentStatus: "created" },
        {
          paymentStatus: "failed",
          failureReason: payment.error_description ?? "Payment failed or canceled",
        },
      ).exec();
    }

    return NextResponse.json({ success: true, data: { received: true } });
  } catch (error) {
    console.error("[webhook] error", error);
    return NextResponse.json({ success: true, data: { received: true } });
  }
}
