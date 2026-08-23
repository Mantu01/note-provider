import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { OrderDetailView } from "@/features/admin/components/orders/order-detail-view";

vi.mock("nuqs", () => {
  const mockParse = vi.fn((val: any) => val);
  return {
    parseAsBoolean: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsString: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    useQueryStates: vi.fn(() => [{ edit: false }, vi.fn()]),
  };
});

vi.mock("@/features/admin/api/use-admin-orders", () => ({
  useAdminOrder: vi.fn(),
}));

vi.mock("@/features/admin/components/orders/fulfillment-dialog", () => ({
  FulfillmentDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid="fulfillment-dialog">Fulfillment Dialog</div> : null,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, variant, size, render: renderProp, ...props }: any) => {
    if (renderProp) {
      return renderProp;
    }
    return <button onClick={onClick} {...props}>{children}</button>;
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: any) => {
    const hasText = children && typeof children === "string" && children.trim().length > 0;
    return <a href={href} {...(hasText ? {} : { "aria-label": "Back" })}>{children}</a>;
  },
}));

vi.mock("@/components/shared/status-badge", () => ({
  StatusBadge: ({ status }: { status?: string }) => (
    <span data-testid={`status-${status}`}>{status || ""}</span>
  ),
}));

const { useAdminOrder } = await import("@/features/admin/api/use-admin-orders");
const mockUseAdminOrder = vi.mocked(useAdminOrder);

describe("OrderDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton", () => {
    mockUseAdminOrder.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    render(<OrderDetailView id="order-1" />);
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders error state when order not found", () => {
    mockUseAdminOrder.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(<OrderDetailView id="invalid" />);
    expect(screen.getByText("Order not found.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back" })).toBeInTheDocument();
  });

  it("renders order header with number and statuses", async () => {
    mockUseAdminOrder.mockReturnValue({
      data: {
        id: "order-1",
        orderNumber: "NP-20260815-0001",
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        itemTitle: "React Notes",
        itemType: "note",
        amountLabel: "Rs. 499",
        createdAt: "2026-08-15T10:00:00Z",
        buyerFull: { fullName: "John Doe" },
        razorpayOrderId: "order_abc123",
        razorpayPaymentId: "pay_xyz",
        paymentMethod: "UPI",
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderDetailView id="order-1" />);
    await waitFor(() => {
      expect(screen.getByText("Order #NP-20260815-0001")).toBeInTheDocument();
      expect(screen.getByTestId("status-paid")).toBeInTheDocument();
      expect(screen.getByTestId("status-pending")).toBeInTheDocument();
    });
  });

  it("renders item purchased card", async () => {
    mockUseAdminOrder.mockReturnValue({
      data: {
        id: "order-1",
        orderNumber: "NP-001",
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        itemTitle: "Full Stack Bundle",
        itemType: "group",
        amountLabel: "Rs. 999",
        createdAt: "2026-08-15T10:00:00Z",
        buyerFull: { fullName: "John" },
        razorpayOrderId: "oid",
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderDetailView id="order-1" />);
    await waitFor(() => {
      expect(screen.getByText("Item Purchased")).toBeInTheDocument();
      expect(screen.getByText("Full Stack Bundle")).toBeInTheDocument();
      expect(screen.getByText(/group/)).toBeInTheDocument();
      expect(screen.getByText("Rs. 999")).toBeInTheDocument();
    });
  });

  it("renders buyer details card", async () => {
    mockUseAdminOrder.mockReturnValue({
      data: {
        id: "order-1",
        orderNumber: "NP-001",
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        itemTitle: "Note",
        itemType: "note",
        amountLabel: "Rs. 499",
        createdAt: "2026-08-15T10:00:00Z",
        buyerFull: { fullName: "Jane Doe" },
        razorpayOrderId: "oid",
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderDetailView id="order-1" />);
    await waitFor(() => {
      expect(screen.getByText("Buyer Details")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  it("renders payment metadata card", async () => {
    mockUseAdminOrder.mockReturnValue({
      data: {
        id: "order-1",
        orderNumber: "NP-001",
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        itemTitle: "Note",
        amountLabel: "Rs. 499",
        createdAt: "2026-08-15T10:00:00Z",
        buyerFull: { fullName: "John" },
        razorpayOrderId: "order_abc",
        razorpayPaymentId: "pay_xyz",
        paymentMethod: "UPI",
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderDetailView id="order-1" />);
    await waitFor(() => {
      expect(screen.getByText("Payment Metadata")).toBeInTheDocument();
      expect(screen.getByText("order_abc")).toBeInTheDocument();
      expect(screen.getByText("pay_xyz")).toBeInTheDocument();
      expect(screen.getByText("UPI")).toBeInTheDocument();
    });
  });

  it("renders admin note when present", async () => {
    mockUseAdminOrder.mockReturnValue({
      data: {
        id: "order-1",
        orderNumber: "NP-001",
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        itemTitle: "Note",
        amountLabel: "Rs. 499",
        createdAt: "2026-08-15T10:00:00Z",
        buyerFull: { fullName: "John" },
        razorpayOrderId: "oid",
        adminNote: "Sent via DM on Aug 15",
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderDetailView id="order-1" />);
    await waitFor(() => {
      expect(screen.getByText("Internal Admin Note")).toBeInTheDocument();
      expect(screen.getByText(/Sent via DM on Aug 15/)).toBeInTheDocument();
    });
  });

  it("shows update fulfillment button", async () => {
    mockUseAdminOrder.mockReturnValue({
      data: {
        id: "order-1",
        orderNumber: "NP-001",
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        itemTitle: "Note",
        amountLabel: "Rs. 499",
        createdAt: "2026-08-15T10:00:00Z",
        buyerFull: { fullName: "John" },
        razorpayOrderId: "oid",
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderDetailView id="order-1" />);
    await waitFor(() => {
      expect(screen.getByText("Update Fulfillment Status")).toBeInTheDocument();
    });
  });

  it("renders back link button", async () => {
    mockUseAdminOrder.mockReturnValue({
      data: {
        id: "order-1",
        orderNumber: "NP-001",
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        itemTitle: "Note",
        amountLabel: "Rs. 499",
        createdAt: "2026-08-15T10:00:00Z",
        buyerFull: { fullName: "John" },
        razorpayOrderId: "oid",
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderDetailView id="order-1" />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Back" })).toBeInTheDocument();
    });
  });
});
