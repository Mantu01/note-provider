import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "@/components/layout/container";

describe("Container", () => {
  it("renders as a div", () => {
    const { container } = render(<Container data-testid="container">Content</Container>);
    expect((container.firstChild as HTMLElement)?.tagName).toBe("DIV");
  });

  it("has correct default max-width classes", () => {
    const { container } = render(<Container data-testid="container">Content</Container>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("max-w-7xl");
    expect(div).toHaveClass("mx-auto");
    expect(div).toHaveClass("w-full");
  });

  it("has responsive padding classes", () => {
    const { container } = render(<Container data-testid="container">Content</Container>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("px-4");
    expect(div).toHaveClass("sm:px-6");
    expect(div).toHaveClass("lg:px-8");
  });

  it("passes through children", () => {
    render(
      <Container>
        <span>Child content</span>
      </Container>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("applies custom className alongside default classes", () => {
    const { container } = render(
      <Container className="my-container" data-testid="container">Content</Container>
    );
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("my-container");
    expect(div).toHaveClass("max-w-7xl");
  });

  it("passes through additional props", () => {
    render(
      <Container data-testid="container" id="main-container" aria-label="Main container">
        Content
      </Container>
    );
    expect(screen.getByTestId("container")).toHaveAttribute("id", "main-container");
    expect(screen.getByTestId("container")).toHaveAttribute("aria-label", "Main container");
  });
});
