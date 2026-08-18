import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceTag } from "@/components/shared/price-tag";

describe("PriceTag", () => {
  it("renders the price label", () => {
    render(<PriceTag price={99900} priceLabel="Price" compareAtPrice={null} />);
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("shows compareAtPrice when higher than price", () => {
    render(<PriceTag price={99900} priceLabel="Price" compareAtPrice={199900} />);
    expect(screen.getByText("Price")).toBeInTheDocument();
    const compareAtPriceEl = screen.getByText("₹1,999");
    expect(compareAtPriceEl).toBeInTheDocument();
    expect(compareAtPriceEl).toHaveClass("line-through");
  });

  it("does not show compareAtPrice when lower than price", () => {
    render(<PriceTag price={199900} priceLabel="Price" compareAtPrice={99900} />);
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.queryByText("₹999")).not.toBeInTheDocument();
  });

  it("does not show compareAtPrice when equal to price", () => {
    render(<PriceTag price={99900} priceLabel="Price" compareAtPrice={99900} />);
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.queryByText("₹999")).not.toBeInTheDocument();
  });

  it("does not show compareAtPrice when null", () => {
    render(<PriceTag price={99900} priceLabel="Price" compareAtPrice={null} />);
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.queryByText("₹999")).not.toBeInTheDocument();
  });

  it("shows discount badge when compareAtPrice is higher", () => {
    render(<PriceTag price={99900} priceLabel="Price" compareAtPrice={199900} />);
    expect(screen.getByText("50% OFF")).toBeInTheDocument();
  });

  it("does not show discount badge when compareAtPrice is not higher", () => {
    render(<PriceTag price={199900} priceLabel="Price" compareAtPrice={99900} />);
    expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
  });

  it("does not show discount badge when compareAtPrice is null", () => {
    render(<PriceTag price={99900} priceLabel="Price" compareAtPrice={null} />);
    expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
  });

  it("renders with large size when size prop is large", () => {
    const { container } = render(<PriceTag price={99900} priceLabel="Price" compareAtPrice={null} size="large" />);
    const priceSpan = container.querySelector('span');
    expect(priceSpan).toHaveClass("text-2xl");
    expect(priceSpan).toHaveClass("font-bold");
    expect(priceSpan).toHaveClass("tracking-tight");
  });

  it("renders with default size when size prop is default", () => {
    const { container } = render(<PriceTag price={99900} priceLabel="Price" compareAtPrice={null} size="default" />);
    const priceSpan = container.querySelectorAll('span')[0];
    expect(priceSpan).toHaveClass("text-sm");
    expect(priceSpan).toHaveClass("font-bold");
  });

  it("defaults to default size when no size prop", () => {
    const { container } = render(<PriceTag price={99900} priceLabel="Price" compareAtPrice={null} />);
    const priceSpan = container.querySelectorAll('span')[0];
    expect(priceSpan).toHaveClass("text-sm");
    expect(priceSpan).toHaveClass("font-bold");
  });
});
