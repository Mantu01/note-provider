import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNote } from "@/features/notes/api/use-note";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    notes: {
      detail: vi.fn((slug: string) => ["notes", "detail", slug]),
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

describe("useNote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches note by slug", async () => {
    mockApiClient.mockResolvedValue({
      note: { id: "1", title: "React Notes", slug: "react-notes" },
      groups: [],
      relatedNotes: [],
    });

    const { result } = renderHook(() => useNote("react-notes"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/notes/react-notes");
  });

  it("does not fetch when slug is empty", () => {
    renderHook(() => useNote(""), { wrapper: createWrapper() });
    expect(mockApiClient).not.toHaveBeenCalled();
  });

  it("does not fetch when slug is undefined", () => {
    renderHook(() => useNote(undefined as unknown as string), { wrapper: createWrapper() });
    expect(mockApiClient).not.toHaveBeenCalled();
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Note not found"));

    const { result } = renderHook(() => useNote("nonexistent"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("returns note data on success", async () => {
    const noteData = {
      note: { id: "1", title: "React Notes", slug: "react-notes" },
      groups: [{ id: "g1", name: "React Bundle" }],
      relatedNotes: [{ id: "2", title: "Next.js Notes" }],
    };
    mockApiClient.mockResolvedValue(noteData);

    const { result } = renderHook(() => useNote("react-notes"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(noteData);
    });
  });

  it("shows loading state while fetching", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useNote("react-notes"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("respects enabled option", () => {
    renderHook(() => useNote("react-notes", { enabled: false }), { wrapper: createWrapper() });
    expect(mockApiClient).not.toHaveBeenCalled();
  });

  it("fetches when enabled is explicitly true", async () => {
    mockApiClient.mockResolvedValue({
      note: { id: "1", title: "Test" },
      groups: [],
      relatedNotes: [],
    });

    const { result } = renderHook(() => useNote("test-note", { enabled: true }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("refetches when slug changes", async () => {
    mockApiClient.mockResolvedValue({ note: { id: "1" }, groups: [], relatedNotes: [] });

    const { result, rerender } = renderHook(({ slug }) => useNote(slug), {
      initialProps: { slug: "note-1" },
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    mockApiClient.mockResolvedValue({ note: { id: "2" }, groups: [], relatedNotes: [] });
    rerender({ slug: "note-2" });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/notes/note-2");
    });
  });
});
