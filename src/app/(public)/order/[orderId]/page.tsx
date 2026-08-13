"use client";

import { useParams } from "next/navigation";
import { OrderStatusPage } from "@/features/orders/components/order-status-page";

export default function OrderRoute() {
  const params = useParams<{ orderId: string }>();
  return <OrderStatusPage orderId={params.orderId} />;
}
