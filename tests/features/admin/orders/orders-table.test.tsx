import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { OrdersTable } from "@/features/admin/components/orders/orders-table";

vi.mock("nuqs", () => {
  const mockParse = vi.fn((val: any) => val);
  return {
    parseAsBoolean: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsString: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    parseAsInteger: { withDefault: vi.fn(() => ({ parse: mockParse })) },
    useQueryStates: vi.fn(() => [{ page: 1, search: "" }, vi.fn()]),
  };
});

vi.mock("@/features/admin/api/use-admin-orders", () => ({
  useAdminOrders: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/table", () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children }: any) => <td>{children}</td>,
}));

vi.mock("@/components/shared/empty-state", () => ({
  EmptyState: ({ title, description }: any) => (
    <div data-testid="empty-state">
      <span>{title}</span>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock("@/components/shared/pagination-bar", () => ({
  PaginationBar: ({ totalPages }: any) => (
    <div data-testid="pagination">
      <span>Total pages: {totalPages}</span>
    </div>
  ),
}));

vi.mock("@/components/shared/status-badge", () => ({
  StatusBadge: ({ status, type }: { status?: string; type?: string }) => (
    <span data-testid={`status-${type}-${status}`}>{status || ""}</span>
  ),
}));

const { useAdminOrders } = await import("@/features/admin/api/use-admin-orders");
const mockUseAdminOrders = vi.mocked(useAdminOrders);

describe("OrdersTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input", () => {
    mockUseAdminOrders.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<OrdersTable />);
    expect(screen.getByPlaceholderText("Search order #, buyer name or handle...")).toBeInTheDocument();
  });

  it("renders loading skeleton rows", () => {
    mockUseAdminOrders.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<OrdersTable />);
    const skeletonRows = document.querySelectorAll(".animate-pulse");
    expect(skeletonRows.length).toBeGreaterThan(0);
  });

  it("renders empty state when no orders", async () => {
    mockUseAdminOrders.mockReturnValue({
      data: { items: [], pagination: null },
      isLoading: false,
    } as any);

    render(<OrdersTable />);
    await waitFor(() => {
      expect(screen.getByText("No orders found")).toBeInTheDocument();
    });
  });

  it("renders order rows with data", async () => {
    mockUseAdminOrders.mockReturnValue({
      data: {
        items: [
          {
            id: "order-1",
            orderNumber: "NP-20260815-0001",
            buyerFull: { fullName: "John Doe", socialPlatform: "instagram", socialHandle: "@johndoe" },
            itemTitle: "React Notes",
            amountLabel: "Rs. 499",
            paymentStatus: "paid",
            fulfillmentStatus: "pending",
          },
        ],
        pagination: { total: 1, page: 1, limit: 15, totalPages: 1 },
      },
      isLoading: false,
    } as any);

    render(<OrdersTable />);
    await waitFor(() => {
      expect(screen.getByText("NP-20260815-0001")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("React Notes")).toBeInTheDocument();
      expect(screen.getByText("Rs. 499")).toBeInTheDocument();
    });
  });

  it("shows copy button for social handle", async () => {
    mockUseAdminOrders.mockReturnValue({
      data: {
        items: [{
          id: "order-1",
          orderNumber: "NP-001",
          buyerFull: { fullName: "John", socialPlatform: "instagram", socialHandle: "@johndoe" },
          itemTitle: "Note",
          amountLabel: "Rs. 499",
          paymentStatus: "paid",
          fulfillmentStatus: "pending",
        }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<OrdersTable />);
    await waitFor(() => {
      expect(document.querySelector('[title="Copy handle"]')).toBeInTheDocument();
    });
  });

  it("navigates to order detail on row click", async () => {
    const customPush = vi.fn();
    vi.mocked(await import("next/navigation")).useRouter.mockReturnValue({ push: customPush } as any);

    mockUseAdminOrders.mockReturnValue({
      data: {
        items: [{
          id: "order-1",
          orderNumber: "NP-001",
          buyerFull: { fullName: "John", socialPlatform: "instagram", socialHandle: "@johndoe" },
          itemTitle: "Note",
          amountLabel: "Rs. 499",
          paymentStatus: "paid",
          fulfillmentStatus: "pending",
        }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<OrdersTable />);
    await waitFor(() => {
      const row = document.querySelector("tr.cursor-pointer");
      if (row) (row as HTMLElement).click();
      expect(customPush).toHaveBeenCalledWith("/admin/orders/order-1");
    });
  });

  it("renders payment and fulfillment status badges", async () => {
    mockUseAdminOrders.mockReturnValue({
      data: {
        items: [{
          id: "order-1",
          orderNumber: "NP-001",
          buyerFull: { fullName: "John", socialPlatform: "email", socialHandle: "john@test.com" },
          itemTitle: "Note",
          amountLabel: "Rs. 499",
          paymentStatus: "paid",
          fulfillmentStatus: "completed",
        }],
        pagination: null,
      },
      isLoading: false,
    } as any);

    render(<OrdersTable />);
    await waitFor(() => {
      expect(screen.getByTestId("status-payment-paid")).toBeInTheDocument();
      expect(screen.getByTestId("status-fulfillment-completed")).toBeInTheDocument();
    });
  });

  it("renders pagination when multiple pages", async () => {
    mockUseAdminOrders.mockReturnValue({
      data: {
        items: [],
        pagination: { total: 50, page: 1, limit: 15, totalPages: 4 },
      },
      isLoading: false,
    } as any);

    render(<OrdersTable />);
    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  });
});
