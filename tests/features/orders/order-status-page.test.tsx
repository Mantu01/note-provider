import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderStatusPage } from "@/features/orders/components/order-status-page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useParams: vi.fn(() => ({})),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock("@/features/orders/api/use-order", () => ({
  useOrder: vi.fn(),
}));

vi.mock("@/hooks/use-download-file", () => ({
  useDownloadFile: () => ({ download: vi.fn(), isDownloading: false }),
}));

vi.mock("@/components/shared/copy-button", () => ({
  CopyButton: ({ value }: any) => <button data-testid="copy-btn" onClick={() => navigator.clipboard.writeText(value)}>Copy</button>,
}));

const { useOrder } = await import("@/features/orders/api/use-order");
const mockUseOrder = vi.mocked(useOrder);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).clipboardWriteText = vi.fn().mockResolvedValue(undefined);

describe("OrderStatusPage", () => {
  it("shows spinner during loading", () => {
    mockUseOrder.mockReturnValue({ isPending: true, isError: false, data: null, refetch: vi.fn(), isSuccess: false } as any);
    render(<OrderStatusPage orderId="ord-123" />);
    expect(screen.getByText(/Loading order/i)).toBeInTheDocument();
  });

  it("shows error state when query errors", () => {
    mockUseOrder.mockReturnValue({ isPending: false, isError: true, data: null, refetch: vi.fn(), isSuccess: false } as any);
    render(<OrderStatusPage orderId="ord-missing" />);
    expect(screen.getByText(/could not load this order/i)).toBeInTheDocument();
  });

  it("shows payment pending state for created status", () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        paymentStatus: "created",
        fulfillmentStatus: "pending",
        orderNumber: "NP-20260817-0001",
        itemTitle: "DSA Notes",
        buyer: { socialHandleMasked: "**9876" },
      } as any,
      refetch: vi.fn(),
    } as any);
    render(<OrderStatusPage orderId="ord-created" />);
    expect(screen.getByText(/Confirming your payment/i)).toBeInTheDocument();
  });

  it("shows payment failed state", () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        paymentStatus: "failed",
        fulfillmentStatus: "cancelled",
        orderNumber: "NP-20260817-0002",
        itemSlug: "dsa-notes",
        itemType: "note",
        itemTitle: "DSA Notes",
        buyer: { socialHandleMasked: "**9876" },
      } as any,
      refetch: vi.fn(),
    } as any);
    render(<OrderStatusPage orderId="ord-failed" />);
    expect(screen.getByText(/Payment failed/i)).toBeInTheDocument();
    expect(screen.getByText(/Try again/i)).toBeInTheDocument();
  });

  it("shows success state for paid order", () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        orderNumber: "NP-20260817-0003",
        itemTitle: "React Notes",
        amountLabel: "₹299",
        createdAt: "2026-08-17T10:00:00.000Z",
        buyer: { socialHandleMasked: "**1234" },
      } as any,
      refetch: vi.fn(),
    } as any);
    render(<OrderStatusPage orderId="ord-paid" />);
    expect(screen.getByText(/Payment successful/i)).toBeInTheDocument();
    const orderNums = screen.getAllByText(/NP-20260817-0003/);
    expect(orderNums.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Order details/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Track another/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Support/i)).toBeInTheDocument();
  });

  it("shows delivered state for completed fulfillment", () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        paymentStatus: "paid",
        fulfillmentStatus: "completed",
        orderNumber: "NP-20260817-0004",
        itemTitle: "System Design Notes",
        amountLabel: "₹499",
        createdAt: "2026-08-17T12:00:00.000Z",
        buyer: { socialHandleMasked: "**5678" },
      } as any,
      refetch: vi.fn(),
    } as any);
    render(<OrderStatusPage orderId="ord-done" />);
    expect(screen.getByText(/Notes delivered!/i)).toBeInTheDocument();
  });

  it("renders copy button for order number", () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        orderNumber: "NP-20260817-0005",
        itemTitle: "Note",
        amountLabel: "₹199",
        createdAt: "2026-08-17T10:00:00.000Z",
        buyer: { socialHandleMasked: "**0000" },
      } as any,
      refetch: vi.fn(),
    } as any);
    render(<OrderStatusPage orderId="ord-copy" />);
    const copyBtns = screen.getAllByTestId("copy-btn");
    expect(copyBtns.length).toBeGreaterThanOrEqual(1);
  });

  it("refresh button exists on success page", () => {
    mockUseOrder.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        orderNumber: "NP-20260817-0006",
        itemTitle: "Note",
        amountLabel: "₹199",
        createdAt: "2026-08-17T10:00:00.000Z",
        buyer: { socialHandleMasked: "**0000" },
      } as any,
      refetch: vi.fn(),
    } as any);
    render(<OrderStatusPage orderId="ord-refresh" />);
    expect(screen.getByText(/Refresh/i)).toBeInTheDocument();
  });
});
