import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

describe("PageHeader", () => {
  it("renders title", () => {
    render(<PageHeader title="Page Title" />);
    expect(screen.getByText("Page Title")).toBeInTheDocument();
  });

  it("renders eyebrow when provided", () => {
    render(<PageHeader eyebrow="Section" title="Title" />);
    expect(screen.getByText("Section")).toBeInTheDocument();
  });

  it("does not render eyebrow when omitted", () => {
    render(<PageHeader title="Title" />);
    expect(screen.queryByText("Section")).not.toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<PageHeader title="T" description="Some description" />);
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    const { container } = render(<PageHeader title="T" />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("renders action prop", () => {
    render(
      <PageHeader title="T" action={<Button>Action</Button>} />
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<PageHeader title="T" className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders as header element", () => {
    const { container } = render(<PageHeader title="T" />);
    const el = container.firstChild as HTMLElement | null;
    expect(el?.tagName).toBe("HEADER");
  });
});
