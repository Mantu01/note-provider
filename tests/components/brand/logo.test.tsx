import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/brand/logo";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

describe("Logo", () => {
  it("renders with default full variant", () => {
    render(<Logo />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  it("renders with icon variant (no wordmark)", () => {
    render(<Logo variant="icon" />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  it("renders with wordmark variant (no icon)", () => {
    render(<Logo variant="wordmark" />);
    expect(screen.queryByAltText("logo")).not.toBeInTheDocument();
  });

  it("renders with sm size", () => {
    const { container } = render(<Logo size="sm" />);
    const img = container.querySelector('img');
    expect(img).toHaveClass("size-8");
    expect(img).toHaveClass("rounded-lg");
  });

  it("renders with md size", () => {
    const { container } = render(<Logo size="md" />);
    const img = container.querySelector('img');
    expect(img).toHaveClass("size-10");
    expect(img).toHaveClass("rounded-xl");
  });

  it("renders with lg size", () => {
    const { container } = render(<Logo size="lg" />);
    const img = container.querySelector('img');
    expect(img).toHaveClass("size-12");
    expect(img).toHaveClass("rounded-2xl");
  });

  it("defaults to md size", () => {
    const { container } = render(<Logo />);
    const img = container.querySelector('img');
    expect(img).toHaveClass("size-10");
    expect(img).toHaveClass("rounded-xl");
  });

  it("renders as a link when href is provided", () => {
    render(<Logo href="/about" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveAttribute("aria-label", "Notes Provider home");
  });

  it("defaults href to /", () => {
    render(<Logo />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("does not render as a link when href is null", () => {
    const { container } = render(<Logo href={null} />);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
  });

  it("applies custom className to the wrapper span", () => {
    const { container } = render(<Logo className="custom-logo" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass("custom-logo");
  });

  it("applies flex and items-center classes to the wrapper span", () => {
    const { container } = render(<Logo />);
    const span = container.querySelector('span');
    expect(span).toHaveClass("flex");
    expect(span).toHaveClass("items-center");
  });
});
