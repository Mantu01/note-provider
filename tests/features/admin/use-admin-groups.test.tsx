import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useAdminGroups,
  useAdminGroup,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
} from "@/features/admin/api/use-admin-groups";

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
      groups: {
        all: ["admin", "groups"] as const,
        list: vi.fn((params: unknown) => ["admin", "groups", "list", params]),
        detail: vi.fn((id: string) => ["admin", "groups", "detail", id]),
      },
      dashboard: ["admin", "dashboard"] as const,
    },
    groups: { all: ["groups"] as const },
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

describe("useAdminGroups", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches admin groups with default params", async () => {
    mockApiClient.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });

    const { result } = renderHook(() => useAdminGroups(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/admin/groups");
  });

  it("appends query params to URL", async () => {
    mockApiClient.mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } });

    renderHook(() => useAdminGroups({ page: 2, limit: 10, q: "react" }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/admin/groups?page=2&limit=10&q=react");
    });
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Forbidden"));

    const { result } = renderHook(() => useAdminGroups(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useAdminGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches single admin group by ID", async () => {
    mockApiClient.mockResolvedValue({
      id: "group-1",
      name: "React Bundle",
      slug: "react-bundle",
    });

    const { result } = renderHook(() => useAdminGroup("group-1"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith("/admin/groups/group-1");
  });

  it("does not fetch when id is empty", () => {
    renderHook(() => useAdminGroup(""), { wrapper: createWrapper() });
    expect(mockApiClient).not.toHaveBeenCalled();
  });
});

describe("useCreateGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new group via POST", async () => {
    mockApiClient.mockResolvedValue({
      id: "group-new",
      name: "New Bundle",
      slug: "new-bundle",
    });

    const { result } = renderHook(() => useCreateGroup(), { wrapper: createWrapper() });

    result.current.mutate({
      name: "New Bundle",
      description: "A new bundle",
      categoryId: "cat-1",
      price: 99900,
      noteIds: ["note-1", "note-2"],
      visibility: "public",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/groups",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("handles creation error", async () => {
    mockApiClient.mockRejectedValue(new Error("Creation failed"));

    const { result } = renderHook(() => useCreateGroup(), { wrapper: createWrapper() });

    result.current.mutate({
      name: "New Bundle",
      description: "Desc",
      categoryId: "cat-1",
      price: 99900,
      noteIds: [],
      visibility: "public",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useUpdateGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a group via PATCH", async () => {
    mockApiClient.mockResolvedValue({
      id: "group-1",
      name: "Updated Bundle",
      slug: "updated-bundle",
    });

    const { result } = renderHook(() => useUpdateGroup("group-1"), { wrapper: createWrapper() });

    result.current.mutate({
      name: "Updated Bundle",
      description: "Updated",
      categoryId: "cat-1",
      price: 79900,
      noteIds: ["note-1"],
      visibility: "public",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/groups/group-1",
      expect.objectContaining({ method: "PATCH" }),
    );
  });
});

describe("useDeleteGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes a group via DELETE", async () => {
    mockApiClient.mockResolvedValue({ deleted: true });

    const { result } = renderHook(() => useDeleteGroup(), { wrapper: createWrapper() });

    result.current.mutate("group-1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/groups/group-1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("handles delete error", async () => {
    mockApiClient.mockRejectedValue(new Error("Delete failed"));

    const { result } = renderHook(() => useDeleteGroup(), { wrapper: createWrapper() });

    result.current.mutate("group-1");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
