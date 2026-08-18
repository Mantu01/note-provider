import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CheckoutContent from "@/app/(public)/checkout/[slug]/page";

const mockUseParams = vi.fn();
const mockSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: (...args: any[]) => mockUseParams(...args),
  useSearchParams: (...args: any[]) => mockSearchParams(...args),
}));

vi.mock("@/features/checkout/components/checkout-page", () => ({
  CheckoutPage: ({ slug, itemType }: { slug: string; itemType?: string }) => (
    <div data-testid="checkout">{`${slug}-${itemType || "note"}`}</div>
  ),
}));

describe("CheckoutContent", () => {
  it("passes slug param to CheckoutPage", () => {
    mockUseParams.mockReturnValue({ slug: "test-note" });
    mockSearchParams.mockReturnValue(new URLSearchParams());
    render(<CheckoutContent />);
    expect(screen.getByTestId("checkout")).toHaveTextContent("test-note-note");
  });

  it("defaults itemType to note when no query param", () => {
    mockUseParams.mockReturnValue({ slug: "my-note" });
    mockSearchParams.mockReturnValue(new URLSearchParams());
    render(<CheckoutContent />);
    expect(screen.getByTestId("checkout")).toBeInTheDocument();
  });

  it("passes itemType=group when search param present", () => {
    mockUseParams.mockReturnValue({ slug: "my-bundle" });
    mockSearchParams.mockReturnValue(new URLSearchParams("itemType=group"));
    render(<CheckoutContent />);
    expect(screen.getByTestId("checkout")).toHaveTextContent("my-bundle-group");
  });
});
