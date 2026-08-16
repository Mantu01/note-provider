import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label", () => {
  it("renders as a label element with correct data-slot", () => {
    const { container } = render(<Label data-testid="label">Label</Label>);
    const label = container.firstChild as HTMLElement;
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("data-slot", "label");
  });

  it("displays the label text", () => {
    render(<Label>My Label</Label>);
    expect(screen.getByText("My Label")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Label className="my-label" data-testid="label">Label</Label>);
    const label = container.firstChild as HTMLElement;
    expect(label).toHaveClass("my-label");
  });

  it("passes through additional props", () => {
    render(<Label data-testid="label" id="label-1">Label</Label>);
    expect(screen.getByTestId("label")).toHaveAttribute("id", "label-1");
  });

  it("can be associated with an input", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="text" />
      </>
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});
