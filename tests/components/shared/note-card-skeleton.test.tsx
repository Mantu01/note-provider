import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NoteCardSkeleton } from "@/components/shared/note-card-skeleton";

describe("NoteCardSkeleton", () => {
  it("renders a Card with skeleton placeholders", () => {
    const { container } = render(<NoteCardSkeleton />);
    const skeletons = container.querySelectorAll('.shimmer-premium');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders multiple skeleton elements", () => {
    const { container } = render(<NoteCardSkeleton />);
    const skeletons = container.querySelectorAll('.shimmer-premium');
    expect(skeletons.length).toBeGreaterThanOrEqual(6);
  });

  it("has skeleton with shimmer-premium class", () => {
    const { container } = render(<NoteCardSkeleton />);
    const firstSkeleton = container.querySelector('.shimmer-premium');
    expect(firstSkeleton).toBeInTheDocument();
    expect(firstSkeleton).toHaveClass("shimmer-premium");
  });

  it("renders skeleton inside a Card", () => {
    const { container } = render(<NoteCardSkeleton />);
    const card = container.querySelector('.overflow-hidden');
    expect(card).toBeInTheDocument();
  });
});
