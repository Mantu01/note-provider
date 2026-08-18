import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import OrderDetailRoute from "@/app/(public)/order/[orderId]/page";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ orderId: "ord-abc123" })),
}));

vi.mock("@/features/orders/components/order-status-page", () => ({
  OrderStatusPage: ({ orderId }: { orderId: string }) => <div data-testid="order-status">{orderId}</div>,
}));

vi.mock("@/server/db/models/order.model", () => ({
  Order: {
    findById: vi.fn().mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(null) }),
    }),
    findOne: vi.fn().mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ _id: "mock-order-id" }) }),
    }),
  },
}));

describe("OrderDetailRoute", () => {
  it("does not crash when rendered as server component in jsdom", async () => {
    const props = { params: Promise.resolve({ orderId: "ord-abc123" }) } as any;
    expect(() => render(<OrderDetailRoute {...props} />)).not.toThrow();
  });
});
