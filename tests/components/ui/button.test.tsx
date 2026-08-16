import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Button, buttonVariants } from "@/components/ui/button";

describe("Button", () => {
  it("renders as a button element with default variant", () => {
    const { container } = render(<Button data-testid="btn">Click me</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("data-slot", "button");
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders as native button by default", () => {
    const { container } = render(<Button data-testid="btn">Native</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.tagName).toBe("BUTTON");
  });

  it("renders as anchor when render prop is provided", () => {
    const { container } = render(
      <Button render={<a href="/test">Link</a>} data-testid="btn">
        Link
      </Button>
    );
    const first = container.firstChild as HTMLElement;
    expect(first.tagName).toBe("A");
  });

  it("applies default variant classes", () => {
    const { container } = render(<Button data-testid="btn">Default</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("bg-primary");
    expect(btn).toHaveClass("text-primary-foreground");
  });

  it("applies outline variant classes", () => {
    const { container } = render(<Button variant="outline" data-testid="btn">Outline</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("border-border");
    expect(btn).toHaveClass("bg-background");
  });

  it("applies secondary variant classes", () => {
    const { container } = render(<Button variant="secondary" data-testid="btn">Secondary</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("bg-secondary");
    expect(btn).toHaveClass("text-secondary-foreground");
  });

  it("applies ghost variant classes", () => {
    const { container } = render(<Button variant="ghost" data-testid="btn">Ghost</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("text-foreground");
  });

  it("applies destructive variant classes", () => {
    const { container } = render(<Button variant="destructive" data-testid="btn">Delete</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("text-destructive");
  });

  it("applies link variant classes", () => {
    const { container } = render(<Button variant="link" data-testid="btn">Link</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("text-primary");
    expect(btn).toHaveClass("underline-offset-4");
  });

  it("applies default size classes", () => {
    const { container } = render(<Button data-testid="btn">Default Size</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("h-8");
    expect(btn).toHaveClass("gap-1.5");
  });

  it("applies xs size classes", () => {
    const { container } = render(<Button size="xs" data-testid="btn">XS</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("h-6");
    expect(btn).toHaveClass("text-xs");
  });

  it("applies sm size classes", () => {
    const { container } = render(<Button size="sm" data-testid="btn">SM</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("h-7");
  });

  it("applies lg size classes", () => {
    const { container } = render(<Button size="lg" data-testid="btn">LG</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("h-9");
  });

  it("applies icon size classes", () => {
    const { container } = render(<Button size="icon" data-testid="btn">Icon</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("size-8");
  });

  it("applies custom className", () => {
    const { container } = render(<Button className="my-custom-btn" data-testid="btn">Custom</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toHaveClass("my-custom-btn");
  });

  it("passes disabled prop to button", () => {
    const { container } = render(<Button disabled data-testid="btn">Disabled</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass("disabled:pointer-events-none");
    expect(btn).toHaveClass("disabled:opacity-50");
  });

  it("passes through additional props", () => {
    render(<Button data-testid="btn" id="my-btn" type="submit">Submit</Button>);
    const btn = screen.getByTestId("btn");
    expect(btn).toHaveAttribute("id", "my-btn");
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("handles click events", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} data-testid="btn">Click</Button>);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("buttonVariants", () => {
  it("returns correct classes for default variant", () => {
    const classes = buttonVariants({ variant: "default" });
    expect(classes).toContain("bg-primary");
    expect(classes).toContain("text-primary-foreground");
  });

  it("returns correct classes for link variant", () => {
    const classes = buttonVariants({ variant: "link" });
    expect(classes).toContain("text-primary");
    expect(classes).toContain("underline-offset-4");
  });

  it("returns correct classes for icon size", () => {
    const classes = buttonVariants({ size: "icon" });
    expect(classes).toContain("size-8");
  });
});
