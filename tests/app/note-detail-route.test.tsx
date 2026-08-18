import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { NoteDetailPage } from "@/features/notes/components/note-detail-page";

vi.mock("@/features/notes/api/use-note", () => ({
  useNote: vi.fn(),
}));

vi.mock("@/hooks/use-download-file", () => ({
  useDownloadFile: vi.fn(() => ({ download: vi.fn(), isDownloading: false })),
}));

vi.mock("@/components/shared/error-state", () => ({
  ErrorState: ({ message, onRetry }: { message?: string; onRetry: () => void }) => (
    <div data-testid="error-state">
      <p>{message || "Error"}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

vi.mock("@/components/shared/note-card", () => ({
  NoteCard: ({ note }: { note: { id: string; title: string } }) => (
    <div data-testid={`note-card-${note.id}`}>{note.title}</div>
  ),
}));

vi.mock("@/components/shared/group-card", () => ({
  GroupCard: ({ group }: { group: { id: string; name: string } }) => (
    <div data-testid={`group-card-${group.id}`}>{group.name}</div>
  ),
}));

vi.mock("@/components/shared/price-tag", () => ({
  PriceTag: ({ priceLabel }: { priceLabel?: string }) => (
    <span data-testid="price-tag">{priceLabel || "Free"}</span>
  ),
}));

vi.mock("@/components/shared/status-badge", () => ({
  StatusBadge: ({ value }: { value?: string }) => (
    <span data-testid="status-badge">{value || ""}</span>
  ),
}));

vi.mock("@/components/shared/pdf-preview-dialog", () => ({
  PdfPreviewDialog: ({ url }: { url: string }) => (
    <a href={url} data-testid="pdf-preview">Preview PDF</a>
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

const { useNote } = await import("@/features/notes/api/use-note");
const mockUseNote = vi.mocked(useNote);

describe("NoteDetailRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton while fetching", () => {
    mockUseNote.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="react-notes" />);
    expect(document.querySelector(".shimmer-premium")).toBeInTheDocument();
  });

  it("renders error state when note not found", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="not-found" />);
    await waitFor(() => {
      expect(screen.getByTestId("error-state")).toBeInTheDocument();
    });
  });

  it("renders note title and description on success", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1",
          title: "React Notes",
          slug: "react-notes",
          description: "Comprehensive React guide",
          level: "beginner",
          price: 0,
          priceLabel: "Free",
          compareAtPrice: null,
          pricingType: "free",
          hasPreview: false,
          pageCount: 50,
          fileSizeLabel: "2 MB",
          downloadCount: 100,
          category: { name: "Web Development" },
          tags: ["react", "frontend"],
          coverImageUrl: null,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="react-notes" />);
    const titles = screen.getAllByText(/React Notes/);
    expect(titles[0]).toBeInTheDocument();
    expect(screen.getByText("Comprehensive React guide")).toBeInTheDocument();
    expect(screen.getByText(/50 pages/)).toBeInTheDocument();
    expect(screen.getByText(/100 downloads/)).toBeInTheDocument();
  });

  it("renders breadcrumb navigation", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: { id: "1", title: "Test Note", slug: "test-note", category: { name: "Web Dev" }, level: "beginner", description: "Desc", price: 0, priceLabel: "Free", compareAtPrice: null, pricingType: "free", hasPreview: false, pageCount: 10, fileSizeLabel: "100 KB", downloadCount: 0, tags: [], coverImageUrl: null },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="test-note" />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("shows download button for free notes", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1",
          title: "Free Note",
          slug: "free-note",
          pricingType: "free",
          price: 0,
          priceLabel: "Free",
          compareAtPrice: null,
          coverImageUrl: null,
          category: { name: "Web Dev" },
          level: "beginner",
          description: "A free note",
          pageCount: 10,
          fileSizeLabel: "500 KB",
          downloadCount: 5,
          tags: [],
          hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="free-note" />);
    await waitFor(() => {
      expect(screen.getByText("Download PDF")).toBeInTheDocument();
      expect(screen.getByText("No sign-up required. Instant download.")).toBeInTheDocument();
    });
  });

  it("shows buy button for paid notes", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1",
          title: "Premium Note",
          slug: "premium-note",
          pricingType: "paid",
          price: 49900,
          priceLabel: "Rs. 499",
          compareAtPrice: 99900,
          coverImageUrl: null,
          category: { name: "Web Dev" },
          level: "intermediate",
          description: "A premium note",
          pageCount: 30,
          fileSizeLabel: "1 MB",
          downloadCount: 20,
          tags: ["typescript"],
          hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="premium-note" />);
    await waitFor(() => {
      expect(screen.getByText("Buy now — Rs. 499")).toBeInTheDocument();
      expect(screen.getByText("Full notes locked")).toBeInTheDocument();
    });
  });

  it("shows related notes section when available", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note 1", slug: "note-1", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "beginner", description: "Desc",
          pageCount: 10, fileSizeLabel: "100 KB", downloadCount: 0, tags: [], hasPreview: false,
        },
        relatedNotes: [{ id: "2", title: "Related Note" }],
        groups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="note-1" />);
    await waitFor(() => {
      expect(screen.getByText("Related notes")).toBeInTheDocument();
      expect(screen.getByText("Related Note")).toBeInTheDocument();
    });
  });

  it("hides related notes section when empty", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note 1", slug: "note-1", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "beginner", description: "Desc",
          pageCount: 10, fileSizeLabel: "100 KB", downloadCount: 0, tags: [], hasPreview: false,
        },
        relatedNotes: [],
        groups: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="note-1" />);
    await waitFor(() => {
      expect(screen.queryByText("Related notes")).not.toBeInTheDocument();
    });
  });
});
