import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <a {...props}>{children}</a>
  ),
}));

describe("Pagination", () => {
  it("renders as a nav element with role navigation", () => {
    const { container } = render(<Pagination data-testid="pagination" />);
    const nav = container.firstChild as HTMLElement;
    expect(nav.tagName).toBe("NAV");
    ;
    expect(nav).toHaveAttribute("aria-label", "pagination");
  });

  it("applies custom className", () => {
    const { container } = render(<Pagination className="my-pagination" data-testid="pagination" />);
    const nav = container.firstChild as HTMLElement;
    expect(nav).toHaveClass("my-pagination");
  });
});

describe("PaginationContent", () => {
  it("renders as a ul element with correct data-slot", () => {
    const { container } = render(<PaginationContent data-testid="content" />);
    const ul = container.firstChild as HTMLElement;
    expect(ul.tagName).toBe("UL");
    expect(ul).toHaveAttribute("data-slot", "pagination-content");
  });

  it("applies custom className", () => {
    const { container } = render(<PaginationContent className="my-content" data-testid="content" />);
    const ul = container.firstChild as HTMLElement;
    expect(ul).toHaveClass("my-content");
  });
});

describe("PaginationItem", () => {
  it("renders as a li element with correct data-slot", () => {
    const { container } = render(<PaginationItem data-testid="item" />);
    const li = container.firstChild as HTMLElement;
    expect(li.tagName).toBe("LI");
    expect(li).toHaveAttribute("data-slot", "pagination-item");
  });
});

describe("PaginationLink", () => {
  it("renders as an inactive link by default", () => {
    render(<PaginationLink href="/page/2" data-testid="link">2</PaginationLink>);
    const link = screen.getByTestId("link");
    expect(link).toBeInTheDocument();
  });

  it("renders as an active link with aria-current", () => {
    render(<PaginationLink href="/page/1" isActive data-testid="link">1</PaginationLink>);
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("applies custom className", () => {
    const { container } = render(<PaginationLink href="/page/2" className="my-link" data-testid="link">2</PaginationLink>);
    const btn = container.closest("button") || container.firstChild;
    expect(container.querySelector(".my-link")).toBeInTheDocument();
  });
});

describe("PaginationPrevious", () => {
  it("renders with previous text and left chevron", () => {
    render(<PaginationPrevious href="/page/1" data-testid="prev" />);
    expect(screen.getByTestId("prev")).toBeInTheDocument();
  });

  it("has aria-label for accessibility", () => {
    const { container } = render(<PaginationPrevious href="/page/1" data-testid="prev" />);
    const prev = screen.getByTestId("prev");
    expect(prev).toHaveAttribute("aria-label", "Go to previous page");
  });
});

describe("PaginationNext", () => {
  it("renders with next text and right chevron", () => {
    render(<PaginationNext href="/page/3" data-testid="next" />);
    expect(screen.getByTestId("next")).toBeInTheDocument();
  });

  it("has aria-label for accessibility", () => {
    const { container } = render(<PaginationNext href="/page/3" data-testid="next" />);
    const next = screen.getByTestId("next");
    expect(next).toHaveAttribute("aria-label", "Go to next page");
  });
});

describe("PaginationEllipsis", () => {
  it("renders as a span with MoreHorizontal icon", () => {
    const { container } = render(<PaginationEllipsis data-testid="ellipsis" />);
    const span = container.firstChild as HTMLElement;
    expect(span.tagName).toBe("SPAN");
    expect(span).toHaveAttribute("data-slot", "pagination-ellipsis");
    expect(span).toHaveAttribute("aria-hidden", "true");
  });

  it("has sr-only text for accessibility", () => {
    render(<PaginationEllipsis />);
    expect(screen.getByText("More pages")).toBeInTheDocument();
  });
});

describe("Pagination full structure", () => {
  it("renders a complete pagination component", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/page/1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/page/3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("More pages")).toBeInTheDocument();
  });
});
