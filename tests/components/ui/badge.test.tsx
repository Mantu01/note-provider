import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, badgeVariants } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders as a span with default variant", () => {
    const { container } = render(<Badge data-testid="badge">Badge</Badge>);
    const span = container.firstChild as HTMLElement;
    expect(span.tagName).toBe("SPAN");
    expect(span).toHaveAttribute("data-slot", "badge");
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    const { container } = render(<Badge data-testid="badge">Default</Badge>);
    const span = container.firstChild as HTMLElement;
    expect(span).toHaveClass("bg-primary");
    expect(span).toHaveClass("text-primary-foreground");
    expect(span).toHaveClass("shadow-sm");
  });

  it("applies secondary variant classes", () => {
    const { container } = render(<Badge variant="secondary" data-testid="badge">Secondary</Badge>);
    const span = container.firstChild as HTMLElement;
    expect(span).toHaveClass("bg-secondary");
    expect(span).toHaveClass("text-secondary-foreground");
    expect(span).toHaveClass("border-border/50");
  });

  it("applies destructive variant classes", () => {
    const { container } = render(<Badge variant="destructive" data-testid="badge">Destructive</Badge>);
    const span = container.firstChild as HTMLElement;
    expect(span).toHaveClass("bg-destructive");
    expect(span).toHaveClass("text-destructive-foreground");
  });

  it("applies outline variant classes", () => {
    const { container } = render(<Badge variant="outline" data-testid="badge">Outline</Badge>);
    const span = container.firstChild as HTMLElement;
    expect(span).toHaveClass("border-border");
    expect(span).toHaveClass("text-foreground");
  });

  it("applies ghost variant classes", () => {
    const { container } = render(<Badge variant="ghost" data-testid="badge">Ghost</Badge>);
    const span = container.firstChild as HTMLElement;
    expect(span).toHaveClass("text-muted-foreground");
  });

  it("applies link variant classes", () => {
    const { container } = render(<Badge variant="link" data-testid="badge">Link</Badge>);
    const span = container.firstChild as HTMLElement;
    expect(span).toHaveClass("text-primary");
    expect(span).toHaveClass("underline-offset-4");
  });

  it("applies custom className", () => {
    const { container } = render(<Badge className="my-custom-badge" data-testid="badge">Custom</Badge>);
    const span = container.firstChild as HTMLElement;
    expect(span).toHaveClass("my-custom-badge");
  });

  it("passes through additional props", () => {
    render(<Badge data-testid="badge" id="my-badge" title="My Badge">Content</Badge>);
    expect(screen.getByTestId("badge")).toHaveAttribute("id", "my-badge");
    expect(screen.getByTestId("badge")).toHaveAttribute("title", "My Badge");
  });

  it("renders with icon", () => {
    const { container } = render(
      <Badge>
        <svg className="size-3" data-testid="badge-icon" />
        Badge with icon
      </Badge>
    );
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    expect(screen.getByText("Badge with icon")).toBeInTheDocument();
  });
});

describe("badgeVariants", () => {
  it("returns correct classes for default variant", () => {
    const classes = badgeVariants({ variant: "default" });
    expect(classes).toContain("bg-primary");
    expect(classes).toContain("text-primary-foreground");
  });

  it("returns correct classes for destructive variant", () => {
    const classes = badgeVariants({ variant: "destructive" });
    expect(classes).toContain("bg-destructive");
    expect(classes).toContain("text-destructive-foreground");
  });
});
