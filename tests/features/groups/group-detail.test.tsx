import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { GroupDetailPage } from "@/features/groups/components/group-detail";

vi.mock("@/features/groups/api/use-group", () => ({
  useGroup: vi.fn(),
}));

vi.mock("@/components/shared/error-state", () => ({
  ErrorState: ({ message, onRetry }: { message?: string; onRetry: () => void }) => (
    <div data-testid="error-state">
      <p>{message || "Error"}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
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

vi.mock("@/components/shared/price-tag", () => ({
  PriceTag: ({ priceLabel }: { priceLabel?: string }) => (
    <span data-testid="price-tag">{priceLabel || "Free"}</span>
  ),
}));

const { useGroup } = await import("@/features/groups/api/use-group");
const mockUseGroup = vi.mocked(useGroup);

describe("GroupDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton while fetching", () => {
    mockUseGroup.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="react-bundle" />);
    expect(document.querySelector(".shimmer-premium")).toBeInTheDocument();
  });

  it("renders error state when group not found", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="not-found" />);
    await waitFor(() => {
      expect(screen.getByText("This bundle is unavailable.")).toBeInTheDocument();
    });
  });

  it("renders group title and description on success", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1",
          name: "React Complete Bundle",
          slug: "react-bundle",
          description: "Complete React study notes",
          price: 99900,
          priceLabel: "Rs. 999",
          compareAtPrice: 199900,
          noteCount: 5,
          category: { name: "Web Development" },
          coverImageUrl: null,
          notes: [{ id: "1", title: "React Basics", price: 49900 }, { id: "2", title: "React Advanced", price: 50000 }],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="react-bundle" />);
    await waitFor(() => {
      const headings = screen.getAllByText("React Complete Bundle");
      expect(headings[0]).toBeInTheDocument();
      expect(screen.getByText("Complete React study notes")).toBeInTheDocument();
      expect(screen.getByText("5 notes included")).toBeInTheDocument();
    });
  });

  it("renders breadcrumb navigation", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: { id: "1", name: "Test Bundle", slug: "test-bundle", notes: [{ price: 100 }], category: { name: "Web Dev" } },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="test-bundle" />);
    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Bundles")).toBeInTheDocument();
      const bundleTexts = screen.getAllByText("Test Bundle");
      expect(bundleTexts[0]).toBeInTheDocument();
    });
  });

  it("shows included notes section", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Bundle", slug: "bundle", price: 99900, priceLabel: "Rs. 999",
          compareAtPrice: 199900, noteCount: 2, category: { name: "Web Dev" },
          coverImageUrl: null, notes: [
            { id: "1", title: "Note 1", price: 50000 },
            { id: "2", title: "Note 2", price: 49900 },
          ],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="bundle" />);
    await waitFor(() => {
      expect(screen.getByText(/complete pack/i)).toBeInTheDocument();
      expect(screen.getByText("Note 1")).toBeInTheDocument();
      expect(screen.getByText("Note 2")).toBeInTheDocument();
    });
  });

  it("shows buy bundle button linking to checkout", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Bundle", slug: "bundle", price: 99900, priceLabel: "Rs. 999",
          compareAtPrice: null, noteCount: 1, category: { name: "Web Dev" },
          coverImageUrl: null, notes: [{ id: "1", title: "Note", price: 99900 }],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="bundle" />);
    await waitFor(() => {
      expect(screen.getByText("Buy this bundle")).toBeInTheDocument();
      const buyLink = screen.getByText("Buy this bundle").closest("a");
      expect(buyLink).toHaveAttribute("href", "/checkout/bundle?itemType=group");
    });
  });

  it("shows related groups section when available", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Bundle", slug: "bundle", price: 99900, priceLabel: "Rs. 999",
          compareAtPrice: null, noteCount: 1, category: { name: "Web Dev" },
          coverImageUrl: null, notes: [{ id: "1", title: "Note", price: 99900 }],
        },
        relatedGroups: [{ id: "2", name: "Related Bundle", slug: "related" }],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="bundle" />);
    await waitFor(() => {
      expect(screen.getByText(/more bundles you might like/i)).toBeInTheDocument();
      expect(screen.getByText("Related Bundle")).toBeInTheDocument();
    });
  });

  it("hides related groups section when empty", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Bundle", slug: "bundle", price: 99900, priceLabel: "Rs. 999",
          compareAtPrice: null, noteCount: 1, category: { name: "Web Dev" },
          coverImageUrl: null, notes: [{ id: "1", title: "Note", price: 99900 }],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="bundle" />);
    await waitFor(() => {
      expect(screen.queryByText(/more bundles you might like/i)).not.toBeInTheDocument();
    });
  });

  it("calculates individual value from notes", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Bundle", slug: "bundle", price: 99900, priceLabel: "Rs. 999",
          compareAtPrice: null, noteCount: 2, category: { name: "Web Dev" },
          coverImageUrl: null, notes: [
            { id: "1", title: "Note 1", price: 50000 },
            { id: "2", title: "Note 2", price: 60000 },
          ],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="bundle" />);
    await waitFor(() => {
      expect(screen.getByText(/individual value/i)).toBeInTheDocument();
    });
  });

  it("renders category label with bundle suffix", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Test Bundle", slug: "test-bundle", price: 49900, priceLabel: "Rs. 499",
          compareAtPrice: null, noteCount: 1, category: { name: "Frontend" },
          coverImageUrl: null, notes: [{ id: "1", title: "React Notes", price: 49900 }],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="test-bundle" />);
    await waitFor(() => {
      expect(screen.getByText(/frontend\s*bundle/i)).toBeInTheDocument();
    });
  });

  it("shows delivery text in sticky aside", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Bundle", slug: "bundle", price: 99900, priceLabel: "Rs. 999",
          compareAtPrice: null, noteCount: 1, category: { name: "Web Dev" },
          coverImageUrl: null, notes: [{ id: "1", title: "Note", price: 99900 }],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="bundle" />);
    await waitFor(() => {
      expect(screen.getByText(/delivered within 4–6 hours/i)).toBeInTheDocument();
    });
  });

  it("renders with cover image when available", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Covered Bundle", slug: "covered-bundle", price: 99900, priceLabel: "Rs. 999",
          compareAtPrice: null, noteCount: 1, category: { name: "Web Dev" },
          coverImageUrl: "https://example.com/cover.jpg",
          notes: [{ id: "1", title: "Note", price: 99900 }],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="covered-bundle" />);
    await waitFor(() => {
      const imgs = document.querySelectorAll('img[alt=""]');
      expect(imgs.length).toBeGreaterThan(0);
    });
  });

  it("shows placeholder when no cover image", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "No Cover Bundle", slug: "no-cover", price: 49900, priceLabel: "Rs. 499",
          compareAtPrice: null, noteCount: 1, category: { name: "Web Dev" },
          coverImageUrl: null,
          notes: [{ id: "1", title: "Note", price: 49900 }],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="no-cover" />);
    expect(document.querySelector(".bg-muted\\/30") || document.querySelector(".flex.h-full")).toBeInTheDocument();
  });

  it("renders multiple included notes", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Big Bundle", slug: "big-bundle", price: 199900, priceLabel: "Rs. 1,999",
          compareAtPrice: 299900, noteCount: 4, category: { name: "Full Stack" },
          coverImageUrl: null,
          notes: [
            { id: "1", title: "React", price: 49900 },
            { id: "2", title: "Node", price: 49900 },
            { id: "3", title: "GraphQL", price: 49900 },
            { id: "4", title: "PostgreSQL", price: 49900 },
          ],
        },
        relatedGroups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupDetailPage slug="big-bundle" />);
    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Node")).toBeInTheDocument();
      expect(screen.getByText("GraphQL")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("4 notes included")).toBeInTheDocument();
    });
  });
});
