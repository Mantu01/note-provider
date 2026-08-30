import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { GroupsPage } from "@/features/groups/components/groups-catalogue";

vi.mock("@/features/groups/api/use-groups", () => ({
  useGroups: vi.fn(),
}));

vi.mock("@/components/shared/group-card", () => ({
  GroupCard: ({ group }: { group: { id: string; name: string } }) => (
    <div data-testid={`group-card-${group.id}`}>{group.name}</div>
  ),
}));

vi.mock("@/components/shared/empty-state", () => ({
  EmptyState: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="empty-state">
      <span>{title}</span>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock("@/components/shared/error-state", () => ({
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <button onClick={onRetry} data-testid="error-retry">Retry</button>
  ),
}));

const { useGroups } = await import("@/features/groups/api/use-groups");
const mockUseGroups = vi.mocked(useGroups);

describe("GroupsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseGroups.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<GroupsPage />);
    expect(document.querySelector(".shimmer-premium")).toBeInTheDocument();
  });

  it("renders error state when groups query fails", async () => {
    mockUseGroups.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<GroupsPage />);
    await waitFor(() => {
      expect(screen.getByTestId("error-retry")).toBeInTheDocument();
    });
  });

  it("renders group cards when data is available", async () => {
    mockUseGroups.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [
          { id: "1", slug: "bundle-1", name: "React Bundle", price: 99900 },
          { id: "2", slug: "bundle-2", name: "Node Bundle", price: 79900 },
        ],
        pagination: { total: 2, page: 1, limit: 12, totalPages: 1 },
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupsPage />);
    await waitFor(() => {
      expect(screen.getByText("React Bundle")).toBeInTheDocument();
      expect(screen.getByText("Node Bundle")).toBeInTheDocument();
    });
  });

  it("shows empty state when no groups are available", async () => {
    mockUseGroups.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [],
        pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupsPage />);
    await waitFor(() => {
      expect(screen.getByText("Bundles are coming soon")).toBeInTheDocument();
      expect(screen.getByText("We are assembling our first value-packed note collections.")).toBeInTheDocument();
    });
  });

  it("fetches with limit of 12", () => {
    mockUseGroups.mockReturnValue({
      isPending: false,
      isError: false,
      data: { items: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } },
      refetch: vi.fn(),
    } as any);

    render(<GroupsPage />);
    expect(mockUseGroups).toHaveBeenCalledWith({ limit: 12 });
  });

  it("renders grid layout with multiple groups", async () => {
    mockUseGroups.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: Array.from({ length: 6 }, (_, i) => ({ id: `${i}`, slug: `bundle-${i}`, name: `Bundle ${i}` })),
        pagination: { total: 6, page: 1, limit: 12, totalPages: 1 },
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupsPage />);
    await waitFor(() => {
      const cards = document.querySelectorAll('[data-testid^="group-card-"]');
      expect(cards.length).toBe(6);
    });
  });

  it("displays total count in heading", async () => {
    mockUseGroups.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [{ id: "1", slug: "b1", name: "Bundle One" }],
        pagination: { total: 1, page: 1, limit: 12, totalPages: 1 },
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupsPage />);
    await waitFor(() => {
      expect(screen.getByText("1 bundle available")).toBeInTheDocument();
    });
  });

  it("shows plural count for multiple bundles", async () => {
    mockUseGroups.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [
          { id: "1", slug: "b1", name: "Bundle A" },
          { id: "2", slug: "b2", name: "Bundle B" },
          { id: "3", slug: "b3", name: "Bundle C" },
        ],
        pagination: { total: 3, page: 1, limit: 12, totalPages: 1 },
      },
      refetch: vi.fn(),
    } as any);

    render(<GroupsPage />);
    await waitFor(() => {
      expect(screen.getByText("3 bundles available")).toBeInTheDocument();
    });
  });

  it("shows loading text while fetching", () => {
    mockUseGroups.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<GroupsPage />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it("calls refetch on retry button click", async () => {
    const mockRefetch = vi.fn();
    mockUseGroups.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: mockRefetch,
    } as any);

    render(<GroupsPage />);
    await waitFor(() => {
      const btn = screen.getByTestId("error-retry");
      expect(btn).toBeInTheDocument();
      btn.click();
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });
});
