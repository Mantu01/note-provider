import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotesLoading from "@/app/(public)/notes/loading";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { className, ...rest } = props;
    return <img {...rest} className={className} />;
  },
}));

vi.mock("@/components/shared/shimmer-loader", () => ({
  ShimmerNoteCard: () => (
    <div data-testid="note-card-skeleton">
      <div data-slot="skeleton" className="shimmer-premium aspect-[16/9]" />
      <div data-slot="skeleton" className="shimmer-premium h-5 w-20" />
      <div data-slot="skeleton" className="shimmer-premium h-6 w-4/5" />
      <div data-slot="skeleton" className="shimmer-premium h-4 w-full" />
    </div>
  ),
  ShimmerLoader: ({ className }: { className?: string }) => (
    <div data-testid={`shimmer-${className?.replace(/\s+/g, "-")}`} className={className} />
  ),
}));

describe("NotesLoading", () => {
  it("renders skeleton placeholders", () => {
    render(<NotesLoading />);
    const skeletons = document.querySelectorAll('[data-testid="note-card-skeleton"]');
    expect(skeletons.length).toBe(12);
  });

  it("renders 12 note card skeletons", () => {
    render(<NotesLoading />);
    const skeletons = document.querySelectorAll('[data-testid="note-card-skeleton"]');
    expect(skeletons.length).toBe(12);
  });

  it("renders a top shimmer banner", () => {
    render(<NotesLoading />);
    const banner = document.querySelector("[data-testid='shimmer-h-20-rounded-xl']");
    expect(banner).toBeInTheDocument();
  });

  it("applies max-w-7xl container classes", () => {
    const { container } = render(<NotesLoading />);
    const wrapper = container.querySelector(".max-w-7xl");
    expect(wrapper).toBeInTheDocument();
  });

  it("applies responsive padding classes", () => {
    const { container } = render(<NotesLoading />);
    const wrapper = container.querySelector(".max-w-7xl");
    expect(wrapper).toHaveClass("px-4");
    expect(wrapper).toHaveClass("py-8");
  });

  it("renders skeletons in a responsive grid", () => {
    const { container } = render(<NotesLoading />);
    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("gap-2.5");
    expect(grid).toHaveClass("sm:grid-cols-2");
    expect(grid).toHaveClass("lg:grid-cols-3");
  });
});
