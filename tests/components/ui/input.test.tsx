import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders an input element with correct data-slot", () => {
    const { container } = render(<Input data-testid="input" />);
    const input = container.querySelector("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("renders with specified type", () => {
    const { container } = render(<Input type="email" data-testid="input" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "email");
  });

  it("renders with type password", () => {
    const { container } = render(<Input type="password" data-testid="input" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders with type number", () => {
    const { container } = render(<Input type="number" data-testid="input" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "number");
  });

  it("applies custom className", () => {
    const { container } = render(<Input className="my-custom-input" data-testid="input" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("my-custom-input");
  });

  it("applies default styling classes", () => {
    const { container } = render(<Input data-testid="input" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("h-8");
    expect(input).toHaveClass("w-full");
    expect(input).toHaveClass("rounded-lg");
    expect(input).toHaveClass("border");
  });

  it("passes through additional props", () => {
    render(
      <Input
        data-testid="input"
        id="my-input"
        placeholder="Enter text"
        name="username"
        defaultValue="hello"
      />
    );
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("id", "my-input");
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toHaveAttribute("name", "username");
    expect(input).toHaveAttribute("value", "hello");
  });

  it("is disabled when disabled prop is set", () => {
    const { container } = render(<Input disabled data-testid="input" />);
    const input = container.querySelector("input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:pointer-events-none");
    expect(input).toHaveClass("disabled:cursor-not-allowed");
    expect(input).toHaveClass("disabled:opacity-50");
  });

  it("shows placeholder text", () => {
    render(<Input placeholder="Search..." data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("placeholder", "Search...");
  });

  it("renders with label", () => {
    render(
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" data-testid="input" />
      </div>
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toHaveAttribute("id", "email");
  });
});
