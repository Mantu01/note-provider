import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOrderLookup } from "@/features/orders/api/use-order-lookup";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

const { apiClient } = await import("@/lib/api-client");
const mockApiClient = vi.mocked(apiClient);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useOrderLookup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("looks up order by order number", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-123",
      orderNumber: "NP-20260815-0001",
    });

    const { result } = renderHook(() => useOrderLookup(), { wrapper: createWrapper() });

    result.current.mutate("NP-20260815-0001");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/orders/lookup",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ orderNumber: "NP-20260815-0001" }),
      }),
    );
  });

  it("returns orderId and orderNumber on success", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-abc",
      orderNumber: "NP-20260815-0042",
    });

    const { result } = renderHook(() => useOrderLookup(), { wrapper: createWrapper() });

    result.current.mutate("NP-20260815-0042");

    await waitFor(() => {
      expect(result.current.data?.orderId).toBe("ord-abc");
      expect(result.current.data?.orderNumber).toBe("NP-20260815-0042");
    });
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Order not found"));

    const { result } = renderHook(() => useOrderLookup(), { wrapper: createWrapper() });

    result.current.mutate("INVALID-ORDER");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("has isPending state during lookup", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useOrderLookup(), { wrapper: createWrapper() });

    result.current.mutate("NP-20260815-0001");

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("sends correct request body format", async () => {
    mockApiClient.mockResolvedValue({ orderId: "ord-1", orderNumber: "NP-001" });

    const { result } = renderHook(() => useOrderLookup(), { wrapper: createWrapper() });

    result.current.mutate("NP-20260815-0001");

    await waitFor(() => {
      const callArgs = mockApiClient.mock.calls[0];
      expect(callArgs[0]).toBe("/orders/lookup");
      expect(callArgs[1]?.method).toBe("POST");
    });
  });

  it("clears state on new mutation after success", async () => {
    mockApiClient
      .mockResolvedValueOnce({ orderId: "ord-1", orderNumber: "NP-001" })
      .mockResolvedValueOnce({ orderId: "ord-2", orderNumber: "NP-002" });

    const { result } = renderHook(() => useOrderLookup(), { wrapper: createWrapper() });

    result.current.mutate("NP-001");
    await waitFor(() => {
      expect(result.current.data?.orderNumber).toBe("NP-001");
    });

    result.current.mutate("NP-002");
    await waitFor(() => {
      expect(result.current.data?.orderNumber).toBe("NP-002");
    });
  });
});
