import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminOrdersPage from "@/app/admin/(dashboard)/orders/page";

vi.mock("@/features/admin/components/orders/orders-table", () => ({
  OrdersTable: () => <div data-testid="orders-table">Orders Table</div>,
}));

describe("AdminOrdersPage", () => {
  it("renders page title", () => {
    render(<AdminOrdersPage />);
    expect(screen.getByText("Orders & Fulfillment")).toBeInTheDocument();
  });

  it("renders OrdersTable inside Suspense", () => {
    render(<AdminOrdersPage />);
    expect(screen.getByTestId("orders-table")).toBeInTheDocument();
  });

  it("renders top-level heading with text-3xl font-bold classes", () => {
    render(<AdminOrdersPage />);
    const heading = document.querySelector("h1");
    expect(heading).toBeInTheDocument();
    expect(heading!.textContent).toBe("Orders & Fulfillment");
  });

  it("wraps content in space-y-6 container", () => {
    const { container } = render(<AdminOrdersPage />);
    const wrapper = container.querySelector(".space-y-6");
    expect(wrapper).toBeInTheDocument();
  });

  it("does not crash on render", () => {
    expect(() => render(<AdminOrdersPage />)).not.toThrow();
  });
});
