import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "vitest-canvas-mock";

// Clear rate limit store between test files to prevent cross-test interference
afterEach(() => {
  cleanup();
  // Reset the global rate limit store
  const store = (globalThis as any).__rateLimitStore;
  if (store) store.clear();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

const mockSearchParams = new URLSearchParams();
const mockSetSearchParams = vi.fn();

vi.mock("nuqs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("nuqs")>();
  return {
    ...actual,
    useQueryStates: vi.fn(() => [{ page: 1, search: "" }, vi.fn()]),
    useQueryState: vi.fn(() => ["", vi.fn()]),
  };
});

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      pathname: "/",
      query: {},
    })),
    useSearchParams: vi.fn(() => mockSearchParams),
    usePathname: vi.fn(() => "/"),
  };
});
