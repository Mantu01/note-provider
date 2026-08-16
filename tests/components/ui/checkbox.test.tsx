import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Checkbox } from "@/components/ui/checkbox";

describe("Checkbox", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a checkbox element", () => {
    render(<Checkbox data-testid="checkbox" />);
    expect(screen.getByTestId("checkbox")).toBeInTheDocument();
  });

  it("has the correct data-slot attribute", () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.firstChild as HTMLElement;
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
  });

  it("shows check icon when checked", () => {
    render(<Checkbox defaultChecked data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toHaveAttribute("data-checked");
    const checkIcon = checkbox.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Checkbox disabled data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toHaveAttribute("data-disabled");
  });

  it("applies custom className", () => {
    const { container } = render(<Checkbox className="my-checkbox" data-testid="checkbox" />);
    const checkbox = container.firstChild as HTMLElement;
    expect(checkbox).toHaveClass("my-checkbox");
  });
});
