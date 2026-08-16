import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFileUpload, useDeleteUpload } from "@/features/admin/api/use-upload";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const { apiClient } = await import("@/lib/api-client");
const mockApiClient = vi.mocked(apiClient);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useFileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uploads a file via FormData POST", async () => {
    mockApiClient.mockResolvedValue({
      publicUrl: "https://cdn.example.com/image.jpg",
      publicId: "img_123",
      resourceType: "image",
    });

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    result.current.mutate({ file, kind: "cover" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/uploads",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("handles upload error", async () => {
    mockApiClient.mockRejectedValue(new Error("Upload failed"));

    const file = new File(["content"], "test.pdf", { type: "application/pdf" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    result.current.mutate({ file, kind: "note_full" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("has isPending state during upload", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}));

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    result.current.mutate({ file, kind: "cover" });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("sends correct FormData with file and kind", async () => {
    mockApiClient.mockResolvedValue({ publicUrl: "https://example.com/img.jpg", publicId: "img_1" });

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    result.current.mutate({ file, kind: "note_preview" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const callArgs = mockApiClient.mock.calls[0];
    expect(callArgs[0]).toBe("/admin/uploads");
    expect(callArgs[1]?.method).toBe("POST");
  });

  it("supports all upload kinds", async () => {
    mockApiClient.mockResolvedValue({ publicUrl: "https://example.com/file.pdf", publicId: "file_1" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    result.current.mutate({ file, kind: "note_full" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useDeleteUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes an upload via DELETE", async () => {
    mockApiClient.mockResolvedValue({ deleted: true });

    const { result } = renderHook(() => useDeleteUpload(), { wrapper: createWrapper() });

    result.current.mutate({ publicId: "img_123", resourceType: "image" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiClient).toHaveBeenCalledWith(
      "/admin/uploads",
      expect.objectContaining({
        method: "DELETE",
        body: JSON.stringify({ publicId: "img_123", resourceType: "image" }),
      }),
    );
  });

  it("handles delete error", async () => {
    mockApiClient.mockRejectedValue(new Error("Delete failed"));

    const { result } = renderHook(() => useDeleteUpload(), { wrapper: createWrapper() });

    result.current.mutate({ publicId: "img_123", resourceType: "raw" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("supports raw resource type", async () => {
    mockApiClient.mockResolvedValue({ deleted: true });

    const { result } = renderHook(() => useDeleteUpload(), { wrapper: createWrapper() });

    result.current.mutate({ publicId: "pdf_456", resourceType: "raw" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const callArgs = mockApiClient.mock.calls[0];
    expect(JSON.parse(callArgs[1]?.body as string)).toEqual({
      publicId: "pdf_456",
      resourceType: "raw",
    });
  });
});
