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

const { useNote } = await import("@/features/notes/api/use-note");
const mockUseNote = vi.mocked(useNote);

describe("NoteDetailPage", () => {
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
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="free-note" />);
    await waitFor(() => {
      expect(screen.getByText("Download PDF")).toBeInTheDocument();
    });
  });

  it("triggers download on free note button click", async () => {
    const mockDownload = vi.fn();
    vi.mocked(await import("@/hooks/use-download-file")).useDownloadFile.mockReturnValue({
      download: mockDownload,
      isDownloading: false,
    });

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
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="free-note" />);
    await waitFor(() => {
      const btn = screen.getByText("Download PDF").closest("button");
      expect(btn).toBeInTheDocument();
      btn?.click();
      expect(mockDownload).toHaveBeenCalledWith({
        url: "/api/notes/free-note/download",
        filename: "free-note.pdf",
      });
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

  it("shows premium badge for paid notes", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1",
          title: "Paid Note",
          slug: "paid-note",
          pricingType: "paid",
          price: 29900,
          priceLabel: "Rs. 299",
          compareAtPrice: null,
          coverImageUrl: null,
          category: { name: "Backend" },
          level: "advance",
          description: "Advanced backend notes",
          pageCount: 40,
          fileSizeLabel: "1.5 MB",
          downloadCount: 15,
          tags: [],
          hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="paid-note" />);
    await waitFor(() => {
      expect(screen.getByText("Premium")).toBeInTheDocument();
    });
  });

  it("does not show premium badge for free notes", async () => {
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
          level: "basics",
          description: "A free note",
          pageCount: 10,
          fileSizeLabel: null,
          downloadCount: 0,
          tags: [],
          hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="free-note" />);
    expect(screen.queryByText("Premium")).not.toBeInTheDocument();
  });

  it("shows preview dialog when note has preview", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1",
          title: "Has Preview",
          slug: "has-preview",
          pricingType: "paid",
          price: 19900,
          priceLabel: "Rs. 199",
          compareAtPrice: null,
          coverImageUrl: null,
          category: { name: "Web Dev" },
          level: "intermediate",
          description: "Note with preview",
          pageCount: 20,
          fileSizeLabel: "800 KB",
          downloadCount: 50,
          tags: [],
          hasPreview: true,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="has-preview" />);
    await waitFor(() => {
      expect(screen.getByTestId("pdf-preview")).toBeInTheDocument();
      expect(screen.getByTestId("pdf-preview")).toHaveAttribute("href", "/api/notes/has-preview/preview?mode=view");
    });
  });

  it("shows preview dialog for paid notes", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1",
          title: "Paid Note",
          slug: "paid-note",
          pricingType: "paid",
          price: 19900,
          priceLabel: "Rs. 199",
          compareAtPrice: null,
          coverImageUrl: null,
          category: { name: "Web Dev" },
          level: "intermediate",
          description: "Paid note with preview",
          pageCount: 20,
          fileSizeLabel: "800 KB",
          downloadCount: 50,
          tags: [],
          hasPreview: true,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="paid-note" />);
    await waitFor(() => {
      expect(screen.getByTestId("pdf-preview")).toBeInTheDocument();
      expect(screen.getByText("Buy now — Rs. 199")).toBeInTheDocument();
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

  it("renders tags as badges", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "beginner", description: "Desc",
          pageCount: 10, fileSizeLabel: null, downloadCount: 0, tags: ["react", "hooks"], hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="note" />);
    await waitFor(() => {
      expect(screen.getByText("#react")).toBeInTheDocument();
      expect(screen.getByText("#hooks")).toBeInTheDocument();
    });
  });

  it("hides tags section when no tags", () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "beginner", description: "Desc",
          pageCount: 10, fileSizeLabel: null, downloadCount: 0, tags: [], hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="note" />);
    expect(screen.queryByText("react")).not.toBeInTheDocument();
    expect(screen.queryByText("hooks")).not.toBeInTheDocument();
  });

  it("shows bundles section when note is in groups", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "React Basics", slug: "react-basics", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "beginner", description: "Desc",
          pageCount: 10, fileSizeLabel: "100 KB", downloadCount: 5, tags: [], hasPreview: false,
        },
        groups: [{ id: "g1", name: "React Bundle", slug: "react-bundle" }],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="react-basics" />);
    await waitFor(() => {
      expect(screen.getByText(/also available in these bundles/i)).toBeInTheDocument();
      expect(screen.getByText("React Bundle")).toBeInTheDocument();
    });
  });

  it("hides bundles section when note is not in any group", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Standalone Note", slug: "standalone", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "beginner", description: "Desc",
          pageCount: 10, fileSizeLabel: "100 KB", downloadCount: 0, tags: [], hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="standalone" />);
    expect(screen.queryByText("Also in these bundles")).not.toBeInTheDocument();
  });

  it("shows secure payment badge", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "beginner", description: "Desc",
          pageCount: 10, fileSizeLabel: null, downloadCount: 0, tags: [], hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="note" />);
    await waitFor(() => {
      expect(screen.getByText(/Secure payment/)).toBeInTheDocument();
      expect(screen.getByText(/Original content/)).toBeInTheDocument();
    });
  });

  it("renders cover image when available", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Covered Note", slug: "covered", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: "https://example.com/cover.jpg",
          category: { name: "Web Dev" }, level: "beginner", description: "Desc",
          pageCount: 10, fileSizeLabel: null, downloadCount: 0, tags: [], hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="covered" />);
    const imgs = document.querySelectorAll('img[alt=""]');
    expect(imgs.length).toBeGreaterThan(0);
  });

  it("renders without cover image fallback", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "No Cover", slug: "no-cover", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "beginner", description: "Desc",
          pageCount: null, fileSizeLabel: null, downloadCount: 0, tags: [], hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="no-cover" />);
    expect(screen.getByText("Study Note Document")).toBeInTheDocument();
  });

  it("shows page count and file size when available", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Detailed Note", slug: "detailed", pricingType: "free",
          price: 0, priceLabel: "Free", compareAtPrice: null, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "intermediate", description: "Desc",
          pageCount: 42, fileSizeLabel: "1.2 MB", downloadCount: 30, tags: [], hasPreview: false,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="detailed" />);
    await waitFor(() => {
      expect(screen.getByText(/42 pages/)).toBeInTheDocument();
      expect(screen.getByText("1.2 MB")).toBeInTheDocument();
      expect(screen.getByText(/30 downloads/)).toBeInTheDocument();
    });
  });

  it("handles grouped purchase link correctly for paid notes", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Premium Note", slug: "premium", pricingType: "paid",
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: 79900, coverImageUrl: null,
          category: { name: "Web Dev" }, level: "intermediate", description: "Desc",
          pageCount: 25, fileSizeLabel: "900 KB", downloadCount: 10, tags: [], hasPreview: true,
        },
        groups: [],
        relatedNotes: [],
      },
      refetch: vi.fn(),
    } as any);

    render(<NoteDetailPage slug="premium" />);
    await waitFor(() => {
      const buyLink = screen.getByText("Buy now — Rs. 499").closest("a");
      expect(buyLink).toHaveAttribute("href", "/checkout/premium");
    });
  });
});
