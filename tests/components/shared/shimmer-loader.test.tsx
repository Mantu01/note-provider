import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShimmerLoader, ShimmerNoteCard, ShimmerStatCard } from "@/components/shared/shimmer-loader";

describe("ShimmerLoader", () => {
  it("renders a div with shimmer-premium class", () => {
    const { container } = render(<ShimmerLoader />);
    const el = container.querySelector('div.shimmer-premium');
    expect(el).toBeInTheDocument();
  });

  it("accepts custom className and merges it", () => {
    const { container } = render(<ShimmerLoader className="h-8 w-32" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-8");
    expect(el).toHaveClass("w-32");
    expect(el).toHaveClass("shimmer-premium");
  });

  it("is aria-hidden", () => {
    const { container } = render(<ShimmerLoader />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("ShimmerNoteCard", () => {
  it("renders a card wrapper with border and rounded classes", () => {
    const { container } = render(<ShimmerNoteCard />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("rounded-2xl");
    expect(card).toHaveClass("border");
  });

  it("contains multiple shimmer placeholders", () => {
    const { container } = render(<ShimmerNoteCard />);
    const shimmerEls = container.querySelectorAll(".shimmer-premium");
    expect(shimmerEls.length).toBeGreaterThan(0);
  });

  it("has an aspect-[16/9] placeholder for the cover image area", () => {
    const { container } = render(<ShimmerNoteCard />);
    const firstShimmer = container.querySelector<HTMLElement>(".shimmer-premium");
    expect(firstShimmer).toHaveClass("aspect-[16/9]");
  });
});

describe("ShimmerStatCard", () => {
  it("renders a centered stat placeholder", () => {
    const { container } = render(<ShimmerStatCard />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("text-center");
    expect(el).toHaveClass("rounded-2xl");
  });

  it("contains shimmer placeholders", () => {
    const { container } = render(<ShimmerStatCard />);
    const shimmerEls = container.querySelectorAll(".shimmer-premium");
    expect(shimmerEls.length).toBeGreaterThan(0);
  });
});
