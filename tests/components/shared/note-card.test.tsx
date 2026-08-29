import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NoteCard } from "@/components/shared/note-card";
import type { PublicNote } from "@/lib/types";

const makeNote = (overrides: Partial<PublicNote> = {}): PublicNote => ({
  id: "n1",
  slug: "javascript-basics",
  title: "JavaScript Basics",
  description: "Learn JavaScript from scratch",
  price: 0,
  priceLabel: "Free",
  pricingType: "free",
  level: "basics",
  pageCount: 50,
  compareAtPrice: null,
  coverImageUrl: null,
  category: { id: "c1", name: "Programming", slug: "programming", icon: null },
  tags: ["javascript", "basics"],
  downloadCount: 120,
  purchaseCount: 0,
  isLocked: false,
  hasPreview: false,
  isFeatured: false,
  fileSizeLabel: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

describe("NoteCard", () => {
  it("renders the note title", () => {
    render(<NoteCard note={makeNote()} />);
    expect(screen.getByText("JavaScript Basics")).toBeInTheDocument();
  });

  it("renders the category badge text", () => {
    render(<NoteCard note={makeNote()} />);
    expect(screen.getByText("Programming")).toBeInTheDocument();
  });

  it("renders the level badge as 'Basics'", () => {
    render(<NoteCard note={makeNote()} />);
    expect(screen.getByText("Basics")).toBeInTheDocument();
  });

  it("shows 'Premium' badge when pricingType is paid", () => {
    render(<NoteCard note={makeNote({ pricingType: "paid" })} />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });

  it("does not show 'Premium' badge when pricingType is free", () => {
    render(<NoteCard note={makeNote({ pricingType: "free" })} />);
    expect(screen.queryByText("Paid")).not.toBeInTheDocument();
  });

  it("links to the correct note URL", () => {
    const { container } = render(<NoteCard note={makeNote()} />);
    const links = container.querySelectorAll("a");
    const noteLink = Array.from(links).find((l) => l.getAttribute("href") === "/notes/javascript-basics");
    expect(noteLink).toBeInTheDocument();
  });

  it("renders description in default variant", () => {
    render(<NoteCard note={makeNote()} />);
    expect(screen.getByText("Learn JavaScript from scratch")).toBeInTheDocument();
  });

  it("hides description in compact variant", () => {
    const { container } = render(<NoteCard note={makeNote()} variant="compact" />);
    expect(container.querySelector(".line-clamp-2")).not.toBeInTheDocument();
  });

  it("renders with compact width class", () => {
    const { container } = render(<NoteCard note={makeNote()} variant="compact" />);
    expect(container.querySelector(".w-28")).toBeInTheDocument();
  });

  it("shows page count in default variant", () => {
    render(<NoteCard note={makeNote({ pageCount: 50 })} />);
    expect(screen.getByText("50 pg")).toBeInTheDocument();
  });

  it("does not show page count in compact variant", () => {
    render(<NoteCard note={makeNote({ pageCount: 50 })} variant="compact" />);
    expect(screen.queryByText("50 pg")).not.toBeInTheDocument();
  });
});
