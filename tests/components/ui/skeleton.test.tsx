import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.tagName).toBe("DIV");
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
  });

  it("has animate-pulse class by default", () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("animate-pulse");
  });

  it("has bg-muted class by default", () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("bg-muted");
  });

  it("has rounded-md class by default", () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("rounded-md");
  });

  it("applies custom className alongside default classes", () => {
    const { container } = render(<Skeleton className="my-skeleton" data-testid="skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("animate-pulse");
    expect(skeleton).toHaveClass("my-skeleton");
  });

  it("passes through additional props", () => {
    render(<Skeleton data-testid="skeleton" aria-label="Loading" role="status" />);
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-label", "Loading");
    expect(screen.getByTestId("skeleton")).toHaveAttribute("role", "status");
  });

  it("can have custom width and height via className", () => {
    const { container } = render(<Skeleton className="w-full h-8" data-testid="skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("w-full");
    expect(skeleton).toHaveClass("h-8");
  });
});
