import { NextResponse } from "next/server";
import { connectDb } from "@/server/db/connect";
import { verifyWebhookSignature } from "@/server/lib/razorpay";
import { Order } from "@/server/db/models/order.model";
import { Note } from "@/server/db/models/note.model";
import { Group } from "@/server/db/models/group.model";
import { notifyAdminsOnPurchase } from "@/server/lib/mailer";

export const runtime = "nodejs";


export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return new NextResponse(JSON.stringify({ error: "Missing signature" }), { status: 400 });
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    return new NextResponse(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  try {
    await connectDb();

    const payload = JSON.parse(rawBody) as {
      event: string;
      payload?: {
        payment?: {
          entity?: {
            id: string;
            order_id?: string;
            error_description?: string;
            method?: string;
          };
        };
      };
    };
    const event = payload.event;
    const payment = payload.payload?.payment?.entity;

    if (!payment) {
      return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
    }

    const razorpayOrderId = payment.order_id;

    if ((event === "payment.captured" || event === "order.paid") && razorpayOrderId) {
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId, paymentStatus: { $ne: "paid" } },
        {
          paymentStatus: "paid",
          razorpayPaymentId: payment.id,
          razorpaySignature: null,
          paymentMethod: payment.method ?? "online",
          paidAt: new Date(),
          fulfillmentStatus: "pending",
        },
        { new: true },
      )
        .lean()
        .exec();

      if (updatedOrder) {
        if (updatedOrder.itemType === "note" && updatedOrder.note) {
          await Note.findByIdAndUpdate(updatedOrder.note, {
            $inc: { purchaseCount: 1, revenuePaise: updatedOrder.amount },
          }).exec();
        } else if (updatedOrder.itemType === "group" && updatedOrder.group) {
          await Group.findByIdAndUpdate(updatedOrder.group, {
            $inc: { purchaseCount: 1, revenuePaise: updatedOrder.amount },
          }).exec();
        }

        await notifyAdminsOnPurchase(updatedOrder);
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

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("[webhook] error", error);
    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
  }
}
