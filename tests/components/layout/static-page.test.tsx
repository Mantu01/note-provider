import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StaticPage } from "@/components/layout/static-page";

describe("StaticPage", () => {
  it("renders title", () => {
    render(<StaticPage title="About Us" description="Learn about us">Content</StaticPage>);
    expect(screen.getByText("About Us")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<StaticPage title="T" description="Our description">C</StaticPage>);
    expect(screen.getByText("Our description")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(<StaticPage title="T" description="D"><p>Body text</p></StaticPage>);
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });

  it("has Information eyebrow label", () => {
    render(<StaticPage title="T" description="D">C</StaticPage>);
    expect(screen.getByText("Information")).toBeInTheDocument();
  });

  it("applies card wrapper around children", () => {
    const { container } = render(
      <StaticPage title="T" description="D"><p>Content</p></StaticPage>
    );
    expect(container.querySelector('[role="article"], .rounded-2xl')).toBeInTheDocument();
  });

  it("renders with long title", () => {
    render(
      <StaticPage
        title="A very long title that should still render properly in the layout"
        description="A longer description that provides context about the page content"
      >
        <p>Main content</p>
      </StaticPage>
    );
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });
});
