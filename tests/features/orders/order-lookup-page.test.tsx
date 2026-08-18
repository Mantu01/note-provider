import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderLookupPage } from "@/features/orders/components/order-lookup-page";

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    useRouter: vi.fn(() => ({ push: vi.fn() })),
    useParams: vi.fn(() => ({})),
    useSearchParams: vi.fn(() => new URLSearchParams()),
  };
});

vi.mock("@/features/orders/api/use-order-lookup", () => ({
  useOrderLookup: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), loading: vi.fn() },
}));

const { useOrderLookup } = await import("@/features/orders/api/use-order-lookup");
const mockUseOrderLookup = vi.mocked(useOrderLookup);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("OrderLookupPage", () => {
  it("renders heading and description", () => {
    mockUseOrderLookup.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);
    render(<OrderLookupPage />);
    expect(screen.getByRole("heading", { name: /Track Your Order/i })).toBeInTheDocument();
    expect(screen.getByText(/Enter your order number/i)).toBeInTheDocument();
  });

  it("renders input field with placeholder", () => {
    mockUseOrderLookup.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);
    render(<OrderLookupPage />);
    const input = screen.getByPlaceholderText(/NP-/i);
    expect(input).toBeInTheDocument();
  });

  it("renders search submit button", () => {
    mockUseOrderLookup.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);
    render(<OrderLookupPage />);
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
  });

  it("show loading spinner on submit when pending", () => {
    mockUseOrderLookup.mockReturnValue({ mutate: vi.fn(), isPending: true } as any);
    render(<OrderLookupPage />);
    const searchBtn = document.querySelector("button[type=\"submit\"]");
    expect(searchBtn).toBeInTheDocument();
    expect(searchBtn).toBeDisabled();
  });

  it("calls mutate with order number on form submit", async () => {
    const mutate = vi.fn();
    mockUseOrderLookup.mockReturnValue({ mutate, isPending: false } as any);

    render(<OrderLookupPage />);
    const input = screen.getByPlaceholderText(/NP-/i);
    const user = (await import("@testing-library/user-event")).userEvent;
    await user.type(input, "NP-20260817-0001");
    await user.click(screen.getByText(/Search/i));
    expect(mutate).toHaveBeenCalledWith("NP-20260817-0001", expect.objectContaining({}));
  });

  it("navigates to order page on success", async () => {
    const push = vi.fn();
    const navModule = await import("next/navigation");
    const useRouter = vi.mocked(navModule.useRouter);
    useRouter.mockReturnValue({ push } as any);

    const mutate = vi.fn((val, opts: any) => {
      opts.onSuccess({ orderId: "ord-1", orderNumber: "NP-20260817-0001" });
    });
    mockUseOrderLookup.mockReturnValue({ mutate, isPending: false } as any);

    render(<OrderLookupPage />);
    const input = screen.getByPlaceholderText(/NP-/i);
    const user = (await import("@testing-library/user-event")).userEvent;
    await user.type(input, "NP-20260817-0001");
    await user.click(screen.getByText(/Search/i));
    expect(push).toHaveBeenCalledWith("/order/ord-1");
  });

  it("shows error toast on mutation failure", async () => {
    const toast = await import("sonner");
    const errorMock = vi.fn();
    (toast.toast.error as any).mockImplementation(errorMock);

    const mutate = vi.fn((val, opts: any) => {
      opts.onError(new Error("Order not found"));
    });
    mockUseOrderLookup.mockReturnValue({ mutate, isPending: false } as any);

    render(<OrderLookupPage />);
    const input = screen.getByPlaceholderText(/NP-/i);
    const user = (await import("@testing-library/user-event")).userEvent;
    await user.type(input, "NP-BAD");
    await user.click(screen.getByText(/Search/i));
    expect(errorMock).toHaveBeenCalled();
  });

  it("displays validation error for empty input", async () => {
    mockUseOrderLookup.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);
    render(<OrderLookupPage />);
    const user = (await import("@testing-library/user-event")).userEvent;
    await user.click(screen.getByText(/Search/i));
    expect(screen.getByText(/Please enter your order number/i)).toBeInTheDocument();
  });

  it("renders info tooltip with ShieldCheck icon", () => {
    mockUseOrderLookup.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);
    render(<OrderLookupPage />);
    expect(screen.getByText(/Orders stay pending/i)).toBeInTheDocument();
  });
});
