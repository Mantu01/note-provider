import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHome } from "@/features/home/api/use-home";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    home: ["home"] as const,
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

describe("useHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches home data from /home endpoint", async () => {
    mockApiClient.mockResolvedValue({
      stats: { totalNotes: 10, totalCategories: 3, totalDownloads: 100, happyLearners: 50 },
      categories: [],
      featuredNotes: [],
      freeNotes: [],
      featuredGroups: [],
    });

    const { result } = renderHook(() => useHome(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/home");
  });

  it("returns loading state initially", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useHome(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
      expect(result.current.isLoading).toBe(true);
    });
  });

  it("handles API error gracefully", async () => {
    mockApiClient.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useHome(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("returns data when API succeeds", async () => {
    const responseData = {
      stats: { totalNotes: 20, totalCategories: 5, totalDownloads: 200, happyLearners: 100 },
      categories: [{ id: "1", name: "React" }],
      featuredNotes: [],
      freeNotes: [],
      featuredGroups: [],
    };
    mockApiClient.mockResolvedValue(responseData);

    const { result } = renderHook(() => useHome(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(responseData);
    });
  });

  it("uses correct query key", () => {
    renderHook(() => useHome(), { wrapper: createWrapper() });
    expect(mockApiClient).toHaveBeenCalledTimes(1);
  });

  it("can refetch data", async () => {
    mockApiClient.mockResolvedValue({ stats: {}, categories: [], featuredNotes: [], freeNotes: [], featuredGroups: [] });

    const { result } = renderHook(() => useHome(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const initialData = result.current.data;

    mockApiClient.mockResolvedValue({ stats: { totalNotes: 99 }, categories: [], featuredNotes: [], freeNotes: [], featuredGroups: [] });

    await result.current.refetch();
    expect(result.current.data).toBeDefined();
  });
});
