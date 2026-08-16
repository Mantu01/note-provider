import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ErrorState } from "@/components/shared/error-state";

describe("ErrorState", () => {
  it("renders with default message", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("We could not load this right now.")).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} message="Custom error message" />);
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
    expect(screen.queryByText("We could not load this right now.")).not.toBeInTheDocument();
  });

  it("renders retry button", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);
    const buttons = document.querySelectorAll('button');
    const retryBtn = Array.from(buttons).find((b) => b.textContent?.includes("Try again"));
    expect(retryBtn).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);
    const buttons = document.querySelectorAll('button');
    const retryBtn = Array.from(buttons).find((b) => b.textContent?.includes("Try again"));
    if (retryBtn) await user.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("renders contact support link", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);
    const supportLink = Array.from(document.querySelectorAll('a, button')).find(
      (el) => el.textContent?.includes("Contact Support")
    );
    expect(supportLink).toBeInTheDocument();
  });
});
