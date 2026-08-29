import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAdminProfile, useAdminLogin, useAdminLogout } from "@/features/admin/api/use-admin-auth";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

vi.mock("@/lib/query-keys", () => ({
  queryKeys: {
    admin: {
      me: ["admin", "me"] as const,
      dashboard: ["admin", "dashboard"] as const,
    },
  },
}));

const { apiClient } = await import("@/lib/api-client");
const mockApiClient = vi.mocked(apiClient);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useAdminProfile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches admin profile from /admin/auth/me", async () => {
    mockApiClient.mockResolvedValue({ id: "admin-1", name: "Admin User", email: "admin@example.com", isHead: true });
    const { result } = renderHook(() => useAdminProfile(), { wrapper: createWrapper() });
    await waitFor(() => { expect(result.current.isSuccess).toBe(true); });
    expect(mockApiClient).toHaveBeenCalledWith("/admin/auth/me");
  });

  it("returns profile data on success", async () => {
    const profileData = { id: "admin-1", name: "Test Admin", email: "test@example.com", isHead: false };
    mockApiClient.mockResolvedValue(profileData);
    const { result } = renderHook(() => useAdminProfile(), { wrapper: createWrapper() });
    await waitFor(() => { expect(result.current.data).toEqual(profileData); });
  });

  it("handles API error", async () => {
    mockApiClient.mockRejectedValue(new Error("Unauthorized"));
    const { result } = renderHook(() => useAdminProfile(), { wrapper: createWrapper() });
    await waitFor(() => { expect(result.current.isError).toBe(true); });
  });
});

describe("useAdminLogin", () => {
  beforeEach(() => vi.clearAllMocks());

  it("logs in with email and password", async () => {
    mockApiClient.mockResolvedValue({ id: "admin-1", name: "Admin", email: "admin@example.com", isHead: true });
    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });
    result.current.mutate({ email: "admin@example.com", password: "secret123" });
    await waitFor(() => { expect(result.current.isSuccess).toBe(true); });
    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/auth/login",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ email: "admin@example.com", password: "secret123" }) }),
    );
  });

  it("handles wrong credentials returning 401", async () => {
    const error = Object.assign(new Error("Unauthorized"), { status: 401 });
    mockApiClient.mockRejectedValue(error);
    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });
    result.current.mutate({ email: "a@e.com", password: "wrong" });
    await waitFor(() => { expect(result.current.isError).toBe(true); });
  });

  it("has isPending state during login", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}) as any);
    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });
    result.current.mutate({ email: "t@e.com", password: "t" });
    await waitFor(() => { expect(result.current.isPending).toBe(true); });
  });

  it("mutateAsync throws on API failure", async () => {
    mockApiClient.mockRejectedValue(new Error("Connection refused"));
    const { result } = renderHook(() => useAdminLogin(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync({ email: "a@e.com", password: "pw" })).rejects.toThrow("Connection refused");
  });
});

describe("useAdminLogout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("logs out via POST to /admin/auth/logout", async () => {
    mockApiClient.mockResolvedValue({});
    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });
    result.current.mutate(undefined);
    await waitFor(() => { expect(result.current.isSuccess).toBe(true); });
    expect(mockApiClient).toHaveBeenCalledWith("/admin/auth/logout", expect.objectContaining({ method: "POST" }));
  });

  it("handles logout failure", async () => {
    mockApiClient.mockRejectedValue(new Error("Session not found"));
    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });
    result.current.mutate(undefined);
    await waitFor(() => { expect(result.current.isError).toBe(true); });
  });

  it("isIdle before mutation is triggered", async () => {
    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });
    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
  });

  it("mutateAsync throws on API failure", async () => {
    mockApiClient.mockRejectedValue(new Error("No active session"));
    const { result } = renderHook(() => useAdminLogout(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync()).rejects.toThrow("No active session");
  });
});
