import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGroups } from "@/features/groups/api/use-groups";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
  buildQueryString: vi.fn((params: Record<string, unknown>) => {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
    return entries.length ? "?" + entries.map(([k, v]) => `${k}=${v}`).join("&") : "";
  }),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    groups: {
      list: vi.fn((params: unknown) => ["groups", "list", params]),
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

describe("useGroups", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches groups with default params", async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/groups");
  });

  it("appends query string with params", async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });

    renderHook(() => useGroups({ page: 2, limit: 6 }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/groups?page=2&limit=6");
    });
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Failed to fetch groups"));

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("returns groups data on success", async () => {
    const groupsData = {
      items: [{ id: "1", name: "React Bundle", slug: "react-bundle" }],
      pagination: { total: 1, page: 1, limit: 12, totalPages: 1 },
    };
    mockApiClient.mockResolvedValue(groupsData);

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(groupsData);
    });
  });

  it("shows loading state while fetching", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("supports page and limit params", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } });

    renderHook(() => useGroups({ page: 3, limit: 5 }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/groups?page=3&limit=5");
    });
  });
});
