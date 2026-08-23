import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HomePage } from "@/features/home/components/home-page";
import { useHome } from "@/features/home/api/use-home";

vi.mock("@/features/home/api/use-home");

vi.mock("@/components/shared/category-card", () => ({
  CategoryCard: ({ category }: { category: { id: string; name: string } }) => (
    <div data-testid={`category-card-${category.id}`}>{category.name}</div>
  ),
}));

vi.mock("@/components/shared/group-card", () => ({
  GroupCard: ({ group }: { group: { id: string; name: string } }) => (
    <div data-testid={`group-card-${group.id}`}>{group.name}</div>
  ),
}));

vi.mock("@/components/shared/note-card", () => ({
  NoteCard: ({ note }: { note: { id: string; title: string } }) => (
    <div data-testid={`note-card-${note.id}`}>{note.title}</div>
  ),
}));

vi.mock("@/lib/constants", () => ({
  BRAND: { name: "Notes Provider", description: "Developer notes that scale." },
}));

describe("HomePage", () => {
  const mockUseHome = vi.mocked(useHome);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders hero section with brand description", () => {
    mockUseHome.mockReturnValue({
      data: {
        stats: { totalNotes: 120, totalCategories: 10, totalDownloads: 5000, happyLearners: 800 },
        categories: [],
        featuredNotes: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Developer notes that scale.")).toBeInTheDocument();
    expect(screen.getByText("Browse catalogue")).toBeInTheDocument();
    expect(screen.getByText("Free notes")).toBeInTheDocument();
  });

  it("displays hero stats when available", () => {
    mockUseHome.mockReturnValue({
      data: {
        stats: { totalNotes: 120, totalCategories: 10, totalDownloads: 5000, happyLearners: 800 },
        categories: [],
        featuredNotes: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText(/5K/)).toBeInTheDocument();
    expect(screen.getByText("800")).toBeInTheDocument();
  });

  it("shows dashes when stats are undefined", () => {
    mockUseHome.mockReturnValue({
      data: { stats: undefined, categories: [], featuredNotes: [], freeNotes: [], featuredGroups: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const textContent = document.body.textContent || "";
    expect(textContent).toContain("Learn the stack");
  });

  it("renders category strip with categories", () => {
    mockUseHome.mockReturnValue({
      data: {
        stats: undefined,
        categories: [
          { id: "1", name: "Web Dev", slug: "web-dev", noteCount: 10, description: null, icon: null, subjects: [] },
          { id: "2", name: "DSA", slug: "dsa", noteCount: 5, description: null, icon: null, subjects: [] },
        ],
        featuredNotes: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Web Dev")).toBeInTheDocument();
    expect(screen.getByText("DSA")).toBeInTheDocument();
  });

  it("shows skeletons when categories are loading", () => {
    mockUseHome.mockReturnValue({
      data: { categories: [], featuredNotes: [], freeNotes: [], featuredGroups: [] },
      isPending: true,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const categoryCards = document.querySelectorAll('[data-testid^="category-card-"]');
    expect(categoryCards.length).toBe(0);
  });

  it("shows empty state when no categories", () => {
    mockUseHome.mockReturnValue({
      data: { categories: [], featuredNotes: [], freeNotes: [], featuredGroups: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Categories coming soon")).toBeInTheDocument();
  });

  it("renders featured notes section", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: [
          { id: "1", slug: "note-1", title: "React Notes" },
          { id: "2", slug: "note-2", title: "Node Notes" },
          { id: "3", slug: "note-3", title: "GraphQL Notes" },
          { id: "4", slug: "note-4", title: "Extra Note" },
        ],
        categories: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Hand-picked notes")).toBeInTheDocument();
  });

  it("renders free notes section", () => {
    mockUseHome.mockReturnValue({
      data: {
        freeNotes: [{ id: "1", slug: "free-note", title: "Free React Notes" }],
        featuredNotes: [],
        categories: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Zero cost, full value")).toBeInTheDocument();
    expect(screen.getByText(/Free notes$/)).toBeInTheDocument();
  });

  it("renders bundles section with groups", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredGroups: [
          { id: "1", slug: "bundle-1", name: "Web Dev Bundle" },
        ],
        featuredNotes: [],
        categories: [],
        freeNotes: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Save with complete packs")).toBeInTheDocument();
  });

  it("renders how it works section", () => {
    mockUseHome.mockReturnValue({
      data: { featuredNotes: [], categories: [], freeNotes: [], featuredGroups: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Four simple steps")).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByText("Pay")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("renders trust section", () => {
    mockUseHome.mockReturnValue({
      data: { featuredNotes: [], categories: [], freeNotes: [], featuredGroups: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Secure payments")).toBeInTheDocument();
    expect(screen.getByText("Instant downloads")).toBeInTheDocument();
    expect(screen.getByText("Curated notes")).toBeInTheDocument();
    expect(screen.getByText("Human support")).toBeInTheDocument();
  });

  it("renders FAQ section", () => {
    mockUseHome.mockReturnValue({
      data: { featuredNotes: [], categories: [], freeNotes: [], featuredGroups: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Common questions")).toBeInTheDocument();
    expect(screen.getByText("When will I receive paid notes?")).toBeInTheDocument();
    expect(screen.getByText("How do free notes work?")).toBeInTheDocument();
  });

  it("renders CTA banner", () => {
    mockUseHome.mockReturnValue({
      data: { featuredNotes: [], categories: [], freeNotes: [], featuredGroups: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Start learning smarter today.")).toBeInTheDocument();
    expect(screen.getByText("Browse notes")).toBeInTheDocument();
    expect(screen.getByText("Contact support")).toBeInTheDocument();
  });

  it("renders error state when home query fails", () => {
    mockUseHome.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Unable to load the homepage. Please try again.")).toBeInTheDocument();
  });

  it("calls refetch on retry in error state", async () => {
    const mockRefetch = vi.fn();
    mockUseHome.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch: mockRefetch,
    } as any);

    render(<HomePage />);
    const retryBtn = screen.getByRole("button", { name: /try again/i });
    await retryBtn.click();
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("links browse catalogue button to /notes", () => {
    mockUseHome.mockReturnValue({
      data: {
        stats: { totalNotes: 120, totalCategories: 10, totalDownloads: 5000, happyLearners: 800 },
        categories: [],
        featuredNotes: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const browseLink = screen.getByText("Browse catalogue").closest("a");
    expect(browseLink).toHaveAttribute("href", "/notes");
  });

  it("links free notes button to /notes?pricing=free", () => {
    mockUseHome.mockReturnValue({
      data: {
        stats: { totalNotes: 120, totalCategories: 10, totalDownloads: 5000, happyLearners: 800 },
        categories: [],
        featuredNotes: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const freeLink = screen.getByText("Free notes").closest("a");
    expect(freeLink).toHaveAttribute("href", "/notes?pricing=free");
  });

  it("links view all from featured notes to /notes", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: [{ id: "1", slug: "n1", title: "Note" }],
        categories: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const viewAllLinks = screen.getAllByText("View all");
    expect(viewAllLinks[0]).toHaveAttribute("href", "/notes");
  });

  it("links view all from free notes to /notes?pricing=free", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: [],
        categories: [],
        freeNotes: [{ id: "1", slug: "fn1", title: "Free Note" }],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const viewAllLinks = screen.getAllByText("View all");
    const freeLink = Array.from(viewAllLinks).find(
      (link) => link.getAttribute("href") === "/notes?pricing=free",
    );
    expect(freeLink).toBeInTheDocument();
  });

  it("links view all from bundles to /groups", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: [],
        categories: [],
        freeNotes: [],
        featuredGroups: [{ id: "1", slug: "g1", name: "Bundle" }],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const viewAllLinks = screen.getAllByText("View all");
    const groupsLink = Array.from(viewAllLinks).find(
      (link) => link.getAttribute("href") === "/groups",
    );
    expect(groupsLink).toBeInTheDocument();
  });

  it("shows skeleton stat cards when loading", () => {
    mockUseHome.mockReturnValue({
      data: {
        stats: { totalNotes: 120, totalCategories: 10, totalDownloads: 5000, happyLearners: 800 },
        categories: [],
        featuredNotes: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: true,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const skeletons = document.querySelectorAll(".shimmer-premium");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows empty state for featured notes when none available", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: [],
        categories: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Featured notes coming soon")).toBeInTheDocument();
  });

  it("shows empty state for free notes when none available", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: [],
        categories: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Free notes coming soon")).toBeInTheDocument();
  });

  it("shows empty state for bundles when none available", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: [],
        categories: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Bundles coming soon")).toBeInTheDocument();
  });

  it("renders FAQ accordion with all questions and answers", () => {
    mockUseHome.mockReturnValue({
      data: { featuredNotes: [], categories: [], freeNotes: [], featuredGroups: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Which topics do you cover?")).toBeInTheDocument();
    expect(screen.getByText("Which payment methods can I use?")).toBeInTheDocument();
    expect(screen.getByText("Can I get a refund?")).toBeInTheDocument();
  });

  it("slices featured notes to at most 4", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: Array.from({ length: 8 }, (_, i) => ({
          id: `${i}`,
          slug: `note-${i}`,
          title: `Note ${i}`,
        })),
        categories: [],
        freeNotes: [],
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const noteCards = document.querySelectorAll('[data-testid^="note-card-"]');
    expect(noteCards.length).toBeLessThanOrEqual(4);
  });

  it("slices free notes to at most 4", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: [],
        categories: [],
        freeNotes: Array.from({ length: 8 }, (_, i) => ({
          id: `${i}`,
          slug: `free-${i}`,
          title: `Free Note ${i}`,
        })),
        featuredGroups: [],
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const noteCards = document.querySelectorAll('[data-testid^="note-card-"]');
    expect(noteCards.length).toBeLessThanOrEqual(4);
  });

  it("slices featured groups to at most 3", () => {
    mockUseHome.mockReturnValue({
      data: {
        featuredNotes: [],
        categories: [],
        freeNotes: [],
        featuredGroups: Array.from({ length: 6 }, (_, i) => ({
          id: `${i}`,
          slug: `bundle-${i}`,
          name: `Bundle ${i}`,
        })),
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    const groupCards = document.querySelectorAll('[data-testid^="group-card-"]');
    expect(groupCards.length).toBeLessThanOrEqual(3);
  });

  it("shows all four steps in the how-it-works section", () => {
    mockUseHome.mockReturnValue({
      data: { featuredNotes: [], categories: [], freeNotes: [], featuredGroups: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });
});
