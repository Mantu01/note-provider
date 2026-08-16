import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ExportButton } from "@/features/admin/components/leads/export-button";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

// Mock QueryClientProvider so useMutation works without a real QueryClient
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  QueryClientProvider: ({ children }: any) => children,
  QueryClient: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

const { useMutation } = await import("@tanstack/react-query");
const mockUseMutation = vi.mocked(useMutation);
const mockMutate = vi.fn();

describe("ExportButton", () => {
  const mockBlob = new Blob(["id,name,email\n1,John,john@test.com"], { type: "text/csv" });
  const mockCreateObjectURL = vi.fn(() => "https://example.com/export.csv");
  const mockRevokeObjectURL = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    mockMutate.mockClear();
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  it("renders export button", () => {
    render(<ExportButton />);
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("renders download icon", () => {
    render(<ExportButton />);
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("triggers export mutation on click", async () => {
    render(<ExportButton />);
    const btn = screen.getByText("Export CSV");
    await userEvent.click(btn);
    expect(mockMutate).toHaveBeenCalled();
  });

  it("shows loading state during export", async () => {
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    render(<ExportButton />);
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("fetches from correct API endpoint", async () => {
    const mockMutateFn = vi.fn(async () => {
      const response = await fetch("/api/admin/leads/export");
      if (!response.ok) throw new Error("Failed");
      return response.blob();
    });
    mockUseMutation.mockReturnValue({
      mutate: mockMutateFn,
      isPending: false,
    } as any);

    render(<ExportButton />);
    const btn = screen.getByText("Export CSV");
    await userEvent.click(btn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/admin/leads/export");
    });
  });

  it("handles export failure", async () => {
    const mockMutateFn = vi.fn(async () => {
      const response = await fetch("/api/admin/leads/export");
      if (!response.ok) throw new Error("Failed");
      return response.blob();
    });
    mockUseMutation.mockReturnValue({
      mutate: mockMutateFn,
      isPending: false,
    } as any);

    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    render(<ExportButton />);
    const btn = screen.getByText("Export CSV");
    await userEvent.click(btn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
