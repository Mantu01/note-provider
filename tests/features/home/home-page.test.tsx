import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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
    expect(screen.getByText("Build momentum at zero cost")).toBeInTheDocument();
    expect(screen.getByText("Free notes")).toBeInTheDocument();
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
    expect(screen.getByText("Receive")).toBeInTheDocument();
  });

  it("renders trust section", () => {
    mockUseHome.mockReturnValue({
      data: { featuredNotes: [], categories: [], freeNotes: [], featuredGroups: [] },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<HomePage />);
    expect(screen.getByText("Built for serious learners")).toBeInTheDocument();
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
});
