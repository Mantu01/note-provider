import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/shared/status-badge";

describe("StatusBadge", () => {
  it("renders with payment type and paid value", () => {
    render(<StatusBadge type="payment" value="paid" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders with payment type and created value", () => {
    render(<StatusBadge type="payment" value="created" />);
    expect(screen.getByText("Awaiting payment")).toBeInTheDocument();
  });

  it("renders with payment type and failed value", () => {
    render(<StatusBadge type="payment" value="failed" />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders with fulfillment type and pending value", () => {
    render(<StatusBadge type="fulfillment" value="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders with fulfillment type and completed value", () => {
    render(<StatusBadge type="fulfillment" value="completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders with fulfillment type and cancelled value", () => {
    render(<StatusBadge type="fulfillment" value="cancelled" />);
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("renders with pricing type and free value", () => {
    render(<StatusBadge type="pricing" value="free" />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("renders with pricing type and paid value", () => {
    render(<StatusBadge type="pricing" value="paid" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders with level type and basics value", () => {
    render(<StatusBadge type="level" value="basics" />);
    expect(screen.getByText("Basics")).toBeInTheDocument();
  });

  it("renders with level type and intermediate value", () => {
    render(<StatusBadge type="level" value="intermediate" />);
    expect(screen.getByText("Intermediate")).toBeInTheDocument();
  });

  it("renders with level type and advance value", () => {
    render(<StatusBadge type="level" value="advance" />);
    expect(screen.getByText("Advanced")).toBeInTheDocument();
  });

  it("handles unknown status with default label", () => {
    render(<StatusBadge type="payment" value="unknown-status" />);
    expect(screen.getByText("unknown-status")).toBeInTheDocument();
  });

  it("handles undefined value with Unknown label", () => {
    render(<StatusBadge type="payment" />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("prefers value prop over status prop", () => {
    render(<StatusBadge type="payment" value="paid" status="failed" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.queryByText("Failed")).not.toBeInTheDocument();
  });

  it("falls back to status when value is undefined", () => {
    render(<StatusBadge type="payment" status="paid" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<StatusBadge type="payment" value="paid" className="my-badge" />);
    const badges = document.querySelectorAll('[data-slot="badge"]');
    const badge = badges[badges.length - 1];
    expect(badge).toHaveClass("my-badge");
  });
});
