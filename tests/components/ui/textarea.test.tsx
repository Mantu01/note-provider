import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  it("renders a textarea element with correct data-slot", () => {
    const { container } = render(<Textarea data-testid="textarea" />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("data-slot", "textarea");
  });

  it("renders with placeholder text", () => {
    render(<Textarea placeholder="Enter your message..." data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("placeholder", "Enter your message...");
  });

  it("applies default styling classes", () => {
    const { container } = render(<Textarea data-testid="textarea" />);
    const textarea = container.querySelector("textarea") as HTMLElement;
    expect(textarea).toHaveClass("w-full");
    expect(textarea).toHaveClass("rounded-lg");
    expect(textarea).toHaveClass("border");
    expect(textarea).toHaveClass("bg-transparent");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Textarea className="my-custom-textarea" data-testid="textarea" />
    );
    const textarea = container.querySelector("textarea") as HTMLElement;
    expect(textarea).toHaveClass("my-custom-textarea");
  });

  it("passes through additional props", () => {
    render(
      <Textarea
        data-testid="textarea"
        id="my-textarea"
        name="message"
        rows={5}
        defaultValue="Hello"
      />
    );
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("id", "my-textarea");
    expect(textarea).toHaveAttribute("name", "message");
    expect(textarea).toHaveAttribute("rows", "5");
    expect(textarea).toHaveValue("Hello");
  });

  it("is disabled when disabled prop is set", () => {
    const { container } = render(<Textarea disabled data-testid="textarea" />);
    const textarea = container.querySelector("textarea") as HTMLElement;
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("disabled:cursor-not-allowed");
    expect(textarea).toHaveClass("disabled:opacity-50");
  });

  it("handles input changes", async () => {
    const onChange = vi.fn((e) => e.target.value);
    render(<Textarea onChange={onChange} data-testid="textarea" />);
    const user = userEvent.setup();
    const textarea = screen.getByTestId("textarea");
    await user.type(textarea, "Hello world");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows value after typing", async () => {
    render(<Textarea data-testid="textarea" />);
    const user = userEvent.setup();
    const textarea = screen.getByTestId("textarea");
    await user.type(textarea, "Test input");
    expect(textarea).toHaveValue("Test input");
  });

  it("has correct min-height class", () => {
    const { container } = render(<Textarea data-testid="textarea" />);
    const textarea = container.querySelector("textarea") as HTMLElement;
    expect(textarea).toHaveClass("min-h-16");
  });

  it("is readable accessible with label", () => {
    render(
      <div>
        <label htmlFor="comment">Comment</label>
        <Textarea id="comment" data-testid="textarea" />
      </div>
    );
    expect(screen.getByText("Comment")).toBeInTheDocument();
    expect(screen.getByTestId("textarea")).toHaveAttribute("id", "comment");
  });
});
