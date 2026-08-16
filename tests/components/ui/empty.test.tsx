import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty";

describe("Empty", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<Empty data-testid="empty">Empty state</Empty>);
    const empty = container.firstChild as HTMLElement;
    expect(empty.tagName).toBe("DIV");
    expect(empty).toHaveAttribute("data-slot", "empty");
  });

  it("applies custom className", () => {
    const { container } = render(<Empty className="my-custom" data-testid="empty">Empty</Empty>);
    const empty = container.firstChild as HTMLElement;
    expect(empty).toHaveClass("my-custom");
  });

  it("passes through additional props", () => {
    render(<Empty data-testid="empty" id="empty-1">Empty</Empty>);
    expect(screen.getByTestId("empty")).toHaveAttribute("id", "empty-1");
  });
});

describe("EmptyHeader", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<EmptyHeader data-testid="header">Header</EmptyHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header.tagName).toBe("DIV");
    expect(header).toHaveAttribute("data-slot", "empty-header");
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyHeader className="my-header" data-testid="header">Header</EmptyHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass("my-header");
  });
});

describe("EmptyMedia", () => {
  it("renders with default variant", () => {
    const { container } = render(<EmptyMedia data-testid="media">Media</EmptyMedia>);
    const media = container.firstChild as HTMLElement;
    expect(media).toHaveAttribute("data-slot", "empty-icon");
    expect(media).toHaveAttribute("data-variant", "default");
  });

  it("renders with icon variant", () => {
    const { container } = render(<EmptyMedia variant="icon" data-testid="media">Media</EmptyMedia>);
    const media = container.firstChild as HTMLElement;
    expect(media).toHaveAttribute("data-variant", "icon");
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyMedia className="my-media" data-testid="media">Media</EmptyMedia>);
    const media = container.firstChild as HTMLElement;
    expect(media).toHaveClass("my-media");
  });
});

describe("EmptyTitle", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<EmptyTitle data-testid="title">Title</EmptyTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title.tagName).toBe("DIV");
    expect(title).toHaveAttribute("data-slot", "empty-title");
  });

  it("displays the title text", () => {
    render(<EmptyTitle>My Empty Title</EmptyTitle>);
    expect(screen.getByText("My Empty Title")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyTitle className="my-title" data-testid="title">Title</EmptyTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass("my-title");
  });
});

describe("EmptyDescription", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<EmptyDescription data-testid="desc">Description</EmptyDescription>);
    const desc = container.firstChild as HTMLElement;
    expect(desc.tagName).toBe("DIV");
    expect(desc).toHaveAttribute("data-slot", "empty-description");
  });

  it("displays the description text", () => {
    render(<EmptyDescription>My Empty Description</EmptyDescription>);
    expect(screen.getByText("My Empty Description")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyDescription className="my-desc" data-testid="desc">Description</EmptyDescription>);
    const desc = container.firstChild as HTMLElement;
    expect(desc).toHaveClass("my-desc");
  });
});

describe("EmptyContent", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<EmptyContent data-testid="content">Content</EmptyContent>);
    const content = container.firstChild as HTMLElement;
    expect(content.tagName).toBe("DIV");
    expect(content).toHaveAttribute("data-slot", "empty-content");
  });

  it("displays the content", () => {
    render(<EmptyContent>My Empty Content</EmptyContent>);
    expect(screen.getByText("My Empty Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyContent className="my-content" data-testid="content">Content</EmptyContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass("my-content");
  });
});

describe("Empty full structure", () => {
  it("renders all empty components together", () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><svg data-testid="icon" /></EmptyMedia>
          <EmptyTitle>Nothing Here</EmptyTitle>
          <EmptyDescription>No results found.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <span>Try a different search</span>
        </EmptyContent>
      </Empty>
    );
    expect(screen.getByText("Nothing Here")).toBeInTheDocument();
    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.getByText("Try a different search")).toBeInTheDocument();
  });
});
