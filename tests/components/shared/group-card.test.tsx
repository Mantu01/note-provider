import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GroupCard } from "@/components/shared/group-card";
import type { PublicGroup } from "@/lib/types";

const makeGroup = (overrides: Partial<PublicGroup> = {}): PublicGroup => ({
  id: "g1",
  slug: "react-bundle",
  name: "React Bundle",
  description: "Complete React notes bundle",
  price: 49900,
  priceLabel: "₹499",
  compareAtPrice: null,
  coverImageUrl: null,
  noteCount: 12,
  category: { id: "c1", name: "Frontend", slug: "frontend", icon: null },
  notes: [],
  isFeatured: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

describe("GroupCard", () => {
  it("renders the group name", () => {
    render(<GroupCard group={makeGroup()} />);
    expect(screen.getByText("React Bundle")).toBeInTheDocument();
  });

  it("renders the category badge text", () => {
    render(<GroupCard group={makeGroup()} />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
  });

  it("renders the note count", () => {
    render(<GroupCard group={makeGroup()} />);
    expect(screen.getByText("12 notes")).toBeInTheDocument();
  });

  it("links to the correct group URL", () => {
    const { container } = render(<GroupCard group={makeGroup()} />);
    const links = container.querySelectorAll("a");
    const groupLink = Array.from(links).find((l) => l.getAttribute("href") === "/groups/react-bundle");
    expect(groupLink).toBeInTheDocument();
  });

  it("renders the price label", () => {
    render(<GroupCard group={makeGroup()} />);
    expect(screen.getByText("₹499")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<GroupCard group={makeGroup()} />);
    expect(screen.getByText("Complete React notes bundle")).toBeInTheDocument();
  });
});
