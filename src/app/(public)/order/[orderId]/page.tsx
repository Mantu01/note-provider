import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APP_URL } from "@/lib/constants";
import { OrderStatusPage } from "@/features/orders/components/order-status-page";
import { Order } from "@/server/db/models/order.model";

interface OrderRouteProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: OrderRouteProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order Status — ${orderId} | Notes Provider`,
    description: "Track your study note order and check delivery status.",
    robots: { index: false, follow: false },
    alternates: { canonical: `${APP_URL}/order/${orderId}` },
  };
}

export default async function OrderRoute({ params }: OrderRouteProps) {
  const { orderId } = await params;

  let order = await Order.findById(orderId).lean().exec();

  if (!order) {
    order = await Order.findOne({ orderNumber: orderId.toUpperCase() }).lean().exec();
  }

  if (!order) {
    notFound();
  }

  return <OrderStatusPage orderId={String(order._id)} />;
}
