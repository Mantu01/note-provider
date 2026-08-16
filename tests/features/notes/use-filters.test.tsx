import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFilters } from "@/features/notes/api/use-filters";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    filters: ["filters"] as const,
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

describe("useFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches filters from /filters endpoint", async () => {
    mockApiClient.mockResolvedValue({
      categories: [
        { slug: "web-dev", name: "Web Development", count: 10 },
        { slug: "dsa", name: "DSA", count: 5 },
      ],
      levels: [
        { value: "beginner", label: "Beginner", count: 8 },
        { value: "intermediate", label: "Intermediate", count: 7 },
      ],
    });

    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/filters");
  });

  it("returns filters data on success", async () => {
    const filtersData = {
      categories: [{ slug: "react", name: "React", count: 5 }],
      levels: [{ value: "beginner", label: "Beginner", count: 3 }],
    };
    mockApiClient.mockResolvedValue(filtersData);

    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(filtersData);
    });
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Failed to load filters"));

    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("shows loading state while fetching", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("can refetch filters", async () => {
    mockApiClient.mockResolvedValue({ categories: [], levels: [] });

    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await result.current.refetch();
    expect(mockApiClient).toHaveBeenCalledTimes(2);
  });

  it("returns empty categories and levels when API returns empty arrays", async () => {
    mockApiClient.mockResolvedValue({ categories: [], levels: [] });

    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data?.categories).toEqual([]);
      expect(result.current.data?.levels).toEqual([]);
    });
  });
});
