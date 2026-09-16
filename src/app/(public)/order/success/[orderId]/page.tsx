import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APP_URL } from "@/lib/constants";
import { OrderStatusPage } from "@/components/orders/order-status-page";
import { prisma } from "@/helpers/db";

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

  let order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    order = await prisma.order.findFirst({ where: { orderNumber: orderId.toUpperCase() } });
  }

  if (!order) {
    notFound();
  }

  return <OrderStatusPage orderId={String(order.id)} />;
}
