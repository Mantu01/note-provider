import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/admin/api/use-admin-categories";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    admin: {
      categories: ["admin", "categories"] as const,
    },
    categories: { all: ["categories"] as const },
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
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

describe("useAdminCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches admin categories", async () => {
    mockApiClient.mockResolvedValue({
      items: [
        { id: "cat-1", name: "Web Development", slug: "web-dev" },
        { id: "cat-2", name: "DSA", slug: "dsa" },
      ],
    });

    const { result } = renderHook(() => useAdminCategories(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/admin/categories");
  });

  it("returns categories array", async () => {
    const categoriesData = {
      items: [
        { id: "cat-1", name: "React", slug: "react", noteCount: 5 },
      ],
    };
    mockApiClient.mockResolvedValue(categoriesData);

    const { result } = renderHook(() => useAdminCategories(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data?.items).toEqual(categoriesData.items);
    });
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Failed to load categories"));

    const { result } = renderHook(() => useAdminCategories(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useCreateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a category via POST", async () => {
    mockApiClient.mockResolvedValue({
      id: "cat-new",
      name: "New Category",
      slug: "new-category",
    });

    const { result } = renderHook(() => useCreateCategory(), { wrapper: createWrapper() });

    result.current.mutate({ name: "New Category", description: "Desc", icon: "BookOpen", order: 0 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/categories",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("handles creation error", async () => {
    mockApiClient.mockRejectedValue(new Error("Creation failed"));

    const { result } = renderHook(() => useCreateCategory(), { wrapper: createWrapper() });

    result.current.mutate({ name: "Test", description: "", icon: "BookOpen", order: 0 });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useUpdateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a category via PATCH", async () => {
    mockApiClient.mockResolvedValue({
      id: "cat-1",
      name: "Updated Category",
      slug: "updated-category",
    });

    const { result } = renderHook(() => useUpdateCategory("cat-1"), { wrapper: createWrapper() });

    result.current.mutate({ name: "Updated Category", description: "New desc", icon: "Code2", order: 1 } as any);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/categories/cat-1",
      expect.objectContaining({ method: "PATCH" }),
    );
  });
});

describe("useDeleteCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes a category via DELETE", async () => {
    mockApiClient.mockResolvedValue({ deleted: true });

    const { result } = renderHook(() => useDeleteCategory(), { wrapper: createWrapper() });

    result.current.mutate("cat-1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/categories/cat-1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("handles refusal response", async () => {
    mockApiClient.mockResolvedValue({ refused: true, conflictMessage: "Category is in use" });

    const { result } = renderHook(() => useDeleteCategory(), { wrapper: createWrapper() });

    result.current.mutate("cat-1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("handles delete error", async () => {
    mockApiClient.mockRejectedValue(new Error("Delete failed"));

    const { result } = renderHook(() => useDeleteCategory(), { wrapper: createWrapper() });

    result.current.mutate("cat-1");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
