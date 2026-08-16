import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NoteCardSkeleton } from "@/components/shared/note-card-skeleton";

describe("NoteCardSkeleton", () => {
  it("renders a Card with skeleton placeholders", () => {
    const { container } = render(<NoteCardSkeleton />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders multiple skeleton elements", () => {
    const { container } = render(<NoteCardSkeleton />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(6);
  });

  it("has skeleton with animate-pulse and bg-muted classes", () => {
    const { container } = render(<NoteCardSkeleton />);
    const firstSkeleton = container.querySelector('[data-slot="skeleton"]');
    expect(firstSkeleton).toHaveClass("animate-pulse");
    expect(firstSkeleton).toHaveClass("bg-muted");
  });

  it("renders skeleton inside a Card", () => {
    const { container } = render(<NoteCardSkeleton />);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });
});
