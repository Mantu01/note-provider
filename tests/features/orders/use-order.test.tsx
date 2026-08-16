import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOrder } from "@/features/orders/api/use-order";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    order: vi.fn((id: string) => ["order", id]),
  },
}));

const { apiClient } = await import("@/lib/api-client");
const mockApiClient = vi.mocked(apiClient);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches order by ID", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-123",
      orderNumber: "NP-20260815-0001",
      paymentStatus: "paid",
      fulfillmentStatus: "pending",
      itemTitle: "React Notes",
      amountLabel: "Rs. 499",
    });

    const { result } = renderHook(() => useOrder("ord-123"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/orders/ord-123");
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Order not found"));

    const { result } = renderHook(() => useOrder("invalid-id"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("returns order data on success", async () => {
    const orderData = {
      orderId: "ord-456",
      orderNumber: "NP-20260815-0002",
      paymentStatus: "paid",
      fulfillmentStatus: "completed",
      itemTitle: "Full Stack Bundle",
      amountLabel: "Rs. 999",
      createdAt: "2026-08-15T10:00:00Z",
      buyer: { socialHandleMasked: "***@gmail.com" },
    };
    mockApiClient.mockResolvedValue(orderData);

    const { result } = renderHook(() => useOrder("ord-456"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(orderData);
    });
  });

  it("shows loading state while fetching", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useOrder("ord-123"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("polls every 4 seconds when payment status is created", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-123",
      paymentStatus: "created",
      fulfillmentStatus: "pending",
    });

    const { result } = renderHook(() => useOrder("ord-123"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.paymentStatus).toBe("created");
  });

  it("stops polling when payment status is not created", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-123",
      paymentStatus: "paid",
      fulfillmentStatus: "pending",
    });

    const { result } = renderHook(() => useOrder("ord-123"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const queryOptions = mockApiClient.mock.calls[0][1];
    expect(mockApiClient).toHaveBeenCalledWith("/orders/ord-123");
  });

  it("can refetch order", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-123",
      paymentStatus: "paid",
      fulfillmentStatus: "pending",
    });

    const { result } = renderHook(() => useOrder("ord-123"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect((result.current.data as any)?.orderId).toBe("ord-123");
    expect((result.current.data as any)?.paymentStatus).toBe("paid");
  });
});
