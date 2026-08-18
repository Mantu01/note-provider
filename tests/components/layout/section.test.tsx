import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/layout/section";

describe("Section", () => {
  it("renders as a section element", () => {
    const { container } = render(<Section data-testid="section">Content</Section>);
    expect((container.firstChild as HTMLElement)?.tagName).toBe("SECTION");
  });

  it("has correct padding classes", () => {
    const { container } = render(<Section data-testid="section">Content</Section>);
    const section = container.firstChild as HTMLElement;
    expect(section).toHaveClass("py-10");
    expect(section).toHaveClass("md:py-14");
  });

  it("passes through children", () => {
    render(
      <Section>
        <span>Section content</span>
      </Section>
    );
    expect(screen.getByText("Section content")).toBeInTheDocument();
  });

  it("wraps children in Container", () => {
    const { container } = render(
      <Section>
        <span>Inner content</span>
      </Section>
    );
    const innerDiv = container.querySelector('[class*="max-w-7xl"]');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv?.textContent).toBe("Inner content");
  });

  it("applies custom className", () => {
    const { container } = render(<Section className="my-section" data-testid="section">Content</Section>);
    const section = container.firstChild as HTMLElement;
    expect(section).toHaveClass("my-section");
    expect(section).toHaveClass("py-10");
  });

  it("passes through additional props", () => {
    render(
      <Section data-testid="section" id="hero-section" aria-label="Hero section">
        Content
      </Section>
    );
    expect(screen.getByTestId("section")).toHaveAttribute("id", "hero-section");
    expect(screen.getByTestId("section")).toHaveAttribute("aria-label", "Hero section");
  });
});
