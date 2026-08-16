import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card";

describe("Card", () => {
  it("renders with default size when no size prop is provided", () => {
    const { container } = render(<Card data-testid="card">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute("data-size", "default");
  });

  it("renders with sm size when size prop is sm", () => {
    const { container } = render(<Card size="sm" data-testid="card">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute("data-size", "sm");
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="my-custom-class" data-testid="card">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("my-custom-class");
  });

  it("passes through additional props", () => {
    render(<Card data-testid="card" id="my-card">Content</Card>);
    expect(screen.getByTestId("card")).toHaveAttribute("id", "my-card");
  });
});

describe("CardHeader", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<CardHeader data-testid="header">Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header.tagName).toBe("DIV");
    expect(header).toHaveAttribute("data-slot", "card-header");
  });

  it("applies custom className", () => {
    const { container } = render(<CardHeader className="my-header" data-testid="header">Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass("my-header");
  });

  it("passes through additional props", () => {
    render(<CardHeader data-testid="header" id="header-1">Header</CardHeader>);
    expect(screen.getByTestId("header")).toHaveAttribute("id", "header-1");
  });
});

describe("CardTitle", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<CardTitle data-testid="title">Title</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title.tagName).toBe("DIV");
    expect(title).toHaveAttribute("data-slot", "card-title");
  });

  it("displays the title text", () => {
    render(<CardTitle>My Card Title</CardTitle>);
    expect(screen.getByText("My Card Title")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<CardTitle className="my-title" data-testid="title">Title</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass("my-title");
  });
});

describe("CardDescription", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<CardDescription data-testid="desc">Description</CardDescription>);
    const desc = container.firstChild as HTMLElement;
    expect(desc.tagName).toBe("DIV");
    expect(desc).toHaveAttribute("data-slot", "card-description");
  });

  it("displays the description text", () => {
    render(<CardDescription>My Description</CardDescription>);
    expect(screen.getByText("My Description")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<CardDescription className="my-desc" data-testid="desc">Description</CardDescription>);
    const desc = container.firstChild as HTMLElement;
    expect(desc).toHaveClass("my-desc");
  });
});

describe("CardAction", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<CardAction data-testid="action">Action</CardAction>);
    const action = container.firstChild as HTMLElement;
    expect(action.tagName).toBe("DIV");
    expect(action).toHaveAttribute("data-slot", "card-action");
  });

  it("displays the action content", () => {
    render(<CardAction>My Action</CardAction>);
    expect(screen.getByText("My Action")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<CardAction className="my-action" data-testid="action">Action</CardAction>);
    const action = container.firstChild as HTMLElement;
    expect(action).toHaveClass("my-action");
  });
});

describe("CardContent", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<CardContent data-testid="content">Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content.tagName).toBe("DIV");
    expect(content).toHaveAttribute("data-slot", "card-content");
  });

  it("displays the content", () => {
    render(<CardContent>My Card Content</CardContent>);
    expect(screen.getByText("My Card Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<CardContent className="my-content" data-testid="content">Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass("my-content");
  });
});

describe("CardFooter", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<CardFooter data-testid="footer">Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer.tagName).toBe("DIV");
    expect(footer).toHaveAttribute("data-slot", "card-footer");
  });

  it("displays the footer content", () => {
    render(<CardFooter>My Card Footer</CardFooter>);
    expect(screen.getByText("My Card Footer")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<CardFooter className="my-footer" data-testid="footer">Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass("my-footer");
  });
});

describe("Card full structure", () => {
  it("renders all card sections in correct order", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveAttribute("data-size", "default");
  });

  it("renders card with sm size and all sections", () => {
    const { container } = render(
      <Card size="sm">
        <CardHeader>
          <CardTitle>SM Title</CardTitle>
          <CardDescription>SM Description</CardDescription>
        </CardHeader>
        <CardContent>SM Body</CardContent>
        <CardFooter>SM Footer</CardFooter>
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute("data-size", "sm");
    expect(screen.getByText("SM Title")).toBeInTheDocument();
    expect(screen.getByText("SM Description")).toBeInTheDocument();
    expect(screen.getByText("SM Body")).toBeInTheDocument();
    expect(screen.getByText("SM Footer")).toBeInTheDocument();
  });
});
