import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryCard } from "@/components/shared/category-card";
import type { PublicCategory } from "@/lib/types";

const makeCategory = (overrides: Partial<PublicCategory> = {}): PublicCategory => ({
  id: "cat1",
  name: "Web Development",
  slug: "web-development",
  description: null,
  icon: null,
  subjects: [],
  noteCount: 42,
  ...overrides,
});

describe("CategoryCard", () => {
  it("renders the category name", () => {
    render(<CategoryCard category={makeCategory()} />);
    expect(screen.getByText("Web Development")).toBeInTheDocument();
  });

  it("renders the correct note count with plural 'notes'", () => {
    render(<CategoryCard category={makeCategory({ noteCount: 5 })} />);
    expect(screen.getByText("5 notes")).toBeInTheDocument();
  });

  it("renders singular 'note' when count is 1", () => {
    render(<CategoryCard category={makeCategory({ noteCount: 1 })} />);
    expect(screen.getByText("1 note")).toBeInTheDocument();
  });

  it("links to the correct category URL", () => {
    const { container } = render(<CategoryCard category={makeCategory()} />);
    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", "/notes?category=web-development");
  });

  it("URL-encodes the category slug", () => {
    const { container } = render(<CategoryCard category={makeCategory({ slug: "my-category" })} />);
    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", "/notes?category=my-category");
  });
});
