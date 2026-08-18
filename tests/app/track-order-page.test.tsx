import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TrackOrderRoute from "@/app/(public)/order/track/page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useParams: vi.fn(() => ({})),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock("@/features/orders/components/order-lookup-page", () => ({
  OrderLookupPage: () => <div data-testid="order-lookup">Order Lookup</div>,
}));

describe("TrackOrderRoute", () => {
  it("renders OrderLookupPage component", () => {
    render(<TrackOrderRoute />);
    expect(screen.getByTestId("order-lookup")).toBeInTheDocument();
  });
});
