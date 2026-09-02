import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APP_URL } from "@/lib/constants";
import { OrderStatusPage } from "@/features/orders/components/order-status-page";
import { Order } from "@/server/db/models/order.model";

interface OrderSuccessRouteProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: OrderSuccessRouteProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order Success — Notes Provider`,
    description: "Your payment was successful. Download your notes now.",
    robots: { index: false, follow: false },
    alternates: { canonical: `${APP_URL}/order/success/${orderId}` },
  };
}

export default async function OrderSuccessRoute({ params }: OrderSuccessRouteProps) {
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
