import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PaginationBar } from "@/components/shared/pagination-bar";
import type { Pagination } from "@/lib/types";

describe("PaginationBar", () => {
  let scrollToMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollToMock = vi.fn();
    vi.stubGlobal("window", { ...window, scrollTo: scrollToMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders null when totalPages is 1", () => {
    const { container } = render(
      <PaginationBar page={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders null when pagination has only one page", () => {
    const pagination: Pagination = { page: 1, limit: 10, total: 5, totalPages: 1, hasNext: false, hasPrev: false };
    const { container } = render(
      <PaginationBar pagination={pagination} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows prev button when has prev pages", () => {
    render(
      <PaginationBar page={2} totalPages={5} onPageChange={vi.fn()} />
    );
    const buttons = document.querySelectorAll('button, [role="button"]');
    const prevBtn = Array.from(buttons).find((b) => b.getAttribute("aria-label") === "Go to previous page");
    expect(prevBtn).toBeInTheDocument();
  });

  it("shows next button when has next pages", () => {
    render(
      <PaginationBar page={2} totalPages={5} onPageChange={vi.fn()} />
    );
    const buttons = document.querySelectorAll('button, [role="button"]');
    const nextBtn = Array.from(buttons).find((b) => b.getAttribute("aria-label") === "Go to next page");
    expect(nextBtn).toBeInTheDocument();
  });

  it("shows current page indicator", () => {
    render(
      <PaginationBar page={3} totalPages={10} onPageChange={vi.fn()} />
    );
    expect(screen.getByText("Page 3 of 10")).toBeInTheDocument();
  });

  it("disables prev button at page 1", () => {
    const { container } = render(
      <PaginationBar page={1} totalPages={5} onPageChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll('button, [role="button"]');
    const prevBtn = Array.from(buttons).find((b) => b.getAttribute("aria-label") === "Go to previous page");
    expect(prevBtn).toHaveAttribute("aria-disabled", "true");
  });

  it("disables next button at last page", () => {
    const { container } = render(
      <PaginationBar page={5} totalPages={5} onPageChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll('button, [role="button"]');
    const nextBtn = Array.from(buttons).find((b) => b.getAttribute("aria-label") === "Go to next page");
    expect(nextBtn).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onPageChange with previous page when prev is clicked", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    render(
      <PaginationBar page={2} totalPages={5} onPageChange={handlePageChange} />
    );
    const buttons = document.querySelectorAll('button, [role="button"]');
    const prevBtn = Array.from(buttons).find((b) => b.getAttribute("aria-label") === "Go to previous page");
    if (prevBtn) await user.click(prevBtn);
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with next page when next is clicked", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    render(
      <PaginationBar page={2} totalPages={5} onPageChange={handlePageChange} />
    );
    const buttons = document.querySelectorAll('button, [role="button"]');
    const nextBtn = Array.from(buttons).find((b) => b.getAttribute("aria-label") === "Go to next page");
    if (nextBtn) await user.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("does not call onPageChange when prev is clicked at page 1", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    render(
      <PaginationBar page={1} totalPages={5} onPageChange={handlePageChange} />
    );
    const buttons = document.querySelectorAll('button, [role="button"]');
    const prevBtn = Array.from(buttons).find((b) => b.getAttribute("aria-label") === "Go to previous page");
    if (prevBtn) await user.click(prevBtn);
    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it("does not call onPageChange when next is clicked at last page", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    render(
      <PaginationBar page={5} totalPages={5} onPageChange={handlePageChange} />
    );
    const buttons = document.querySelectorAll('button, [role="button"]');
    const nextBtn = Array.from(buttons).find((b) => b.getAttribute("aria-label") === "Go to next page");
    if (nextBtn) await user.click(nextBtn);
    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it("accepts pagination object prop", () => {
    const pagination: Pagination = { page: 2, limit: 10, total: 25, totalPages: 3, hasNext: true, hasPrev: true };
    render(
      <PaginationBar pagination={pagination} onPageChange={vi.fn()} />
    );
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
  });

  it("accepts page and totalPages props", () => {
    render(
      <PaginationBar page={4} totalPages={10} onPageChange={vi.fn()} />
    );
    expect(screen.getByText("Page 4 of 10")).toBeInTheDocument();
  });
});
