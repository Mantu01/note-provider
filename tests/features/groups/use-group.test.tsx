import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGroup } from "@/features/groups/api/use-group";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    groups: {
      detail: vi.fn((slug: string) => ["groups", "detail", slug]),
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

describe("useGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches group by slug", async () => {
    mockApiClient.mockResolvedValue({
      group: { id: "1", name: "React Bundle", slug: "react-bundle" },
      relatedGroups: [],
    });

    const { result } = renderHook(() => useGroup("react-bundle"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/groups/react-bundle");
  });

  it("does not fetch when slug is empty", () => {
    renderHook(() => useGroup(""), { wrapper: createWrapper() });
    expect(mockApiClient).not.toHaveBeenCalled();
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Group not found"));

    const { result } = renderHook(() => useGroup("nonexistent"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("returns group data on success", async () => {
    const groupData = {
      group: { id: "1", name: "React Bundle", slug: "react-bundle", price: 99900 },
      relatedGroups: [{ id: "2", name: "Node Bundle" }],
    };
    mockApiClient.mockResolvedValue(groupData);

    const { result } = renderHook(() => useGroup("react-bundle"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(groupData);
    });
  });

  it("shows loading state while fetching", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useGroup("react-bundle"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("respects enabled option", () => {
    renderHook(() => useGroup("react-bundle", { enabled: false }), { wrapper: createWrapper() });
    expect(mockApiClient).not.toHaveBeenCalled();
  });

  it("fetches when enabled is explicitly true", async () => {
    mockApiClient.mockResolvedValue({ group: { id: "1" }, relatedGroups: [] });

    const { result } = renderHook(() => useGroup("test-bundle", { enabled: true }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("refetches when slug changes", async () => {
    mockApiClient.mockResolvedValue({ group: { id: "1" }, relatedGroups: [] });

    const { result, rerender } = renderHook(({ slug }) => useGroup(slug), {
      initialProps: { slug: "bundle-1" },
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    mockApiClient.mockResolvedValue({ group: { id: "2" }, relatedGroups: [] });
    rerender({ slug: "bundle-2" });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/groups/bundle-2");
    });
  });
});
