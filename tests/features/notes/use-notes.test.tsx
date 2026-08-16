import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotes } from "@/features/notes/api/use-notes";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
  buildQueryString: vi.fn((params: Record<string, unknown>) => {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
    return entries.length ? "?" + entries.map(([k, v]) => `${k}=${v}`).join("&") : "";
  }),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    notes: {
      list: vi.fn((params: unknown) => ["notes", "list", params]),
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

describe("useNotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches notes with default params", async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });

    const { result } = renderHook(() => useNotes({}), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/notes");
  });

  it("appends query string with search params", async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });

    renderHook(() => useNotes({ q: "react", page: 2, limit: 10 }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/notes?q=react&page=2&limit=10");
    });
  });

  it("includes category and level filters in query", async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });

    const { result } = renderHook(() => useNotes({ category: ["web-dev", "dsa"], level: ["beginner"] }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const lastCall = mockApiClient.mock.calls[mockApiClient.mock.calls.length - 1];
    expect(lastCall[0]).toContain("category=web-dev");
    expect(lastCall[0]).toContain("level=beginner");
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Failed to fetch notes"));

    const { result } = renderHook(() => useNotes({}), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("returns notes data on success", async () => {
    const notesData = {
      items: [{ id: "1", title: "React Notes", slug: "react-notes" }],
      pagination: { total: 1, page: 1, limit: 12, totalPages: 1 },
    };
    mockApiClient.mockResolvedValue(notesData);

    const { result } = renderHook(() => useNotes({}), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(notesData);
    });
  });

  it("shows loading state while fetching", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useNotes({}), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("supports sort and pricing params", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } });

    renderHook(() => useNotes({ sort: "price_asc", pricing: "free" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/notes?sort=price_asc&pricing=free");
    });
  });

  it("handles undefined params gracefully", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } });

    const { result } = renderHook(() => useNotes({}), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
