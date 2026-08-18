import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import AdminOrderPage from "@/app/admin/(dashboard)/orders/[id]/page";

vi.mock("@/features/admin/components/orders/order-detail-view", () => ({
  OrderDetailView: ({ id }: { id: string }) => (
    <div data-testid="order-detail-view">{id}</div>
  ),
}));

describe("AdminOrderPage", () => {
  it("renders OrderDetailView with correct id", async () => {
    await act(async () => {
      render(<AdminOrderPage params={Promise.resolve({ id: "ord-abc" })} />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("order-detail-view")).toBeInTheDocument();
    });
  });

  it("passes the order id to the detail view", async () => {
    await act(async () => {
      render(<AdminOrderPage params={Promise.resolve({ id: "ord-abc123" })} />);
    });
    await waitFor(() => {
      const el = screen.getByTestId("order-detail-view");
      expect(el).toHaveTextContent("ord-abc123");
    });
  });

  it("does not crash on render", () => {
    expect(() => render(<AdminOrderPage params={Promise.resolve({ id: "ord-test" })} />)).not.toThrow();
  });
});
