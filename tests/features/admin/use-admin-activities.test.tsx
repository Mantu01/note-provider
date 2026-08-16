import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAdminActivities } from "@/features/admin/api/use-admin-activities";

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
      activities: vi.fn((params: unknown) => ["admin", "activities", params]),
    },
  },
}));

const { apiClient } = await import("@/lib/api-client");
const mockApiClient = vi.mocked(apiClient);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAdminActivities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches admin activities with default params", async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    });

    const { result } = renderHook(() => useAdminActivities(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/admin/activities");
  });

  it("appends search param to URL", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    renderHook(() => useAdminActivities({ q: "note" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/activities?q=note");
    });
  });

  it("appends action filter", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    renderHook(() => useAdminActivities({ action: "note.create" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/activities?action=note.create");
    });
  });

  it("appends targetType filter", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    renderHook(() => useAdminActivities({ targetType: "note" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/activities?targetType=note");
    });
  });

  it("appends adminId filter", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    renderHook(() => useAdminActivities({ adminId: "admin-1" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/activities?adminId=admin-1");
    });
  });

  it("appends date range params", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    renderHook(() => useAdminActivities({ from: "2026-01-01", to: "2026-08-15" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/activities?from=2026-01-01&to=2026-08-15");
    });
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Failed to fetch activities"));

    const { result } = renderHook(() => useAdminActivities(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("returns activities data on success", async () => {
    const activitiesData = {
      items: [{ id: "1", action: "note.create", description: "Created note" }],
      pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
    };
    mockApiClient.mockResolvedValue(activitiesData);

    const { result } = renderHook(() => useAdminActivities(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data?.items).toEqual(activitiesData.items);
    });
  });
});
