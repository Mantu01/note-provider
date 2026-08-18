import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CheckoutContent from "@/features/checkout/components/checkout-page-wrapper";

vi.mock("@/features/notes/api/use-note", () => ({
  useNote: vi.fn(() => ({ isPending: false, isError: false, data: undefined, refetch: vi.fn() })),
}));

vi.mock("@/features/groups/api/use-group", () => ({
  useGroup: vi.fn(() => ({ isPending: false, isError: false, data: undefined, refetch: vi.fn() })),
}));

vi.mock("@/features/checkout/api/use-create-order", () => ({
  useCreateOrder: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
}));

vi.mock("react-razorpay", () => ({
  useRazorpay: vi.fn(() => ({ Razorpay: vi.fn(), isLoading: false })),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    useParams: vi.fn(() => ({ slug: "react-notes" })),
    useSearchParams: vi.fn(() => new URLSearchParams("itemType=note")),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      pathname: "/",
      query: {},
    })),
    usePathname: vi.fn(() => "/"),
  };
});

const { useParams, useSearchParams } = await import("next/navigation");
const mockUseParams = vi.mocked(useParams);
const mockUseSearchParams = vi.mocked(useSearchParams);

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderWithProvider(ui: React.ReactElement) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("CheckoutContent (wrapper)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("reads slug from URL params", () => {
    mockUseParams.mockReturnValue({ slug: "react-notes" });
    mockUseSearchParams.mockReturnValue(Object.freeze(new URLSearchParams("itemType=note")) as any);
    renderWithProvider(<CheckoutContent />);
    expect(mockUseParams).toHaveBeenCalledOnce();
  });

  it("defaults to note itemType when no itemType param", () => {
    mockUseParams.mockReturnValue({ slug: "test-slug" });
    mockUseSearchParams.mockReturnValue(Object.freeze(new URLSearchParams() as any));
    renderWithProvider(<CheckoutContent />);
    const params = mockUseSearchParams();
    expect(params.get("itemType")).toBeNull();
  });

  it("sets itemType to group when search param says group", () => {
    mockUseParams.mockReturnValue({ slug: "bundle-1" });
    mockUseSearchParams.mockReturnValue(Object.freeze(new URLSearchParams("itemType=group") as any));
    renderWithProvider(<CheckoutContent />);
    const params = mockUseSearchParams();
    expect(params.get("itemType")).toBe("group");
  });

  it("passes slug and itemType to CheckoutPage", () => {
    mockUseParams.mockReturnValue({ slug: "web-dev-notes" });
    mockUseSearchParams.mockReturnValue(Object.freeze(new URLSearchParams("itemType=note") as any));
    renderWithProvider(<CheckoutContent />);
    expect(mockUseParams).toHaveBeenCalledTimes(1);
    expect(mockUseSearchParams).toHaveBeenCalledTimes(1);
  });

  it("renders without crashing with missing search params", () => {
    mockUseParams.mockReturnValue({ slug: "my-note" });
    mockUseSearchParams.mockReturnValue(Object.freeze(new URLSearchParams() as any));
    const { container } = renderWithProvider(<CheckoutContent />);
    expect(container).toBeInTheDocument();
  });
});
