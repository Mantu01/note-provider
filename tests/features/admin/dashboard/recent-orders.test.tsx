import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecentOrders } from "@/features/admin/components/dashboard/recent-orders";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/shared/status-badge", () => ({
  StatusBadge: ({ status }: { status?: string }) => (
    <span data-testid={`status-${status}`}>{status || ""}</span>
  ),
}));

describe("RecentOrders", () => {
  it("renders title and view all button", () => {
    render(<RecentOrders orders={[]} />);
    expect(screen.getByText("Recent Orders")).toBeInTheDocument();
    expect(screen.getByText("View All")).toBeInTheDocument();
  });

  it("shows empty state when no orders", () => {
    render(<RecentOrders orders={[]} />);
    expect(screen.getByText("No recent orders yet.")).toBeInTheDocument();
  });

  it("renders order items with details", () => {
    const orders = [
      {
        id: "1",
        orderNumber: "NP-20260815-0001",
        buyer: { fullName: "John Doe" },
        itemTitle: "React Notes",
        amountLabel: "Rs. 499",
        paymentStatus: "paid",
      },
    ] as any;
    render(<RecentOrders orders={orders} />);
    expect(screen.getByText(/NP-20260815-0001/)).toBeInTheDocument();
    expect(screen.getByText(/react notes/i)).toBeInTheDocument();
    expect(screen.getByText(/rs\.?\s*499/i)).toBeInTheDocument();
  });

  it("renders up to 5 orders", () => {
    const orders = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      orderNumber: `NP-00${i}`,
      buyerFull: { fullName: `User ${i}` },
      itemTitle: `Item ${i}`,
      amountLabel: "Rs. 499",
      paymentStatus: "paid",
    })) as any;
    render(<RecentOrders orders={orders} />);
    const orderRows = document.querySelectorAll('[class*="border-b"]');
    expect(orderRows.length).toBeLessThanOrEqual(5);
  });

  it("handles orders with missing buyerFull", () => {
    const orders = [
      {
        id: "1",
        orderNumber: "NP-001",
        buyer: { fullName: "Jane" },
        itemTitle: "Node Notes",
        amountLabel: "Rs. 299",
        paymentStatus: "pending",
      },
    ] as any;
    render(<RecentOrders orders={orders} />);
    expect(screen.getByText(/NP-001/)).toBeInTheDocument();
  });

  it("renders payment status badge", () => {
    const orders = [
      {
        id: "1",
        orderNumber: "NP-001",
        buyerFull: { fullName: "John" },
        itemTitle: "Note",
        amountLabel: "Rs. 499",
        paymentStatus: "paid",
      },
    ] as any;
    render(<RecentOrders orders={orders} />);
    expect(screen.getByTestId("status-paid")).toBeInTheDocument();
  });
});
