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

const { toast } = await import("sonner");
const mockToastError = vi.mocked(toast.error);
const mockToastSuccess = vi.mocked(toast.success);

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

  it("shows validation error from API for invalid file type", async () => {
    const error = new Error("Invalid file type") as any;
    error.status = 400;
    mockApiClient.mockRejectedValue(error);

    const file = new File(["content"], "test.exe", { type: "application/x-executable" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    result.current.mutate({ file, kind: "cover" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockToastError).toHaveBeenCalledWith("Invalid file type");
  });

  it("shows error toast on upload failure", async () => {
    mockApiClient.mockRejectedValue(new Error("Server rejected upload"));

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    result.current.mutate({ file, kind: "cover" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockToastError).toHaveBeenCalledWith("Server rejected upload");
  });

  it("does not show toast on successful upload", async () => {
    mockApiClient.mockResolvedValue({ publicUrl: "https://example.com/img.jpg", publicId: "img_1" });

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    result.current.mutate({ file, kind: "cover" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockToastError).not.toHaveBeenCalled();
  });

  it("handles large file rejection with payload too large error", async () => {
    const error = new Error("Payload too large") as any;
    error.status = 413;
    mockApiClient.mockRejectedValue(error);

    const file = new File(["x".repeat(60 * 1024 * 1024)], "huge.pdf", { type: "application/pdf" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    result.current.mutate({ file, kind: "note_full" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockToastError).toHaveBeenCalledWith("Payload too large");
  });

  it("isIdle before mutation is triggered", async () => {
    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("passes correct FormData entries to apiClient", async () => {
    mockApiClient.mockResolvedValue({ publicUrl: "https://example.com/img.jpg", publicId: "img_1" });

    const file = new File(["test content"], "note.pdf", { type: "application/pdf" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    result.current.mutate({ file, kind: "note_preview" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const callArgs = mockApiClient.mock.calls[0];
    expect(callArgs[0]).toBe("/admin/uploads");
    expect(callArgs[1]?.method).toBe("POST");
    expect(callArgs[1]?.body).toBeInstanceOf(FormData);
  });

  it("mutateAsync throws on API failure", async () => {
    mockApiClient.mockRejectedValue(new Error("API down"));

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

    await expect(result.current.mutateAsync({ file, kind: "cover" })).rejects.toThrow("API down");
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

  it("shows error toast on delete failure", async () => {
    mockApiClient.mockRejectedValue(new Error("Resource not found"));

    const { result } = renderHook(() => useDeleteUpload(), { wrapper: createWrapper() });

    result.current.mutate({ publicId: "img_123", resourceType: "image" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockToastError).toHaveBeenCalledWith("Resource not found");
  });

  it("does not show toast on successful delete", async () => {
    mockApiClient.mockResolvedValue({ deleted: true });

    const { result } = renderHook(() => useDeleteUpload(), { wrapper: createWrapper() });

    result.current.mutate({ publicId: "img_123", resourceType: "image" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockToastError).not.toHaveBeenCalled();
  });

  it("shows loading state during delete", async () => {
    mockApiClient.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useDeleteUpload(), { wrapper: createWrapper() });

    result.current.mutate({ publicId: "img_123", resourceType: "image" });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it("isIdle before mutation is triggered", async () => {
    const { result } = renderHook(() => useDeleteUpload(), { wrapper: createWrapper() });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("mutateAsync throws on API failure", async () => {
    mockApiClient.mockRejectedValue(new Error("Forbidden"));

    const { result } = renderHook(() => useDeleteUpload(), { wrapper: createWrapper() });

    await expect(result.current.mutateAsync({ publicId: "img_123", resourceType: "image" })).rejects.toThrow("Forbidden");
  });
});
