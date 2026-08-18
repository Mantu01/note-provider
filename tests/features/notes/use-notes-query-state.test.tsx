import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useNotesQueryState } from "@/features/notes/hooks/use-notes-query-state";
import { DEFAULT_PAGE_LIMIT, NOTE_SORTS } from "@/lib/constants";

vi.mock("nuqs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("nuqs")>();
  return {
    ...actual,
    useQueryStates: vi.fn(),
  };
});

const { useQueryStates } = await import("nuqs");

describe("useNotesQueryState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns default state values", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: [],
        level: [],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: "newest" as const,
        view: "grid" as const,
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.state.q).toBe("");
    expect(result.current.state.page).toBe(1);
    expect(result.current.state.limit).toBe(DEFAULT_PAGE_LIMIT);
    expect(result.current.state.sort).toBe("newest");
    expect(result.current.state.view).toBe("grid");
    expect(result.current.state.category).toEqual([]);
    expect(result.current.state.level).toEqual([]);
    expect(result.current.state.pricing).toBe("");
    expect(result.current.state.minPrice).toBeNull();
    expect(result.current.state.maxPrice).toBeNull();
  });

  it("returns custom state values when provided", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "react",
        page: 2,
        limit: 20,
        category: ["webdev"],
        level: ["intermediate"],
        pricing: "paid",
        minPrice: 100,
        maxPrice: 500,
        sort: "price_asc" as const,
        view: "list" as const,
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.state.q).toBe("react");
    expect(result.current.state.page).toBe(2);
    expect(result.current.state.limit).toBe(20);
    expect(result.current.state.category).toEqual(["webdev"]);
    expect(result.current.state.level).toEqual(["intermediate"]);
    expect(result.current.state.pricing).toBe("paid");
    expect(result.current.state.sort).toBe("price_asc");
    expect(result.current.state.view).toBe("list");
  });

  it("calls setState with merged values on setFilter", () => {
    const setState = vi.fn();
    (useQueryStates as any).mockReturnValue([{ page: 1, category: [], level: [] }, setState]);

    const { result } = renderHook(() => useNotesQueryState());
    result.current.setFilter({ q: "test", page: 3 });
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ q: "test", page: 3 }));
  });

  it("resets page to 1 when setFilter is called with other values", () => {
    const setState = vi.fn();
    (useQueryStates as any).mockReturnValue([{ page: 5, category: [], level: [] }, setState]);

    const { result } = renderHook(() => useNotesQueryState());
    result.current.setFilter({ q: "new-search" });
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
  });

  it("clearFilters resets all state to defaults", () => {
    const setState = vi.fn();
    (useQueryStates as any).mockReturnValue([{ page: 3, q: "search", category: [], level: [] }, setState]);

    const { result } = renderHook(() => useNotesQueryState());
    result.current.clearFilters();
    expect(setState).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "",
        category: [],
        level: [],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: "newest",
        page: 1,
      })
    );
  });

  it("calculates activeFilterCount correctly", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "react",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: ["dsa"],
        level: [],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: "newest",
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.activeFilterCount).toBe(2);
  });

  it("counts zero active filters when all empty", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: [],
        level: [],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: "newest",
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.activeFilterCount).toBe(0);
  });

  it("counts price range as active filters", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: [],
        level: [],
        pricing: "paid",
        minPrice: 100,
        maxPrice: 500,
        sort: "newest",
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.activeFilterCount).toBe(3);
  });

  it("does not count empty string pricing as active", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: [],
        level: [],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: "newest",
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.activeFilterCount).toBe(0);
  });

  it("returns setFilter and clearFilters functions", () => {
    (useQueryStates as any).mockReturnValue([{ page: 1, category: [], level: [] }, vi.fn()]);
    const { result } = renderHook(() => useNotesQueryState());
    expect(typeof result.current.setFilter).toBe("function");
    expect(typeof result.current.clearFilters).toBe("function");
  });

  it("handles category and level arrays in activeFilterCount", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: ["webdev", "dsa"],
        level: ["basics"],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: "newest",
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.activeFilterCount).toBe(3);
  });

  it("uses NOTE_SORTS for sort default", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: [],
        level: [],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: NOTE_SORTS[0],
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(NOTE_SORTS).toContain(result.current.state.sort);
  });

  it("returns state object with correct shape", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: [],
        level: [],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: "newest",
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.state).toHaveProperty("q");
    expect(result.current.state).toHaveProperty("page");
    expect(result.current.state).toHaveProperty("limit");
    expect(result.current.state).toHaveProperty("category");
    expect(result.current.state).toHaveProperty("level");
    expect(result.current.state).toHaveProperty("pricing");
    expect(result.current.state).toHaveProperty("sort");
    expect(result.current.state).toHaveProperty("view");
  });

  it("passes empty strings through clearFilters to reset query", () => {
    const setState = vi.fn();
    (useQueryStates as any).mockReturnValue([{ page: 2, q: "filtered", pricing: "paid", category: ["a"], level: ["b"] }, setState]);

    const { result } = renderHook(() => useNotesQueryState());
    result.current.clearFilters();
    expect(setState).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "",
        pricing: "",
      })
    );
  });

  it("setFilter does not override unspecified fields", () => {
    const setState = vi.fn();
    (useQueryStates as any).mockReturnValue([{ page: 1, category: ["a", "b"], level: [], sort: "popular" as const }, setState]);

    const { result } = renderHook(() => useNotesQueryState());
    result.current.setFilter({ q: "react" });
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ q: "react", page: 1 }));
  });

  it("activeFilterCount counts individual category entries", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: ["react", "nextjs"],
        level: ["intermediate"],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: "newest",
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.activeFilterCount).toBe(3);
  });

  it("activeFilterCount counts individual level entries", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: [],
        level: ["basics", "advance"],
        pricing: "",
        minPrice: null,
        maxPrice: null,
        sort: "newest",
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.activeFilterCount).toBe(2);
  });

  it("activeFilterCount handles null min/max price correctly", () => {
    (useQueryStates as any).mockReturnValue([
      {
        q: "",
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        category: [],
        level: [],
        pricing: "free",
        minPrice: null,
        maxPrice: null,
        sort: "newest",
        view: "grid",
      },
      vi.fn(),
    ]);

    const { result } = renderHook(() => useNotesQueryState());
    expect(result.current.activeFilterCount).toBe(1);
  });

  it("clearFilters also resets minPrice and maxPrice to null", () => {
    const setState = vi.fn();
    (useQueryStates as any).mockReturnValue([{ page: 1, minPrice: 100, maxPrice: 500, category: [], level: [] }, setState]);

    const { result } = renderHook(() => useNotesQueryState());
    result.current.clearFilters();
    expect(setState).toHaveBeenCalledWith(
      expect.objectContaining({
        minPrice: null,
        maxPrice: null,
      })
    );
  });

  it("setFilter with explicit page does not overwrite to 1", () => {
    const setState = vi.fn();
    (useQueryStates as any).mockReturnValue([{ page: 1, category: [], level: [] }, setState]);

    const { result } = renderHook(() => useNotesQueryState());
    result.current.setFilter({ page: 5, sort: "popular" });
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ page: 5, sort: "popular" }));
  });
});
