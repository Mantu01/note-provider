import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APP_URL } from "@/lib/constants";
import { OrderStatusPage } from "@/components/orders/order-status-page";
import { prisma } from "@/helpers/db";

interface OrderRouteProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: OrderRouteProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order Status — Notes Provider`,
    description: "View your order status and download your purchased study notes.",
    robots: { index: false, follow: false },
    alternates: { canonical: `${APP_URL}/order/${orderId}` },
  };
}

export default async function OrderRoute({ params }: OrderRouteProps) {
  const { orderId } = await params;

  let order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    order = await prisma.order.findFirst({ where: { orderNumber: orderId.toUpperCase() } });
  }

  if (!order) {
    notFound();
  }

  return <OrderStatusPage orderId={String(order.id)} />;
}
