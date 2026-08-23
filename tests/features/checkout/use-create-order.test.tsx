import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateOrder } from "@/features/checkout/api/use-create-order";

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

describe("useCreateOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates order via POST to /orders", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-123",
      orderNumber: "NP-20260815-0001",
      razorpayOrderId: "order_abc",
      amount: 49900,
      razorpayKeyId: "key_test",
      itemTitle: "React Notes",
      buyer: { fullName: "John Doe" },
    });

    const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

    result.current.mutate({
      itemType: "note",
      itemSlug: "react-notes",
      fullName: "John Doe",
      consentAccepted: true,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/orders",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("react-notes"),
      }),
    );
  });

  it("handles successful order creation", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-456",
      orderNumber: "NP-20260815-0002",
      razorpayOrderId: "order_xyz",
      amount: 99900,
      razorpayKeyId: "key_test",
      itemTitle: "Full Stack Bundle",
      buyer: { fullName: "Jane Doe" },
    });

    const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

    result.current.mutate({
      itemType: "group",
      itemSlug: "fullstack-bundle",
      fullName: "Jane Doe",
      consentAccepted: true,
    });

    await waitFor(() => {
      expect(result.current.data?.orderId).toBe("ord-456");
    });
  });

  it("handles API error during order creation", async () => {
    mockApiClient.mockRejectedValue(new Error("Payment service unavailable"));

    const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

    result.current.mutate({
      itemType: "note",
      itemSlug: "react-notes",
      fullName: "John",
      consentAccepted: true,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("has isPending state during mutation", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

    result.current.mutate({
      itemType: "note",
      itemSlug: "test",
      fullName: "Test",
      consentAccepted: true,
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("sends correct body for group item type", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-1", orderNumber: "NP-001", razorpayOrderId: "oid",
      amount: 50000, razorpayKeyId: "key", itemTitle: "Bundle", buyer: { fullName: "Test" },
    });

    const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

    result.current.mutate({
      itemType: "group",
      itemSlug: "bundle-1",
      fullName: "Test User",
      consentAccepted: true,
    });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith(
        "/orders",
        expect.objectContaining({
          body: expect.stringContaining("group"),
        }),
      );
    });
  });

  it("sends correct body for note item type", async () => {
    mockApiClient.mockResolvedValue({
      orderId: "ord-2", orderNumber: "NP-002", razorpayOrderId: "oid2",
      amount: 30000, razorpayKeyId: "key", itemTitle: "Note", buyer: { fullName: "Test" },
    });

    const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

    result.current.mutate({
      itemType: "note",
      itemSlug: "note-1",
      fullName: "Test User",
      consentAccepted: true,
    });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith(
        "/orders",
        expect.objectContaining({
          body: expect.stringContaining("note"),
        }),
      );
    });
  });
});
