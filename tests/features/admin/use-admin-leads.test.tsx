import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAdminLeads } from "@/features/admin/api/use-admin-leads";

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
      leads: vi.fn((params: unknown) => ["admin", "leads", params]),
    },
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

describe("useAdminLeads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches admin leads with default params", async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    });

    const { result } = renderHook(() => useAdminLeads(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/admin/leads");
  });

  it("appends search param to URL", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    renderHook(() => useAdminLeads({ q: "john" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/leads?q=john");
    });
  });

  it("appends paymentStatus param", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    renderHook(() => useAdminLeads({ paymentStatus: "paid" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/leads?paymentStatus=paid");
    });
  });

  it("appends fulfillmentStatus param", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    renderHook(() => useAdminLeads({ fulfillmentStatus: "completed" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/leads?fulfillmentStatus=completed");
    });
  });

  it("appends date range params", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    renderHook(() => useAdminLeads({ from: "2026-01-01", to: "2026-08-15" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/leads?from=2026-01-01&to=2026-08-15");
    });
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Failed to fetch leads"));

    const { result } = renderHook(() => useAdminLeads(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("returns leads data on success", async () => {
    const leadsData = {
      items: [{ id: "1", fullName: "John Doe" }],
      pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
    };
    mockApiClient.mockResolvedValue(leadsData);

    const { result } = renderHook(() => useAdminLeads(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data?.items).toEqual(leadsData.items);
    });
  });
});
