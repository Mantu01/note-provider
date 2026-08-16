import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Switch } from "@/components/ui/switch";

describe("Switch", () => {
  it("renders a switch element with correct data-slot", () => {
    const { container } = render(<Switch data-testid="switch" />);
    const sw = container.firstChild as HTMLElement;
    expect(sw).toHaveAttribute("data-slot", "switch");
  });

  it("renders with default size when no size prop is provided", () => {
    const { container } = render(<Switch data-testid="switch" />);
    const sw = container.firstChild as HTMLElement;
    expect(sw).toHaveAttribute("data-size", "default");
  });

  it("renders with sm size when size prop is sm", () => {
    const { container } = render(<Switch size="sm" data-testid="switch" />);
    const sw = container.firstChild as HTMLElement;
    expect(sw).toHaveAttribute("data-size", "sm");
  });

  it("applies custom className", () => {
    const { container } = render(<Switch className="my-switch" data-testid="switch" />);
    const sw = container.firstChild as HTMLElement;
    expect(sw).toHaveClass("my-switch");
  });

  it("can be toggled", async () => {
    const user = userEvent.setup();
    render(<Switch defaultChecked data-testid="switch" />);
    const sw = screen.getByTestId("switch");
    expect(sw).toHaveAttribute("data-checked");
    await user.click(sw);
    expect(sw).not.toHaveAttribute("data-checked");
  });
});
