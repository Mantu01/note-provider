import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useAdminOrders,
  useAdminOrder,
  useUpdateOrderFulfillment,
} from "@/features/admin/api/use-admin-orders";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
  buildQueryString: vi.fn((params: Record<string, unknown>) => {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
    return entries.length ? "?" + entries.map(([k, v]) => `${k}=${v}`).join("&") : "";
  }),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    admin: {
      orders: {
        all: ["admin", "orders"] as const,
        list: vi.fn((params: unknown) => ["admin", "orders", "list", params]),
        detail: vi.fn((id: string) => ["admin", "orders", "detail", id]),
      },
      dashboard: ["admin", "dashboard"] as const,
    },
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const { apiClient } = await import("@/lib/api-client");
const mockApiClient = vi.mocked(apiClient);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useAdminOrders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches admin orders with default params", async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 15, totalPages: 0 },
    });

    const { result } = renderHook(() => useAdminOrders(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/admin/orders");
  });

  it("appends all filter params to URL", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 15, totalPages: 0 } });

    renderHook(
      () => useAdminOrders({ page: 2, limit: 10, q: "react", paymentStatus: "paid", fulfillmentStatus: "pending", itemType: "note", from: "2026-01-01", to: "2026-08-15", sort: "newest" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith(
        "/admin/orders?page=2&limit=10&q=react&paymentStatus=paid&fulfillmentStatus=pending&itemType=note&from=2026-01-01&to=2026-08-15&sort=newest",
      );
    });
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Forbidden"));

    const { result } = renderHook(() => useAdminOrders(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useAdminOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches single admin order by ID", async () => {
    mockApiClient.mockResolvedValue({
      id: "order-1",
      orderNumber: "NP-20260815-0001",
      paymentStatus: "paid",
      fulfillmentStatus: "pending",
    });

    const { result } = renderHook(() => useAdminOrder("order-1"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/admin/orders/order-1");
  });

  it("does not fetch when id is empty", () => {
    renderHook(() => useAdminOrder(""), { wrapper: createWrapper() });
    expect(mockApiClient).not.toHaveBeenCalled();
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Order not found"));

    const { result } = renderHook(() => useAdminOrder("invalid"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useUpdateOrderFulfillment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates order fulfillment via PATCH", async () => {
    mockApiClient.mockResolvedValue({
      id: "order-1",
      orderNumber: "NP-20260815-0001",
      fulfillmentStatus: "completed",
    });

    const { result } = renderHook(() => useUpdateOrderFulfillment("order-1"), { wrapper: createWrapper() });

    result.current.mutate({ fulfillmentStatus: "completed", adminNote: "Sent via WhatsApp" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/orders/order-1",
      expect.objectContaining({
        method: "PATCH",
        body: expect.stringContaining("completed"),
      }),
    );
  });

  it("handles update error", async () => {
    mockApiClient.mockRejectedValue(new Error("Update failed"));

    const { result } = renderHook(() => useUpdateOrderFulfillment("order-1"), { wrapper: createWrapper() });

    result.current.mutate({ fulfillmentStatus: "cancelled", adminNote: "" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
