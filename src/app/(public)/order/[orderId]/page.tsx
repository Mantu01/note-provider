import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderStatusPage } from "@/features/orders/components/order-status-page";
import { Order } from "@/server/db/models/order.model";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface OrderRouteProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: OrderRouteProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order ${orderId} — Notes Provider`,
    description: "Check the status of your order for study notes.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${APP_URL}/order/${orderId}`,
    },
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
