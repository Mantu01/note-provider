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

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    useParams: vi.fn(() => ({ slug: "test-slug" })),
    notFound: vi.fn(),
  };
});

const { useGroup } = await import("@/features/groups/api/use-group");
const mockUseGroup = vi.mocked(useGroup);

describe("GroupDetailRoute", () => {
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

  it("renders group title on success", async () => {
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
      expect(screen.getAllByText("React Complete Bundle")[0]).toBeInTheDocument();
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
    });
  });

  it("shows included notes section", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Bundle", slug: "bundle", price: 99900, priceLabel: "Rs. 999",
          compareAtPrice: null, noteCount: 2, category: { name: "Web Dev" },
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
      expect(screen.getByText("2 notes included")).toBeInTheDocument();
    });
  });

  it("shows buy bundle button", async () => {
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
    });
  });
});
